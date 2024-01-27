export class SelectSearchableInput {
  title: string = "Select from list";
  searchPlaceholder: string = "Search";
  listData: Array<any> = [];
  searchable: boolean = false;
  multiSelect: boolean = false;
  preSelected: any;
  // preSelected: Array<any> = []; //TODO
  dataKeyMap!: SelectSearchableInputMap;
  cancelButton: any ={
    show: true,
    label: "Cancel"
  }
  submitButton: any ={
    show: false,
    label: "Submit"
  }
  public constructor(data?: any, title?: string){
    if (data) {
      this.listData = data;
    }
    if (title) {
      this.title = title;
    }
  }

}

export class SelectSearchableInputMap {
  id: string = "";
  title: string = "";
  icon: string = "";
  srno: string = "";
  detail: string = "";

}
