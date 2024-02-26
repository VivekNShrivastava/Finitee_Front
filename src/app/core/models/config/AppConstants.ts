export class AppConstants {
  /**TODO: Use app name from somewhere else */
  public static APP_NAME = 'Finitee';
  public static SOURCE_CAMERA = 1;
  public static SOURCE_PHOTOLIBRARY = 2;
  public static MEDIA_PICTURE = 0;
  public static MEDIA_VIDEO = 1;
  public static USER_TYPE = {
    FR_USER: 1,
    BN_USER: 2,
    NF_USER: 3,
    ADMIN_USER: 4,
  };

  public static mediaPrefix: any =
    'https://finitee.sgp1.digitaloceanspaces.com/';

  public static TOAST_MESSAGES: any = {
    SOMETHING_WENT_WRONG: 'Something Went Wrong',
    PROFILE_UPDATED: 'Your profile has been succesfully updated.',
    PRODUCT_CREATED: 'Product has been created.',
    PRODUCT_UPDATED: 'Product has been updated.',
    PRODUCT_DELETED: 'Product Deleted.',
    EVENT_CREATED: 'Event has been created.',
    EVENT_UPDATED: 'Event has been updated.',
    EVENT_DELETED: 'Event Deleted.',
    POST_CREATED: 'Post has been created.',
    POST_UPDATED: 'Post has been updated.',
    POST_BEAMED: 'Post has been beamed.',
    POST_DELETED: 'Post Deleted.',
    TRAIT_POST_CREATED: "Trait Created",
    ANNOUNCEMENT_CREATED: 'Announcement has been created.',
    ANNOUNCEMENT_UPDATED: 'Announcement has been updated.',
    ANNOUNCEMENT_DISABLE: 'Announcement disabled.',
    CON_REQ_SENT: 'Request has been sent to user',
    REQ_ACC: 'Request has been accepted',
    REQ_DEC: 'Request has been declined',
    USER_BLOCKED: "User Blocked",
    USER_UNBLOCKED: "User UN Blocked",
    USER_DISCONNECT: "User disconnect",
    CHAT_END: 'This chat has ended',
    WRONG_FORMAT_IMG:
      'The image file you tried to attach is invalid or in a wrong format.',
    CON_REQ_ALR_SENT: 'Connection request alredy sent',
    SALE_CREATED: 'Sale has been created.',
    SALE_UPDATED: 'Sale has been updated.',
    SALE_DELETED: 'Sale item deleted.',
    WORK_DELETED: 'Work Deleted.',
    EDUCATION_DELETED: 'Education Deleted.',
    SL_CREATED: 'Sales item created.',
    // services required
    SERVICE_REQUIRED_CREATED: 'Service required created.',
    SERVICE_REQUIRED_UPDATED: 'Service required updated.',
    SERVICE_REQUIRED_DELETED: 'Service required deleted.',
   // services available
    SERVICE_AVAILABLE_CREATED: 'Service available created.',
    SERVICE_AVAILABLE_UPDATED: 'Service available updated.',
    SERVICE_AVAILABLE_DELETED: 'Service available deleted.',

    // service alert
    SERVICE_ALERT_UPDATED: 'Service alert updated.',
    SERVICE_ALERT_DELETED: 'Service alert deleted.',


    // shopping list
    SHOPPING_LIST_UPDATED: 'Shopping list updated.',

    PS_SAVED: 'Privacy settings has been saved.',

    //report
    REPORT: 'Reported',
  };

  public static SIDE_MENU_LIST: any = [
    {
      category: 'Donations',
      icon: 'right-menu-eprofile',
      pagelink: 'donation',
      access: AppConstants.USER_TYPE.NF_USER,
    },
    {
      category: 'e-Profile',
      icon: 'right-menu-eprofile',
      pagelink: 'e-profile',
      access: AppConstants.USER_TYPE.BN_USER,
    },
    {
      category: 'Profile',
      icon: 'right-menu-profile',
      pagelink: 'fr-profile/loggedInUser',
      access: AppConstants.USER_TYPE.FR_USER,
    },
    {
      category: 'e-Card',
      icon: 'right-menu-ecard',
      pagelink: `e-card/loggedInUser`,
      access: AppConstants.USER_TYPE.FR_USER,
    },
    {
      category: 'rolodex',
      icon: 'right-menu-rolodex',
      pagelink: 'rolodex',
      access: AppConstants.USER_TYPE.FR_USER,
    },
    {
      category: 'Sales Listing',
      icon: 'right-menu-sales',
      pagelink: 'sales-listing',
      access: 0,
    },
    {
      category: 'Events',
      icon: 'right-menu-events',
      pagelink: 'event-list',
      access: 0,
    },
    {
      category: 'Shopping List',
      icon: 'right-menu-shopping-list',
      pagelink: 'shopping-list',
      access: 0,
    },
    {
      category: 'Services Required',
      icon: 'right-menu-service-required',
      pagelink: 'service-required',
      access: 2,
    },
    {
      category: 'Services',
      icon: 'right-menu-service-main',
      pagelink: '',
      access: 1,
      subs: [
        {
          subcategory: 'Services Required',
          icon: 'right-menu-service-required',
          pagelink: 'service-required',
        },
        {
          subcategory: 'Services Available',
          icon: 'right-menu-service-available',
          pagelink: 'service-available',
        },
        {
          subcategory: 'Service Alert',
          icon: 'right-menu-service-alert',
          pagelink: 'service-alert',
        },
      ],
    },
    {
      category: 'Invite to Finitee',
      icon: 'right-menu-invite-to-finitee',
      pagelink: 'events',
      access: 0,
      
    },
    {
      category: 'Settings',
      icon: 'right-menu-settings',
      pagelink: '',
      access: 0,
      subs: [
        {
          subcategory: 'Privacy Settings',
          icon: 'right-menu-privacy-settings',
          pagelink: 'privacy',
        },
        {
          subcategory: 'View Statistics',
          icon: 'right-menu-statistics',
          pagelink: 'statistics',
        },
        {
          subcategory: 'Display',
          icon: 'right-menu-display',
          pagelink: 'display',
        },
        {
          subcategory: 'Account Management',
          icon: 'right-menu-account-management',
          pagelink: 'account-management',
        },
    
      ],
    },
    {
      category: 'Legal',
      icon: 'right-menu-legal',
      pagelink: '',
      access: 0,
      subs:[
        {
          subcategory: 'Terms and Conditions',
          icon: 'right-menu-terms-condition',
          pagelink: 'terms-conditions',
        },
        {
          subcategory: 'Privacy Policy',
          icon: 'right-menu-privacy-policy',
          pagelink: 'privacy-policy',
        },
        {
          subcategory: 'Community Guidelines',
          icon: 'right-menu-community-guidelines',
          pagelink: 'community-guidelines',
        }
      ]
    },
    {
      category: 'Help',
      icon: 'right-menu-help',
      pagelink: '',
      access: 0,
      subs: [
        {
          subcategory: 'FAQs',
          icon: 'right-menu-faqs',
          pagelink: 'faa-faq',
        },
        {
          subcategory: 'Tutorials',
          icon: 'right-menu-tutorials',
          pagelink: 'faa-tutorial',
        },
        {
          subcategory: 'Legal',
          icon: 'right-menu-legal',
          pagelink: 'faa-legal',
        },
        {
          subcategory: 'Report',
          icon: 'right-menu-report',
          pagelink: 'help/report',
        },
        {
          subcategory: 'App Info',
          icon: 'right-menu-app-info',
          pagelink: 'help/appinfo',
        },
      ],
    },
  ];
  public static DEFAULT_PHONE_CODE = 91; //1;//91;
  public static NUMBER_REGEX_VALIDATION = '^[0-9\\s]+$';
  //https://codingnconcepts.com/java/java-regex-to-validate-phone-number/
  
  // public static ALL_COUNTRY_REGEX_VALIDATION = '^\\d{8,11}$';
  // public static ALL_COUNTRY_REGEX_VALIDATION = '^[\\d\\s]{8,11}$';

  public static ALL_COUNTRY_REGEX_VALIDATION = '^\\d{8,11}$';
  //  '^(\\+\\d{1,3}( )?)?((\\(\\d{1,3}\\))|\\d{1,3})[- .]?\\d{3,4}[- .]?\\d{4}$';


  // public static EMAIL_REGEX_VALIDATION ='^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
  public static EMAIL_REGEX_VALIDATION = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9\\s-]+\\.[a-zA-Z0-9-.]+$';


  public static NAME_REGEX_VALIDATION = '^[a-zA-Z0-9_ ]+$';

  public static USERNAME_REGEX_VALIDATION = '^[a-zA-Z0-9_]+$';

  public static Title_REGEX_VALIDATION = '^[a-zA-Z0-9 ]+$';
  public static ADDRESS_REGEX_VALIDATION = '^[a-zA-Z0-9_.+-(),& /\\]+$';
  // public static PHONE_REGEX_VALIDATION = '^[0-9].{7,}$'; //'^[0-9]+$';
  public static PHONE_REGEX_VALIDATION ='^[\\d]{9,11}$'
  public static PASSWORD_REGEX_VALIDATION =
    '^(?=(.*[a-z]){3,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()-__+.]){1,}).{8,72}$';
  public static MIN_ADDRESS_LENGTH = 1;
  public static MIN_ZIPCODE_LENGTH = 4;
  public static DEFAULT_OTP_TIMEOUT = 60;
  public static MIN_USERNAME_LENGTH = 5;
  public static MIN_COMPANY_NAME_LENGTH = 3;
  public static INPUT_CHANGE_MIN_INTERVAL = 1000;
  public static MODAL_ANIMATION_DURATION = 250;
  public static PRE_APP_EXIT_DURATION = 2000;
  public static FILE_UPLOAD_TYPE = {
    IMG_PDF: ['image/png', 'image/jpeg', 'application/pdf'],
  };
  public static GENDER = {
    MALE: 1,
    FEMALE: 2,
    OTHER: 3,
    NOT_SET: 0,
  };
  public static DATE_FORMAT = {
    YYYYMMDD: 'yyyy-MM-dd',
    TIMESTAMP: 'yyyy-MM-ddTHH:mm:ss',
  };

  public static GeneralPivacy = [
    {
      key: 'A',
      value: 'All Finitee users',
    },
    {
      key: 'C',
      value: 'Connected members',
    },
    {
      key: 'N',
      value: 'Only me',
    },
    
  ];

  public static GeneralLocationShowAt = [
    {
      key: 'L',
      value: 'Live Location',
    },
    {
      key: 'H',
      value: 'Home Location',
    }
  ];

  public static GeneralNonePrivacy = [
    {
      key: 'A',
      value: 'All Finitee users',
    },
    {
      key: 'C',
      value: 'Connected members',
    },
    {
      key: 'N',
      value: 'None',
    },
    
  ];

  public static price_type = [
    {
      key: '/hr',
      value: '/hr',
    }, {
      key: '/week',
      value: '/week',
    }, {
      key: '/month',
      value: '/month',
    }, {
      key: '/year',
      value: '/year',
    }, {
      key: 'lumpsum',
      value: 'lumpsum',
    },
  ];

  public static POST_TYPE = {
    ALL: "ALL",
    USER: "USER",
    TRAIT: "TRAIT",
    PRODUCT: "PRODUCT",
    BEAM_POST: "BEAM_POST",
    DONATION: "DONATION"
  }

  public static POST_VIEW_TYPE = {
    PINTREST: "P",
    INSTA: "I",
  }

  public static POST_COMMENT_VIEW_TYPE = {
    POPUP: "P",
    INLINE: "I",
  }

}
