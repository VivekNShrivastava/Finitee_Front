import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-e-card',
  templateUrl: './edit-e-card.page.html',
  styleUrls: ['./edit-e-card.page.scss'],
})
export class EditECardPage {
  nameValue: string = 'Luther Wilson';
  emailValue: string = 'Lutherwilson3rd@gmail.com';
  phoneValue: string = '02228545164';
  websiteValue: string = 'www.finitee.com';

  // Array to hold dynamic rows
  dynamicRows: Array<{ field: string; value: string }> = [{ field: '', value: '' }];

  constructor() {}

  // Method to add a new empty row
  addRow() {
    this.dynamicRows.push({ field: '', value: '' });
  }

  // Method to handle input changes and add a new row if needed
  onInputChange(index: number) {
    // If the focused row is the last one and it has some content, add a new row
    if (index === this.dynamicRows.length - 1) {
      const lastRow = this.dynamicRows[index];
      if (lastRow.field || lastRow.value) {
        this.addRow();
      }
    }
  }

  // Method to delete a dynamic row
  deleteDynamicRow(index: number) {
    this.dynamicRows.splice(index, 1); // Remove the row at the specified index

    // Ensure at least one empty row remains if all rows are deleted
    if (this.dynamicRows.length === 0) {
      this.addRow();
    }
  }
  
}
