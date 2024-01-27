import { AppConstants } from "../config/AppConstants";
import { BasicUser } from "./BasicUser"

export class BusinessUser extends BasicUser {
   override UserTypeId = AppConstants.USER_TYPE.BN_USER;
   BusinessName: string = "";
  //  u_addlat: any;
  //  u_addlng: any;
  ProofAttachmentPath: string = "";

}
