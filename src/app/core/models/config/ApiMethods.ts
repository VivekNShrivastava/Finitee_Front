import { env } from 'process';
import { environment } from 'src/environments/environment';


export const AUTH_ROUTE = `${environment.baseUrl}Auth/`;
export const FINITEE_ROUTE = `${environment.baseUrl}Finitee/`;
export const MAP_ROUTE = `${environment.baseUrl}Map/`;
export const TOTEM_ROUTE = `${environment.baseUrl}Totem/`;
export const POST_ROUTE = `${environment.baseUrl}Post/`;
export const CON_ROUTE = `${environment.baseUrl}Connection/`;
export const EVENT_ROUTE = `${environment.baseUrl}Event/`;
export const SALES_LISTING_ROUTE = `${environment.baseUrl}SalesListing/`;
export const SERVICE_SRSA_ROUTE = `${environment.baseUrl}JobServices/`;
export const USER_ROUTE = `${environment.baseUrl}User/`;
export const COMMON_ROUTE = `${environment.baseUrl}Common/`;
// export const REPORT_ROUTE = `${environment.baseUrl}Report/`;

//Login
export const API = {
    USER_PROFILE: {
        GET: `${environment.baseUrl}User/UserProfile`,
        GETUSERDETAILSASPRIVACY: `${environment.baseUrl}User/GetUserDetailsAsPerPrivacy`,
        GETUSERCANVAS: `${environment.baseUrl}User/UserCanvasProfile`,
        SAVE: `${environment.baseUrl}User/UpdateUserProfile`,
        SAVEIMGABT: `${environment.baseUrl}User/UpdateProfileImageAndAbout`,
        EDITPERSONAL: `${environment.baseUrl}User/EditPersonal`,
        STATS:{
            UPDATE:`${environment.baseUrl}User/UpdateUserStats`,
        },
        EDUCATION: {
            SAVE: `${environment.baseUrl}User/AddUserEducation`,
            DELETE: `${environment.baseUrl}User/DeleteUserEducation`,
            UPDATE: `${environment.baseUrl}User/UpdateUserEducation`,

        },
        WORK: {
            SAVE: `${environment.baseUrl}User/AddUserWork`,
            DELETE: `${environment.baseUrl}User/DeleteUserWork`,
            UPDATE: `${environment.baseUrl}User/UpdateUserWork`,
        },
        CONTACT: {
            SAVE: `${environment.baseUrl}User/AddUserContactDetails`,
            UPDATE: `${environment.baseUrl}User/UpdateUserContact`,
            GET: `${environment.baseUrl}User/GetContactDetailsByUserId`,
        },
        PUSH_NOTIFICATION: {
            TOKEN_UPDATE: `${environment.baseUrl}User/SaveUserPushNotificationToken`,
        },
        PRIVACY_SETTING: {
            GET: `${environment.baseUrl}User/GetUserPrivacySetting`,
            SAVE: `${environment.baseUrl}User/UpdateUserPrivacySetting`,
            UPDATE_USER_TYPE: `${environment.baseUrl}UserSetting/UpdateFreeUserTypePrivacy`,
            UPDATE_BEAM: `${environment.baseUrl}UserSetting/UpdateAllowBeamByPrivacy`,
            RECEIVE_CHAT: `${environment.baseUrl}UserSetting/UpdateReceiveChatFromPrivacy`,
            UPDATE_SONAR_SETTING: `${environment.baseUrl}UserSetting/UpdateSonarPrivacySetting`
        },
        EDIT_USERNAME:{
            POST: `${environment.baseUrl}User/ChangeUserName`
        }
    },
    BUSINESS: {
        ANNOUNCEMENT: {
            GET: `${environment.baseUrl}Announcement/getAnnouncement`,
            SAVE: `${environment.baseUrl}Announcement/AddUpdateAnnouncement`,
            STATUS: `${environment.baseUrl}Announcement/EnableDisableAnnouncement`,
        },
        MENU_IETM: {
            GET: `${environment.baseUrl}MenuItem/GetMenuItems`,
            SAVE: `${environment.baseUrl}MenuItem/AddUpdateMenuItems`,
            DELETE: `${environment.baseUrl}MenuItem/DeleteMenuItem`,
        },
        PRODUCT: {
            GET_ALL: `${environment.baseUrl}Product/GetAllProducts`,
            GET: `${environment.baseUrl}Product/GetProductDetailsById`,
            SAVE: `${environment.baseUrl}Product/AddUpdateProduct`,
            DELETE: `${environment.baseUrl}Product/DeleteProduct`
        },
        ENDORSE_BUISNESS: `${environment.baseUrl}Finitee/EndorseBusiness`
    },
    POST: {
        GET_ALL_BY_USER: `${environment.baseUrl}Post/GetPostByUserId`,
        GET_ALL_BY_BELONGSTO: `${environment.baseUrl}Post/GetAllPostByBelongsToId`,
        GET: `${environment.baseUrl}Post/GetPostDetailsById`,
        SAVE: `${environment.baseUrl}Post/AddPost`,
        UPDATE_POST: `${environment.baseUrl}Post/UpdatePost`,
        DELETE: `${environment.baseUrl}Post/DeletePost`,
        BEAM: `${environment.baseUrl}Post/BeamAPost`,
        UPDATE_POST_VIEW:`${environment.baseUrl}Post/updatePostView`,
        FAVOR: `${environment.baseUrl}Post/DoPostFavour`,
        COMMENT_FAVOR: `${environment.baseUrl}Post/DoCommentFavour`,
        GET_ALL_COMMENTS: `${environment.baseUrl}Post/GetPostComments`,
        GET_COMMENT_REPLIES: `${environment.baseUrl}Post/GetPostCommentReplies`,
        GET_TOP_REPLIES: `${environment.baseUrl}Post/GetTopPostCommentReplies`,

        SAVE_COMMENT: `${environment.baseUrl}Post/AddUpdatePostComment`,
        SAVE_REPLY: `${environment.baseUrl}Post/AddUpdatePostCommentReply`,
        DELETE_COMMENT: `${environment.baseUrl}Post/DeleteComment`,
        DELETE_COMMENT_REPLY: `${environment.baseUrl}Post/DeleteCommentReply`,
        GET_USER_TRAITS_WITH_COUNT_AND_SERIALIZED: `${environment.baseUrl}Post/GetUserTraitsWithCountAndSerialized`,
        GET_USER_TRAITS: `${environment.baseUrl}Post/GetUserTraits`,
        SAVE_USER_TRAIT: `${environment.baseUrl}Post/SaveUserTrait`,
        DELETE_USER_TRAIT: `${environment.baseUrl}Post/DeleteUserTrait`,
        DONATION_CLAIMS_LIST:`${environment.baseUrl}Post/GetDonationsClaims`,
        MADE_DONATION:`${environment.baseUrl}Post/madeDonation`,
        DOANTION_CLAIM_ACTION:`${environment.baseUrl}Post/ConfirmOrRejectPayementDoneOnDonation`,
        INVITE_TO_VIEW_POST:`${environment.baseUrl}Post/InviteToView`,
        GENERIC_REPORT : `${environment.baseUrl}Report/GenericReport`,
        REPORT_USER : `${environment.baseUrl}Report/ReportUser`,
    },
    SEARCH: {
        REGULAR_SEARCH: `${MAP_ROUTE}RegularSearch`,
        SEARCH_UPDATE: `${environment.baseUrl}Search`,
        SEARCH: `${MAP_ROUTE}Search`,
        UPDATE_LIVE_LOCATION: `${environment.baseUrl}Search/UpdateLiveLocation`,
        ALL_SONAR_SEARCH: `${environment.baseUrl}Search/AllSonarSearch`
    },
    INFLOWS: {
        START_STOP_INFLOWS: `${environment.baseUrl}Inflows/StartStopRecievingInflows`,
        GET_INFLOWS: `${environment.baseUrl}Inflows/GetInflowsByUserId`,
    }

}

export const REFRESH = `${AUTH_ROUTE}CreateNewTokenWithRefreshToken`;
export const LOGOUT_API = `${AUTH_ROUTE}Logout`;
export const LOGIN_API = `${AUTH_ROUTE}Login`;
export const LOGINPHONE_API = `${AUTH_ROUTE}LoginWithPhone`;
export const FCM_TOKEN_API = `${AUTH_ROUTE}GetFcmAuthToken`;
export const LOGIN_SEND_PHONE_OTP = `${AUTH_ROUTE}SentLoginOTPOnPhone`;
export const LOGIN_VERIFY_PHONE_OTP = `${AUTH_ROUTE}VerifyLoginOTPWithPhone`;
export const SEND_OTP_ON_EMAIL = `${AUTH_ROUTE}SentOTPOnEmail`;
export const VERIFY_EMAIL_OTP = `${AUTH_ROUTE}VerifyOTPSentOnMail`;
export const CHANGE_PASSWORD_EMAIL_OTP = `${AUTH_ROUTE}ChangePassword`;

//user privacy new Api's
export const GET_PRIVACY_SETTING = `${FINITEE_ROUTE}GetUserPrivacySetting`;
export const UPDATE_PRIVACY_SETTING = `${FINITEE_ROUTE}UpdateUserPrivacySetting`;

//sales listing new api
export const GET_ALL_SL_BY_USR = `${SALES_LISTING_ROUTE}GetAllSalesListingByUser`;
export const CREATE_SL = `${SALES_LISTING_ROUTE}CreateSalesItem`;
export const UPD_SL = `${SALES_LISTING_ROUTE}UpdateSalesItem`;
export const GET_SL_BY_ID = `${SALES_LISTING_ROUTE}GetSalesItemById`;
export const DEL_SL = `${SALES_LISTING_ROUTE}DeleteSalesItem`;

// Service required
export const CREATE_SERVICE_REQUIRED = `${SERVICE_SRSA_ROUTE}AddServiceRequired`;
export const GET_SERVICE_REQ_BY_USER_FOR_LIST = `${SERVICE_SRSA_ROUTE}GetServiceRequiredForList`;
export const GET_SERVICE_REQUIRED_BYID = `${SERVICE_SRSA_ROUTE}GetServiceRequiredById`;
export const UPDATE_SERVICE_REQUIRED = `${SERVICE_SRSA_ROUTE}UpdateServiceRequired`;
export const DEL_SERVICE_REQUIRED_BYID = `${SERVICE_SRSA_ROUTE}DeleteServiceRequired`;

// Service available
export const CREATE_SERVICE_AVAILABLE = `${SERVICE_SRSA_ROUTE}AddServiceAvailable`;
export const GET_SERVICE_AVA_BY_USER_FOR_LIST = `${SERVICE_SRSA_ROUTE}GetServiceAvailableForList`;
export const GET_SERVICE_AVAILABLE_BYID = `${SERVICE_SRSA_ROUTE}GetServiceAvailableById`;
export const UPDATE_SERVICE_AVAILABLE = `${SERVICE_SRSA_ROUTE}UpdateServiceAvailable`;
export const DEL_SERVICE_AVAILABLE_BYID = `${SERVICE_SRSA_ROUTE}DeleteServiceAvailable`;

// Service alert
export const GET_SERVICE_ALERT_BY_USER = `${SERVICE_SRSA_ROUTE}GetServiceAlertByUser`;
export const UPDATE_SERVICE_ALERT = `${SERVICE_SRSA_ROUTE}UpdateServiceAlert`;
export const GET_SERVICE_MATCHED = `${SERVICE_SRSA_ROUTE}GetServiceMatched`;
export const DELE_SERVICE_ALERT = `${SERVICE_SRSA_ROUTE}DeleteServiceAlert`;

// shopping list
export const UPDATE_SHOPPING_LIST_WORDS = `${SALES_LISTING_ROUTE}UpdateShoppingList`;
export const GET_SHOPPING_LIST_WORDS = `${SALES_LISTING_ROUTE}GetShoppingList`;
export const GET_MATCHING_SHOPPING_LIST = `${SALES_LISTING_ROUTE}GetMatchedShoppingList`;


// old services urls
export const GET_SERVICE_REQUIRED_BY_USER = `${SERVICE_SRSA_ROUTE}GetServiceRequired`;
export const GET_ALL_SR_OR_SA_BY_USR = `${SERVICE_SRSA_ROUTE}GetAllSRORSAByUser`;
export const UPD_SR_OR_SA = `${SERVICE_SRSA_ROUTE}UpdateSRORSA`;
export const GET_SR_OR_SA_BY_ID = `${SERVICE_SRSA_ROUTE}GetSRORSA`;
export const DEL_SR_OR_SA = `${SERVICE_SRSA_ROUTE}DeleteSRORSA`;


//connecttion New Api
export const GET_USER_CONN = `${CON_ROUTE}GetUserConnections`;
export const SEND_CONN_REQ = `${CON_ROUTE}SendConnectionRequest`;
export const GET_CONN_REQ = `${CON_ROUTE}GetConnectionRequest`;
export const ACC_DEC_CONN_REQ = `${CON_ROUTE}AcceptOrRejectConnectionRequest`;
export const CANCEL_CONN_REQ = `${CON_ROUTE}CancelConnectionRequest`;
export const GET_BLCK_USER = `${CON_ROUTE}GetBlockedUsers`;
export const BlCK_USER = `${CON_ROUTE}BlockUser`;
export const UN_BlCK_USER = `${CON_ROUTE}UnBlockUser`;
export const DISCONNECT_USER = `${CON_ROUTE}DisconnectFromUser`;
export const referToConnections= `${CON_ROUTE}ReferConnection`;


//rolodex scan new api
export const SACN_QRCODE = `${FINITEE_ROUTE}scanQrcode`;


//events APi
export const GET_ALL_EVE_BY_USR = `${EVENT_ROUTE}GetAllEventByUser`;
export const CREATE_EVE = `${EVENT_ROUTE}CreateEvent`;
export const UPD_EVE = `${EVENT_ROUTE}UpdateEvent`;
export const GET_EVE_BY_ID = `${EVENT_ROUTE}GetEvent`;
export const DEL_EVE = `${EVENT_ROUTE}DeleteEvent`;

export const GET_REQ_LIST_BY_ID = `${EVENT_ROUTE}GetEventInviteRequestList`;
export const SEND_INVITE_REQ = `${EVENT_ROUTE}RSVPOrSendInvite`;
export const GET_ACCEPTED_LIST = `${EVENT_ROUTE}GetEventInviteAcceptedList`;
export const ACCEPT_DECLINE = `${EVENT_ROUTE}AcceptOrDeclineEventInvite`;


export const VIEW_URL = environment.attachementUrl;
export const FILE_URL = environment.baseUrl + `Files/`;
export const COM_URL = environment.baseUrl + `Files/CommonUpload?userId=`;
export const COM_URL_NEW = environment.baseUrl + `Files/CommonUploadV2?userId=`;
export const COMMON_UPLOAD_WO_TOKEN = environment.baseUrl + `Files/CommonUploadWithoutToken`;
export const CHAT_URL = environment.baseUrl + `Chat/`;
export const SIGNAL_R = `${environment.baseUrl}notification`;
export const FILE_UPD = `Upload`;
export const IMG_UPD = `PostImgUpload`;
export const VIDEO_UPD = `PostVideoUpload`;
// export const PRO_UPD = "UploadUserImages";
export const PREFIX = `u_`;
export const GOG_SER_KEY = `AAAAF5CXOSI:APA91bEyX_Cucnu2JHVIvc8ZP0kciGvuNFqh1rs6PaGtqZOmcj2J29aJZ1M4DzhtOKZP5_
IOnfCyGehvn_TRXS-I1kmlOJr_owTT84h8caYuiTF4UFopNc7JGy1dc6yLh7EvfKe1-HSI`;
export const GOG_LEG_KEY = `AIzaSyACOrgJTLMp0RsNnlpyAkjIh5VPutt2AZI`;
export const GOG_SEN_ID = `101210077474`;
export const GOOGLE_MAPS_ANDROID_API_KEY = `AIzaSyDVQFY9mcpa6RDI5vBEiPUWPni1ezZpi0Q`;
export const BROWSER_KEY = `AIzaSyAVjVXr5Nw8Unpooct_kxvBLLzbwa-s4Jk`;
export const GOOGLE_MAPS_IOS_API_KEY = `AIzaSyDVQFY9mcpa6RDI5vBEiPUWPni1ezZpi0Q`;
export const COMM_MSG = `Join me on Finitee. Download the app here: `;
export const PLAY_URL = `https://play.google.com/store/apps/details?id=com.finitee.android`;
export const SEND_LINK = `SendAppLink`;

// Permissions
export const CAMERA = `CAMERA`;
export const CALL_PHONE = `CALL_PHONE`;
export const READ_PHONE_STATE = `READ_PHONE_STATE`;
export const READ_SMS = `READ_SMS`;
export const ACCESS_COARSE_LOCATION = `ACCESS_COARSE_LOCATION`;
export const ACCESS_FINE_LOCATION = `ACCESS_FINE_LOCATION`;
export const READ_EXTERNAL_STORAGE = `READ_EXTERNAL_STORAGE`;
export const WRITE_EXTERNAL_STORAGE = `WRITE_EXTERNAL_STORAGE`;
export const RECORD_AUDIO = `RECORD_AUDIO`;
export const READ_CONTACTS = `READ_CONTACTS`;
export const WRITE_CONTACTS = `WRITE_CONTACTS`;



// Login
export const UPD_USR_MOB = `UpdateUserTokenId`;
export const LOG_OUT = `UserLogout`;
export const GET_APP_SETTING = `GetAllSetng`;

// Signalr
export const INSERT_CONNECTION_ID = `insertConnectionId`;
export const UPDATE_CONNECTION_ID = `updateConnectionId`;
// Chat and Messages
export const GET_USER_CONTACT = `GetUserConContact`;
export const GET_UNREAD_MESSAGE_COUNT = `getUnReadMsgCount`;
export const GET_CHAT_LIST = `getChatList`;
export const GET_USER_ALL_CHAT_LIST = `GetUserAllChatList`;
export const UPDUSERCHATBLOCKUNBLOCK = `updUserChatBlockUnBlock`;
export const UPDUSERCHATMUTEUNMUTE = `updUserChatMuteUnMute`;
export const INSERTUSERCHATREPORT = `InsertUserChatReport`;
export const CREATE_CHAT_GROUP = `CreateUserGroup`;

// Totem
export const TTM_IMG_UPD = `TotemImgUpload`;
export const SAVE_TTM = `${TOTEM_ROUTE}CreateTotem`;
export const GET_TTM_ID = `GetTotemById`;
export const GET_TTM_CMT_BY_ID = `GetTtm_CmtsByTtmid`;
export const SAVE_TTM_CMT = `SaveTtm_Cmts`;
export const UPD_TTM_CMT = `UpdateTtm_Cmts`;
export const DEL_TTM_CMT = `DeleteTtm_Cmts`;
export const GET_ALL_USER_TOTEM = `GetAllUsrTotem`;
// export const GET_ALL_USER_TOTEM_V1 = `Map/GetTotems`;
export const GET_ALL_USER_TOTEM_V1 = `${TOTEM_ROUTE}GetAllTotemByUser`;
export const LIKE_TOTEM_COMMENT = `UpdTMCmntLike`;
export const LIKE_TOTEM = `UpdateTMPostLike`;
export const SHARE_TOTEM_TO_CONNECTION = `ShareTotemtoCon`;
export const SHARE_TOTEM = `UpdateTMPostShare`;

// totem-new
export const UPDATE_TOTEM = `UpdateTotem`;
export const DELETE_TOTEM = `DeleteTotem`;
// export const UPDATE_TOTEM_COMMENT_LIKE = `UpdTMCmntLike`;
export const GET_TOTEM_COMMENT_LIST = `GetTMCmntlikelist`;
export const DELETE_SHARED_TOTEM = `DeleteSharedTotem`;

// comments
export const UPD_CMT_LIKE = `UpdCmntLike`;
export const UPD_CMT_UN_LIKE = `UpdCmntUnLike`;
export const GET_CMT_LIKE_LST = `GetCmntlikelist`;

// Register
export const GET_CON = `GetAllCountry`;
export const REGISTER = `${USER_ROUTE}Register`;
export const SEND_REG_OTP = `${AUTH_ROUTE}SendRegisterOTP`;
export const INS_REG_OTP = `${FINITEE_ROUTE}InsertUserRegisterOTP`;
export const REN_SEND_OTP = `${AUTH_ROUTE}ResendUserRegisterOTP`;
export const VER_REG_OTP = `${AUTH_ROUTE}VerifyUserRegisterOTP`;
export const FREEMEM_REG = `${FINITEE_ROUTE}FreeUserRegister`;
export const BUSMEM_REG = `${FINITEE_ROUTE}BusinessUserRegister`;
export const NONPMEM_REG = `${FINITEE_ROUTE}NonProfitUserRegister`;
export const TERM_CON = `${FINITEE_ROUTE}GetTerms_Condtn`;
export const FORGOT_PASS = `${FINITEE_ROUTE}UserForgotPassword`;
export const CHK_USR = `${FINITEE_ROUTE}CheckAlreadyUser`;
export const CHK_USR_NAME = `${FINITEE_ROUTE}CheckUsernameExist`;
export const SEND_EMAIL_VERIFY = `${FINITEE_ROUTE}SendEmailVerification`;
export const RESET_PASSWORD = `${FINITEE_ROUTE}Resetpassword`;
export const EMAIL_VERIFY_CHECK = `${FINITEE_ROUTE}IsEmailVerifiedCheck`;
export const CHECK_USER_DETAILS = `${FINITEE_ROUTE}CheckUserDetails`;
// export const EMAIL_VERIFY_CHECK = `${FINITEE_ROUTE}IsEmailVerified`;
// ***

// Home
export const GET_ALL_NOTIF_STAT = `getallnotification`;
export const GET_ALL_USER_POST = `GetAllUserPost`;
export const GET_ALL_POST = `GetAllPost`;
export const SAVE_POST = `SavePost`;
export const UPD_POST = `UpdatePost`;

export const SAVE_POST_COMMET = `SavePostComments`;
export const DEL_FILE = `Deletefiles`;
export const UPD_FOLL_CONN = `UpdateFollowConnection`;
export const GET_POS_SHR_LST = `GetPostsharelist`;
//export const GET_POST_BY_ID = `GetPostById`;
export const UPD_POST_COMM = `UpdatePostComments`;
export const DEL_POST_COMM = `DeletePostcomments`;
export const GET_INF_TYPE = `GetInflowsType`;
export const UPD_CONN_INF_ENB = `UpdConInflowEnable`;
export const UPDATE_RECEIVE_INFLOW = `UpdRecvInflow`;
export const old_GET_ALL_INFLOWS_LIST = `GetAllInflowsList`;
export const GET_ALL_INFLOWS_LIST = `GetPostListInInflows`;
export const REMOVE_FROM_INFLOWS = `DltPostFrmInInflows`;

// profile
// Free User Profile
export const GET_USER_PRO = `${FINITEE_ROUTE}GetUserProfile`;
export const GET_USER_INFO = `GetUserInfoById`;
export const UPD_UN_INFO = `UpdateUserNameInfo`;
export const UPD_UL_INFO = `UpdateUserLivingInfo`;
export const UPD_UC_INFO = `UpdateUserContactInfo`;
export const UPD_UB_INFO = `UpdateUserPersonalInfo`;
export const UPD_UR_INFO = `UpdateUserRelationshipInfo`;
export const UPD_UT_INFO = `UpdateUserTraitsInfo`;
export const INS_US_INFO = `InsertUserSchlInfo`;
export const UPD_US_INFO = `UpdateUserSchlInfo`;
export const INS_UClg_INFO = `InsertUserClgInfo`;
export const UPD_UClg_INFO = `UpdateUserClgInfo`;
export const INS_UW_INFO = `InsertUserWorkInfo`;
export const UPD_UW_INFO = `UpdateUserWorkInfo`;
export const USR_CAN_POST = `UserCanvasPost`;
export const UPD_USR_CAN_POST = `UpdUserCanvasPost`;
export const GET_OTHER_USER_PROFILE = `GetFuserprofile`;
export const GET_FREE_USER_MORE = `GetMoreFUserProfile`;
export const GET_BN_USER_PROFILE = `${FINITEE_ROUTE}GetBNuserprofile`;
export const GET_BN_USER_MORE = `GetMoreBNUserProfile`;
export const DELETE_USER_INFO = `DltUserSCW_Info`;

// export const GET_OTHER_USER_PROFILE = `Getotheruserprofile`;
export const UPDATE_TRAITS = `UpdateUserTraitsInfo`;

// Non Profit User
export const GET_NON_BUSS_INFO = `GetNonFreeUserInfoById`; // removed in favour of GET_BN_USER_MORE
export const UPD_NF_USR_INFO = `UpdateNFUserInfo`;

// Search Profile
export const GET_SER_SCL = `GetsearchSchool`;
export const GET_SER_COL = `GetsearchCollege`;
export const GET_SER_COM = `GetsearchCompany`;
export const GET_SER_POS = `GetsearchPosition`;
export const GET_SER_CTY = `GetsearchCity`;
export const GET_SER_STE = `GetsearchState`;
export const GET_SER_CUN = `GetsearchCountry`;

// Connection
export const GET_SER_FREE_USR = `GetSearchFreeUser`;
export const GET_SER_NON_USR = `GetSearchNonFreeUser`;
export const SAVE_CONN_REQ = `SaveConnectionRequest`;
export const UPD_CONN_REQ = `UpdateConnectionRequest`;
export const GET_ALL_CONN = `${MAP_ROUTE}GetAllConnection`;
export const GET_SER_CONN = `GetSearchConnection`;


export const GET_SER_CONN_REQ = `GetSearchConnectionRequest`;
export const DEL_CONN = `DeleteConnection`;
export const REP_CONN = `ReportUser`;
export const REP_CONN_old = `ReportConnection`;
export const BLCK_CONN = `BlockUnBlockConnection`;
export const UN_BLCK_SON = `SonarUnBlock`;
export const GET_ALL_REPT_RES = `GetAllReportreason`;
export const SAVE_REPT_RES = `SaveReportreason`;
export const SAVE_REPT_POST = `SaveReportedpost`;
export const CAN_CON_REQ = `CnclConReq`;
export const CHK_IS_CONN = `CheckIsCon`;
//export const GET_BLCK_USER = `GetUserBlockList`;
export const GET_REF_RECOM_CON_LST = `GetRefRecomConList`;
export const INS_REF_CON = `InsertReferCon`;
export const UPD_REF_CON_READ = `UpdReferConRead`;
export const INS_REC_CON = `InsertRecomCon`;
export const UPD_REC_CON_READ = `UpdRecomConRead`;

// Privacy Setting
export const USER_PRIVACY = `GetUserprivacysettingById`;
export const UPD_USER_PRIVACY = `UpdateUserprivacysetting`;
export const GET_FREE_USR_STAT_COUNT = `GetFreeUserStatisticsCount`;
export const GET_NON_FREE_USR_STAT_COUNT_old = `GetNon_FreeUserStatisticsCount`;
export const GET_NON_FREE_USR_STAT_COUNT = `GetBNUserStatisticsCount`;
export const GET_FREE_USR_ACC_old = `GetFreeUserAccountInfo`;
export const GET_FREE_USR_ACC = `GetFUserAccountInfo`;
export const GET_NON_FREE_USR_ACC = `GetBNUserAccountInfo`;
export const GET_NON_FREE_USR_ACC_old = `GetNon_FreeUserAccountInfo`;
export const TER_USR_ACC = `TerminateUserAccount`;
export const UPD_USR_ACC_NAME = `updusrname`;
export const UPD_USR_ACC_USR_NAME = `updusrusername`;
export const UPD_USR_ACC_EML = `updusreml`;
export const UPD_USR_ACC_PHNO = `updusrphno`;
export const UPD_USR_ACC_PASS = `updusrpass`;
export const UPDATE_USER_GST = `updusrGST`;

// map
export const UPD_LOC = `InsertUserLocation`;
export const UPD_LOC_V1 = `${MAP_ROUTE}InsertUserLocationV1`;
export const SAMP_LOC = `SampleInsertUserLocation`;
export const GET_SER_USR_MAP = `GetSearchUserOnMap`;
export const GET_SER_USR_MAP_V1 = `${MAP_ROUTE}GetSearchUserOnMapV1`;
export const INS_PING_SER = `${MAP_ROUTE}InsertSearch`;
export const UPD_PING_SER = `UpdSearch`;
export const DEL_PING_SER = `${MAP_ROUTE}DeleteSearch`;
export const GET_USR_PING_SER = `${MAP_ROUTE}GetUserSearch`;
export const DEC_PING_SER = `${MAP_ROUTE}DeactivateSearch`;
export const UPD_USR_MAP = `${MAP_ROUTE}UpdvisibleUserOnMap`;
export const GREETING = `GreetingsNotification`;
export const GREETING_V2 = `UpdateGreetingStatus`;
export const ADD_TO_SONAR = `${MAP_ROUTE}AddtoSonar`;
export const RMV_TO_SONAR = `${MAP_ROUTE}RemoveFromSonar`;
export const GET_SAVED_SONAR = `${MAP_ROUTE}SavedSonar`;
export const GET_USER_DETAILS_MAPRESULT = `GetUsrOnSwipeMode`;
export const CLICK_USER_ON_MAP = `ClkUsrOnMap`;
export const SONAR_CLICK_USER_ON_MAP = `SonarLstClkUsrOnMap`;
export const Get_Saved_Location = `${MAP_ROUTE}GetSavedLocation`;

// Notification
export const GET_USR_NOTIFY = `GetUserNotificationList`;
export const UPD_USR_NOTIFY = `UpdateUserNotificationRead`;

// Ecard and Rolodex
export const UPDUsrEcardInfo = `UpdateUserEcardInfo`;
export const GETUsrEcardInfo = `GetUserEcardInfo`;
export const GETUsrEcardList = `GetUserEcardList`;
export const GetSerUserEcardLst = `GetSearchUserEcardList`;
export const DelMapUsrEcard = `DeleteMappedUserEcard`;
export const DelUsrEcard = `DeleteUserEcard`;
export const MapUsrEcard = `MapUserEcard`;
export const ChkMapUsrEcard = `CheckMappedUserEcard`;
export const REF_ECARD = `ReferUserEcard`;
export const UPD_ECARD_SEEN = `UpdEcardSeen`;
export const IMP_ECARD = `ImportUserEcard`;
export const UPDATE_NOTES_ROLODEX = `UpdNotesOnRolodex`;
export const GET_ECARD_SETTING = `GetUserEcardSettingById`;
export const UPDATE_ECARD_SETTING = `UpdUserEcardSetting`;

// Event
export const GET_USR_CONN_LST_EVE = `GetUserConnectionListForEvent`;
export const INS_EVE_INV = `InsertEventInvites`;
export const UPD_EVE_CHG_INV = `UpdEveDlttoInvites`;
export const UPD_EVE_RSVP = `UpdateEventRSVP`;
export const GET_EVE_RSVP_LST = `GetEventRSVPList`;
export const EVE_IMG_UPD = `EventImgUpload`;
export const GET_EVE_INV = `GetEventInvites`;

// Groups
export const GRP_IMG_UPD = `GroupImgUpload`;
export const GRP_POS_IMG_UPD = `GPostImgUpload`;
export const GRP_POS_VD_UPD = `GPostVideoUpload`;
export const CHK_GRP_EXT = `ChekGNExts`;
export const CRT_GRP = `CreateGroup`;
export const EDT_GRP = `EditGroup`;
export const GET_ALL_GRP = `GetAllGroup`;
export const GET_GRP_BY_ID = `GetGroupByID`;
export const GET_USR_CONN_LST = `GetUsrConLst_Gp`;
export const INS_GRP_INV = `InsertGpInvite`;
export const ACC_GRP_INV = `AcceptGpInvite`;
export const RMV_GRP_USR = `RmvGpUsr`;
export const GRP_MKE_MD = `GpMakeMdtor`;
export const GET_GRP_USR_LST = `GetGpUsrlst`; // No Added
export const SAV_GRP = `SaveGp`;
export const UPD_GRP = `UpdGp`;
export const DLT_GRP = `DltGp`;
export const GET_GP_BY_ID = `GetGPById`; // No Added
export const UPD_GRP_LK = `UpdGpLK`;
export const GET_GRP_LK_LST = `GetGpLKLst`;
export const SAV_GRP_REP = `SaveGPReport`; // removed usage, replaced in favour of SAVE_REPT_POST
export const RM_GRP_USR_PO = `RmvGpUsrPost`;
export const SAV_GRP_C = `SaveGPC`;
export const UPD_GRP_C = `UpdGPC`;
export const GET_FRP_C_BY_ID = `GetGPCById`;
export const DLT_GRP_C = `DltGPC`;
export const DEL_GRP = `DeleteGroup`;

// Donation
export const DON_DET = `GetUserDonationDetail`;
export const UPD_DON_DET = `UpdUserDonationDetail`;
export const UPD_DON_ENB = `UpdDonationIsEnable`; // ***
export const DON_IMG_UPD = `DonationImgUpload`;
export const SAVE_USER_DONATION_POST = `SaveDonationPost`;
export const GET_USER_DONATION_POST = `GetUsrDonationPost`;
export const GET_DONATION_POST_SHARE_LIST = `GetDPostsharelist`; // ***
export const GET_DONATIONS_MADE = `GetMadeDonationList`; // ***
export const INSERT_DONATIONS_MADE = `InsertDonationMade`; // ***
export const CONFIRM_DONATIONS_MADE = `UpdConfirmUsrDonation`; // ***

// Share Post
export const GET_USR_CON_LIK_SHR = `GetUsrConLstLk_Shr`;
export const INV_USR_UPD_LK = `InviteUserUpdLike`;
// export const INV_USR_RO_LK = `InviteUsertoLike`;
export const INVITE_TO_LIKE = `InviteUsertoLike`;

// Mention
export const GET_CONN_LST = `GetAllConnectionList`;
export const USR_MEN_POST = `UserMentionPost`;
export const USR_SPK_TO_POST = `UserSpeakToPost`;
export const UPD_POST_DIS = `UpdPostDisplay`;
export const POST_COMM_MEN = `PostCommentMention`;
export const POST_COMM_SPK_TO = `PostCommentSpeakto`;
export const POST_NOT_DISPLAY_SPEAKTO = `UpdPostNotDisplay`;
export const POST_DISPLAY_SPEAKTO = `UpdPostDisplay`;
export const GET_INFLOW_CONNECTION_LIST = `GetInflowConList`;

// New Service
export const GET_PST_LIST = `GetPostList`;
export const GET_FAV_LIST = `GetFavourList`;
export const GET_BEAM_LIST = `GetBeamList`;
export const GET_DON_LIST = `GetDonationList`;
export const GET_GRP_LIST = `GetGroupList`;
export const GET_EVE_LIST = `GetEventList`;
export const GET_SER_ALL_PST = `GetSearchAllPost`;
export const GET_SER_ALL_USR = `GetSearchAllUser`;
export const GET_SER_ALL_BUSR = `GetSearchAllBUser`;
export const GET_SER_ALL_NUSR = `GetSearchAllNPUser`;
export const GET_SER_ALL_USR_NAME = `GetSearchAllUserByName`;
export const GET_SER_ALL_GRP = `GetSearchAllGroup`;
export const GET_SER_ALL_DON = `GetSearchAllDonation`;
export const GET_SER_ALL_EVT = `GetSearchAllEvent`;
export const GET_ADV_SER_USR = `GetAdvncSearchUser`;
export const GET_ADV_SEARCH_ALL_LIST = `GetAdvSearchAllList`;
export const GET_ADV_SEARCH_ALL_LIST_FREE = `GetAdvSearchList_FUsr`;
export const GET_ADV_SEARCH_ALL_LIST_BNU = `GetAdvSearchAllList_BNUsr`;

// PRODUCT
export const SAVE_USER_PRODUCT = `SaveUsrProduct`;
export const GET_ALL_USER_PRODUCT = `GetAllProductByUsr`; // Unused
export const GET_ALL_PRODUCT_BY_USERID = `GetAllUsrProduct`; // Unused
export const UPDATE_USER_PRODUCT = `UpdUsrProduct`;
export const DELETE_USER_PRODUCT = `DltUsrProduct`;
export const UPDATE_USER_PRODUCT_VISIBILITY = `UpdUsrPrtVsbl`;
export const UPDATE_USER_PRODUCT_ACCESSIBILITY = `UpdUsrPrtAcsbl`;
export const GET_USER_PRODUCT_ID = `GetUsrPrtId`;
export const GET_USER_POST_BY_PRODUCT_ID = `GetUsrPostByPrtId`;
export const GET_ALL_CATEGORY = `GetAllCategory`;
export const GET_ALL_SUBCATEGORY = `GetAllSubCategory`;
export const GET_ALL_SEARCH_BUY = `GetSearchAllBuy`;
export const GET_ALL_SEARCH_SELL = `GetSearchAllSell`;
export const SAVE_PRODUCT_POST = `SavePrtPost`;
//export const DELETE_PRODUCT_POST = `DltPrtPost`;
export const GET_ALL_PRODUCT_BY_USER = `GetAllPrtSectionByUsr`; // ***

// Like
export const UPDATE_PRODUCT_POST_LIKE = `UpdatePPostLike`;
export const UPDATE_DONATION_POST_LIKE = `UpdateDPostLike`;
export const UPDATE_GROUP_POST_LIKE = `UpdGPLk`;
export const SAVE_POST_LIKE = `UpdatePostLike`;

// LikeList
export const POST_LIKE_LST = `GetPostlikelist`;
export const PRODUCT_POST_LIKE_LST = `GetPPostlikelist`;
export const DONATION_POST_LIKE_LST = `GetDPostlikelist`;
export const GROUP_POST_LIKE_LST = `GetGPLkLst`;

// Beam-Share
export const POST_SHARE = `PostShared`;
export const PRODUCT_POST_SHARE = `UpdatePPostShare`;
export const DONATION_POST_SHARE = `UpdateDPostShare`;
export const GROUP_POST_SHARE = `UpdGPShare`;
export const INVITE_TO_SHARE = `InviteUsertoShare`;
export const UPDATE_INVITED_TO_SHARE = `InviteUserUpdShare`;

// Comments
export const GET_POS_COMM_ID = `GetPostcommentsById`;
export const GET_POST_COMMMENTS_BY_ID = `GetPostcommentsById`;
export const PRODUCT_POST_COMMMENTS_BY_ID = `GetPostcommentsById`;
export const DONATION_POST_COMMMENTS_BY_ID = `GetPostcommentsById`;
export const GROUP_POST_COMMMENTS_BY_ID = `GetPostcommentsById`;

// Delete Post
export const DEL_POST = `DeletePost`;
export const DEL_SHARED_POST = `DeleteSharedPost`;
export const DELETE_DONATION_POST = `DltDonationPost`; // completed

// Search
export const GET_SEARCH_ALL_LIST_old = `GetSearchAllList`;
export const GET_SEARCH_ALL_LIST = `GetSearchAllList_new`;
export const GET_ADVANCE_SEARCH_ALL_LIST = `GetAdvSearchAllList`;
export const GET_SEARCH_STATE = `GetsearchState`;
export const GET_SEARCH_COUNTRY = `GetsearchCountry`;
export const GET_SEARCH_CITY = `GetsearchCity`;

// new services
export const UPDATE_DONATION_POST = `UpdDonationPost`; // completed
export const SAVE_DONATION_POST_COMMENT = `SaveDPostCmnt`;
export const UPDATE_DONATION_POST_COMMENT = `UpdateDPostCmnt`; // twice
export const DELETE_DONATION_POST_COMMENT = `DeleteDPostCmnt`; // twice
export const UPDATE_DONATION_COMMENT_LIKE = `UpdDCmntLike`; // completed
export const GET_DONATION_COMMENT_LIKE_LIST = `GetDCmntLikelist`;
export const GET_DONATION_COMMENTS = `GetDPostCmntsById`;
export const GET_DONATION_POST_BY_ID = `GetDPostById`;
// export const SAVE_PRODUCT_POST = ``; // CHANGED
export const UPDATE_PRODUCT_POST = `UpdPrtPost`;
// export const DELETE_PRODUCT_POST = `DltPrtPost`; // CHANGED
export const SAVE_PRODUCT_POST_COMMENT = `SavePPostcmnt`; // completed
export const UPDATE_PRODUCT_POST_COMMENT = `UpdatePPostcmnt`; // completed
export const UPDATE_PRODUCT_POST_COMMENT_LIKE = `UpdPPCmntLike`;
export const GET_PRODUCT_POST_COMMENT_LIKE = `GetPPCmntlikelist`;
export const GET_PRODUCT_POST_COMMENTS = `GetPPostcmntsById`; // completed
export const GET_PRODUCT_POST_BY_ID = `GetPpostById`;
// export const DEL_SHARED_POST = `DeleteSharedPost`; // CHANGED

export const INSERT_REPORTED_POST = `InsertReportedpost`;
export const DELETE_REPORTED_POST = `DeleteReportedpost`;
export const GET_POST_REPORT_LIST = `GetPostReportList`;

// BuySell
export const GET_SALES_SETTING = `GetSalesSettng`; // completed
export const SAVE_SALES_POST = `${FINITEE_ROUTE} SaveSalesPost`; // completed
export const DELETE_SALES_POST = `${FINITEE_ROUTE} DltSalesPost`; // completed
export const GET_USER_SALES_POST = `${FINITEE_ROUTE} GetUsrSalesPost`; // completed
export const SEARCH_SALES_POST = `GetUsrSrchSalesPost`; // completed
export const SALES_POST_COMMENT_S = `${FINITEE_ROUTE} SaveSalesPostCmnt`; // completed
export const GET_SALES_POST_COMMENTS = `${FINITEE_ROUTE} GetSalesPostcmntsById`; // completed
export const GET_SALES_POST_BY_ID = `${FINITEE_ROUTE} GetSalesPostById`;
export const RENEW_SALES_POST = `UpdrenewSalesPost`;
export const SALES_POST_COMMENT_U = `${FINITEE_ROUTE} UpdSalesPostCmnt`;
export const SALES_POST_COMMENT_D = `${FINITEE_ROUTE} DltSalesPostcmnt`;
export const UPDATE_SALES_POST = `${FINITEE_ROUTE} UpdSalesPost`;
export const SALES_POST_PAYMENT = `PaymentForSalesPost`;

export const UPDATE_BUSINESS_LOGO = `UpdateUserlogo`;
export const UPDATE_BUSINESS_INTRO_VIDEO = `UpdateUserIntroVideo`;



// Endorsements
export const ENABLE_ENDORSEMENTS = `EndorseBusiness`;
export const DISABLE_ENDORSEMENTS = `UnEndorseBusiness`;

// LOUNGE
export const GET_ADMIN_POSTS = `getAdminPost`;

export const MAX_TEXT_LENGTH = 10000;
// export const GET_USER_CONTACT = `GetUserConContact`;

export const ACTIVATE_TRIAL_CODE = `ActivateTrialCode`;

export const REPORT_COMMON = `ReportCommon`;
export const LIMIT_VIEWING_TIME = 30000;

export const BALANCE_PAYMENT = `GetBalancePaymentForPrt`;
export const ONETIME_PAYMENT = `OneTimePaymentForPrt`;
export const GET_MONTHLY_LIMIT_PAYMENT = `GetSetMonthlyPaymentForPrt`;
export const SET_MONTHLY_LIMIT_PAYMENT = `SetMonthlyPaymentForPrt`;

export const INSERT_POST_VIDEO_VIEW = `InsertPostVideoView`;
export const INS_PST_VIEW = `InsertPostView`;
export const INSERT_PRT_VIDEO_VIEW = `InsertPrtVdeoView`;
export const INSERT_PRT_VIEW = `InsertPrtView`;
export const INSERT_LINK_VIEW = `ClckWeblink_Home`;
export const LOCATION_UPDATE_TIME = 2 * 1000;

//fcm
export const Update_User_Fcm_Token = `UpdateUserFcmToken`;

//Places
export const GET_ALL_COUNTRIES = `${FINITEE_ROUTE}GetAllCountries`;
export const GET_ALL_STATES = `${FINITEE_ROUTE}GetAllState`;
export const GET_ALL_CITIES = `${FINITEE_ROUTE}GetAllCity`;

export const GET_CURRENCY_BY_COUNTRY= `${COMMON_ROUTE}GetCurrencyByCountry`;


//referConnections

