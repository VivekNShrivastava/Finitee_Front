import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { SignalRService } from '../../../core/services/signal-r.service';
import { environment } from '../../../../environments/environment';
import * as config from '../../../core/models/config/ApiMethods';
import { FiniteeService } from '../models/FiniteeService';
import { TotemSearchResult, FiniteeUserOnMap } from '../models/MapSearchResult';
import { MapSearchTerms } from '../models/MapSearchTerm';
import { Greeting } from '../models/UserOnMap';
import { NotificationEvents } from '../../../core/models/notification/NotificationEvents';
import { FiniteeUser } from '../../../core/models/user/FiniteeUser';

import { getFirestore, addDoc, arrayRemove, getDoc, arrayUnion, setDoc, doc, Firestore, terminate, collection, getDocs, onSnapshot, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public mainList: any = [];
  private firestoreInstance: Firestore;
  firestore: any;
  private baseUrl = environment.baseUrl;
  private viewListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public viewList$ = this.viewListSubject.asObservable();
  public listener : EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private _signalRService: SignalRService,
    private firestoreService: FirestoreService
  ) { 
    this.firestoreInstance = firestoreService.getFirestoreInstance();
    // this.initializeViewList();.
    this.firestore = getFirestore();
    // console.log("firestore from map.service", this.firestore);
   
  }

  public showLoader(): void {

  }
  public hideLoader(): void {

  }

  async initializeViewList(){
    await this.terminateFireStore()
    const app = initializeApp(environment.firebaseConfig)
    this.firestore = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED
    })
  }

  async terminateFireStore() {
    try {
      const app = await initializeApp(environment.firebaseConfig);
      this.firestore = await initializeFirestore(app, {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED
      });
      // this.firechatdb = getFirestore();
      await terminate(this.firestore);
      // console.log("terminate firestore success from map");
      return true;
    }
    catch (e) {
      // console.log("terminate firestore fail from map", e);
      return true;
    }
  }

  // public async addToViewList(name: string) {
  //   try {
  //     const docRef = await addDoc(collection(this.firestore, 'viewingList'), {
  //       // name: this.markerList[this.markerCurrentIndex],
  //       name: name
  //     });
  //     console.log('Document written with ID: ', docRef.id);
  //   } catch (e) {
  //     console.error('Error adding document: ', e);
  //   }
  // }

  public async addToViewList(customDocumentId: string, name: any) {
    try {
      const docRef = doc(this.firestore, 'viewingList', customDocumentId);
      
      const docSnapshot = await getDoc(docRef);
    
      if (docSnapshot.exists()) {
        // Document exists, update the array by adding the new name
        await setDoc(docRef, {
          names: arrayUnion(name) // Assuming 'names' is the array field in your document
        }, { merge: true });
      } else {
        // Document doesn't exist, create a new document
        await setDoc(docRef, {
          names: [name] // Create an array with the new name
        });
      }
  
      console.log('Document written with ID: ', customDocumentId);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  public async removeNameFromViewList(customDocumentId: string, name: string) {
    try {
      // console.log("to remove from", customDocumentId);
      // console.log("to reomve", name);
      const docRef = doc(this.firestore, 'viewingList', customDocumentId);
  
      // Retrieve the existing document
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        // Document exists, remove the name from the array
        await setDoc(docRef, {
          names: arrayRemove(name) // Assuming 'names' is the array field in your document
        }, { merge: true });
  
        console.log('Name removed from document with ID: ', customDocumentId);
      } else {
        console.error('Document does not exist with ID: ', customDocumentId);
      }
    } catch (e) {
      console.error('Error removing name from document: ', e);
    }
  }

  public setupRealtimeListener(): void {
    const query = collection(this.firestoreInstance, 'viewingList');

    onSnapshot(query, (snapshot) => {
      const updatedViewList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      this.viewListSubject.next(updatedViewList);
    });
  }

  // public async getViewList(): Promise<any[]> {
  //   console.log("in this list", this.firestoreInstance);
  //   const querySnapshot = await getDocs(collection(this.firestore, 'viewingList'));
  //   console.log("getDataFromFirestore", querySnapshot);
  //   return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  // }

  public post(api: string, params: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${api}`, params);
  }

  public get(api: string): Observable<any> {
    return this.http.get(`${api}`);
  }

  public getUserSetting(settingKey: string): Observable<any> {
    return of(true);
  }

  public getAppSetting(userId: number): Observable<any> {
    return of({
      map: {
        km: 20
      }
    });
  }

  public oneTimeSearch(searchTerms: MapSearchTerms, logInfo: FiniteeUser, location: any): Observable<any> {
    const params = {
      UserId: logInfo.UserId,
      Latitude: location.lat,
      Longitude: location.lng,
      SearchKey: searchTerms.key,
      UserAge: searchTerms.age,
      RangeInKm: searchTerms.km,
      UserTypeSearch: searchTerms.type ? searchTerms.type.split(',') : ['All'],
      BuyOrSell: searchTerms.bysl ?? false,
      UserTypeId: logInfo.UserTypeId,
      Popular: searchTerms.pplr ?? false,
      IsProductSpecific: searchTerms.isprt,
      searchRequest: null
    };
    return this.http.post<any>(config.GET_SER_USR_MAP_V1, params).pipe(
      map((response: any) => {
        const responseData = response.ResponseData || {};
        this.mainList = [];
        if (responseData.FreeUsers?.length) {
          this.addUsers(responseData.FreeUsers, false);
        }
        if (responseData.BusinessUsers?.length) {
          this.addUsers(responseData.BusinessUsers, false);
        }
        if (responseData.NonProfitUsers?.length) {
          this.addUsers(responseData.NonProfitUsers, false);
        }
        // if (responseData.DonationUsers?.length) {
        //   this.addUsers(responseData.DonationUsers, false);
        // }
        if (responseData.Totems) {
          this.addTotems(responseData.Totems, false);
        }
        if (responseData.ServiceAvailable) {
          this.addServices(responseData.ServiceAvailable, 'SA', false);
        }
        if (responseData.ServiceRequired) {
          this.addServices(responseData.ServiceRequired, 'SR', false);
        }

        return response;
      })
    );
  }

  addUsers(listOfUsers: FiniteeUserOnMap[], isSearch?: boolean) {
    if (isSearch) {
      this.mainList = [];
    }
    const existingUserId = this.mainList.map((val: any) => val.entity == 'U' ? val.id : null).filter((a: any) => a);
    listOfUsers.forEach(newUser => {
      if (existingUserId.indexOf(newUser.UserId) > -1) {
        this.mainList.forEach((val: any, idx: any) => {
          if (val.entity == 'U' && val.UserId == newUser.UserId) {
            this.mainList[idx] = { entity: 'U', ...newUser };
          }
        });
      } else {
        this.mainList.push({
          entity: 'U',
          ...newUser
        });
      }
    });
  }

  userGreetingStatus(dbj: any, isCon: boolean) {
    let greetingShow: any = {
      accept: null,
      send: null,
      reject: null,
      block: null
    };
    if (dbj) {
      if (dbj.gflag == 'S') {
        greetingShow.accept = true;
        greetingShow.reject = true;
        if (!isCon) {
          greetingShow.block = true;
        }
      }
      if (dbj.gflag == 'R') {

      }
      if (dbj.gflag == 'B') {

      }
      if (dbj.gflag == 'A') {
        greetingShow.send = true;
      }
    } else {
      greetingShow.send = true;
    }
    return greetingShow;
  }

  addServices(listOfServices: FiniteeService[], serviceType: string, isSearch?: boolean) {
    if (isSearch) {
      this.mainList = [];
    }
    const existingServiceId = this.mainList.map((val: any) => val.entity == serviceType ? val.ServiceId : null).filter((a: any) => a);
    listOfServices.forEach(eachService => {
      if (existingServiceId.indexOf(eachService.ServiceId) > -1) {
        this.mainList.forEach((val: any, idx: any) => {
          if (val.entity == serviceType && val.ServiceId == eachService.ServiceId) {
            this.mainList[idx] = { entity: serviceType, ...eachService };
          }
        });
      } else {
        eachService.timg = config.VIEW_URL + eachService.UserId + '/' + eachService.UserProfileImage;
        this.mainList.push({
          entity: serviceType,
          ...eachService
        });
      }
    });
  }

  addTotems(listOfTotems: TotemSearchResult[], isSearch?: boolean) {
    if (isSearch) {
      this.mainList = [];
    }
    const existingTotemId = this.mainList.map((val: any) => val.entity == 'T' ? val.TotemId : null).filter((a: any) => a);
    listOfTotems.forEach(val => {
      if (existingTotemId.indexOf(val.TotemId) > -1) {
      } else {
        val.ttimg = val.ttimg ? val.UserId + '/' + val.ttimg : '';
        this.mainList.push({
          entity: 'T',
          ...val
        });
      }
    });
  }

  sendGreeting(data: Greeting): Observable<Greeting> {
    return this.http.post<Greeting>(environment.baseUrl + "finitee/SendGreenting", data).pipe(tap(() => {
      //this._signalRService.sendMessage(NotificationEvents.GreetingEvent,JSON.stringify(data));
    }));
  }

  acceptGreeting(data: Greeting): Observable<Greeting> {
    return this.http.post<Greeting>(environment.baseUrl + "finitee/AcceptGreeting", data)
  }

  rejectGreeting(data: Greeting): Observable<Greeting> {
    return this.http.post<Greeting>(environment.baseUrl + "finitee/RejectGreeting", data)
  }
}
