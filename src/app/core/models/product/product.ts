import { Post } from "../post/post";
import { CreatedByDto } from "../user/createdByDto";

export class Product {
  Id: string = "";
  Title: string = "";
  TitleDescription: string = "";
  Description: string = "";
  Privacy: any = "";
  Traits: Array<string> = [];
  ProductImages: Array<string> = [];
  IsActive!: boolean;
  CreatedOn!: any;
  ModifiedOn!: any;
  CreatedBy!: CreatedByDto;
  IsInflowsStarted: boolean = false;
}
