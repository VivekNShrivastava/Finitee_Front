// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let baseUrl = 'https://api.finitee.com/';
if (window.location.origin.includes("localhost")) {
  // baseUrl = "http://localhost:7003/"
}
export const environment = {
  production: false,
  baseUrl: baseUrl,
  GOOGLE_MAP_KEY: 'AIzaSyAVjVXr5Nw8Unpooct_kxvBLLzbwa-s4Jk',
  captchaSiteKey: '6LejMXAgAAAAAN5a8g5U4yGdaO6IGPvwjemdVjPC',
  attachementUrl: 'https://finitee.sgp1.digitaloceanspaces.com/',
  firebaseConfig: {
    apiKey: "AIzaSyAn32dxmcBJ5TzMcq-v4AgOghDUeJRr6Fw",
    authDomain: "finitee-f8b7c.firebaseapp.com",
    projectId: "finitee-f8b7c",
    storageBucket: "finitee-f8b7c.appspot.com",
    messagingSenderId: "350794454544",
    appId: "1:350794454544:web:1e919ecc4626f759359c95",
    measurementId: "G-VCB3B6LKT8"
  },
  RAZORPAY_KEY: 'rzp_test_DViF3GN7dBn3Sa'
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
