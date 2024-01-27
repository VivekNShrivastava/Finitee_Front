import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import _ from 'lodash';
import { SelectSearchableInput } from '../../models/select-searchable/select-searchable-input';
import { PlacesService } from '../../services/places.service';

@Component({
  standalone: true,
  selector: 'app-select-searchable',
  templateUrl: './select-searchable.component.html',
  styleUrls: ['./select-searchable.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectSearchableComponent implements OnInit {

  @Input() inputData!: SelectSearchableInput;
  // @Output() onSelectSearchableOutput = new EventEmitter<any>();
  @Output() onSelectSearchableCancel = new EventEmitter<any>();
  @Output() onSelectSearchableSubmit = new EventEmitter<any>();
  filteredData: Array<any> = [];
  orgData: Array<any> = [];
  selectedData: Array<any> = [];
  // searchString: string = "";

  constructor(public placesService: PlacesService) { }

  ngOnInit() {
    console.log("SelectSearchableComponent: ngOnInit", this.inputData);
    this.orgData = _.cloneDeep(this.inputData.listData);
    this.filteredData  = _.cloneDeep(this.inputData.listData);
  }

  searchInList(event: any) {
    // console.log("InputSearch:", this.searchString);
    console.log("searchInList: ", event.detail);
    let resetOrgList = true;
    let self = this;
    if (event.detail && event.detail.value && event.detail.value.length > 0) {
      // this.orgData = _.cloneDeep(this.inputData.listData);
      this.filteredData = _.filter(this.orgData, function(o) { return o[self.inputData.dataKeyMap.title].toLowerCase().includes(event.detail.value.toLowerCase()); })
    }
    else {
      //restore all objects
      this.filteredData  = _.cloneDeep(this.orgData);
    }

  }

  onSelectEntry(event: any, listEntry: any) {
    console.log("onSelectEntry Event: ", event);
    console.log("onSelectEntry Date: ", listEntry);
    this.inputData.preSelected = listEntry;
    this.selectedData.push(listEntry);
    if (!this.inputData.multiSelect) {
      this.onSelectSearchableSubmit.emit(this.selectedData);
    }
    // this.onSelectSearchableSubmit.emit([listEntry]);
  }

  onImgNotFound(listEntry: any) {
    console.log("onImgNotFound: ", listEntry);
    listEntry['imgError'] = true;
  }

  onCancel() {
    this.onSelectSearchableCancel.emit();
  }

  onSubmit() {
    this.onSelectSearchableSubmit.emit(this.selectedData);
  }

  showToolbar() {
    return (this.inputData.title && this.inputData.title.length > 0) || this.inputData.cancelButton.show || this.inputData.submitButton.show;
  }

  isItemSelected(listEntry: any) {
    if (this.inputData.preSelected) {

     let result = _.isEqual(this.inputData.preSelected, listEntry);
    //  console.log("isItemSelected: "+result+ " :", listEntry, this.inputData.preSelected);
     return result;
    }
    return false;
  }
}
