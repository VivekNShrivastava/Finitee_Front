import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppConstants } from '../../models/config/AppConstants';

import { AttachmentHelperService } from '../../services/attachment-helper.service';
import { CommonService } from '../../services/common.service';

@Component({
  standalone: true,
  selector: 'app-traits',
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TraitsComponent implements OnInit {
  traitInput: any = "";
  @Input() traits: Array<string> = [];
  @Output() traitEvent = new EventEmitter<any>();
  mediaSaveSubscription!: Subscription;
  readonly appConstants: any = AppConstants;
  constructor(private attachmentService: AttachmentHelperService, private commonService: CommonService) {

  }

  ngOnInit() { }

  addNewTrait() {
    if (this.traitInput) {
      if(this.traits.length === 5){
        this.commonService.eventTraitError  =  true;
      }else{
        this.commonService.eventTraitError  =  false;

        this.traits.push(this.traitInput);
        this.traitInput = "";
        this.traitEvent.emit(this.traits);
      }
     
    }
  }
  onChange(){
     
    this.commonService.eventTraitError = false;
  }

  deleteTrait(index: number) {
    this.traits.splice(index, 1);
    this.traitEvent.emit(this.traits);
  }


}
