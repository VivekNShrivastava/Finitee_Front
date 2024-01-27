import { AppConstants } from "../config/AppConstants";
import { BasicUser } from "./BasicUser";

export class IndividualUser extends BasicUser {
  override UserTypeId = AppConstants.USER_TYPE.FR_USER;
} 
