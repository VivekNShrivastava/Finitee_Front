import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, IonInput } from '@ionic/angular'; 
import { ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { AddressMap } from '../../models/places/Address';

@Component({
  standalone: true,
  selector: 'app-mapLocation',
  templateUrl: './mapLocation.component.html',
  styleUrls: ['./mapLocation.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapLocation  implements OnInit {

  @ViewChild('map_location') mapElement!: ElementRef<HTMLElement>;

  map?: google.maps.Map = undefined;
  marker: any;
  isBackEnabled = true;
  searchInput: string = '';
  eventLocation: any;

  constructor(private modalController: ModalController, private zone: NgZone,
    public locationService: LocationService) {}

  ngOnInit() {
    console.log("loading map...");
  }

  async ngAfterViewInit(){
    this.loadMap();
  }

  async loadMap() {
    const mapOptions = {
      center: { lat: 19.2701522, lng: 72.9698387},
      zoom: 12,
      
    };

    if(!this.map){
      if(this.mapElement){
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      }else console.log("mapElement ", this.mapElement);
    }

    var inputElement = document.getElementById('searchInput') as HTMLInputElement;

    if (inputElement) {
      const autocomplete = new google.maps.places.Autocomplete(inputElement);

      // Listen for the place_changed event to get the selected place
      if(this.map) autocomplete.bindTo('bounds', this.map);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (this.map && place.geometry && place.geometry.location) {
          // Center the map on the selected place
          this.map.setCenter(place.geometry.location);
          // Set the marker on the selected place
          this.marker.setPosition(place.geometry.location);
        }else console.warn('Place information is incomplete or missing geometry.');

      });
    }

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: { lat: 19.2701522, lng: 72.9698387},
        map: this.map,
        title: 'Drag me!',
        icon: !this.isBackEnabled ? 'assets/markers/curr-invisible.svg' : 'assets/markers/curr.svg',
        draggable: true,
        animation: google.maps.Animation.DROP
        
      });
    }
    

    // Add a listener for marker dragend event
    this.marker.addListener('dragend', (event: any) => {
      this.zone.run(() => {
        this.onMapMarkerDragEnd(event);
      });
    });
  }

  onMapMarkerDragEnd(event: any) {
    // Handle the marker dragend event
    console.log('Marker Dragged to:', event.latLng.lat(), event.latLng.lng());
    const latLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    this.locationService.getAddressFromLatLng(latLng);

    let reverseGeocodingResult = this.locationService.observeReverseGeocodingResult().subscribe(async (address: AddressMap) => {
      console.log("MAP fetchCurrentArea observeReverseGeocodingResult: ", address);
      if(address) this.eventLocation = address.FormattedAddress;      
    });
  }

  

  closeModal() {
    this.modalController.dismiss({
      location: {
        latitude: this.marker.getPosition().lat(),
        longitude: this.marker.getPosition().lng(),
      },
    });
  }

  confirmLocation () {
    console.log("done");
    this.modalController.dismiss({
      location: {
        latitude: this.marker.getPosition().lat(),
        longitude: this.marker.getPosition().lng(),
      },
    });
  }
}