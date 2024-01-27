import { AppConstants } from "../config/AppConstants";
import { BasicUser } from "./BasicUser"

export class NonProfitUser extends BasicUser {
   override UserTypeId = AppConstants.USER_TYPE.NF_USER;
   CompanyName: string = "";
   ProofAttachmentPath: string = "";;

}
