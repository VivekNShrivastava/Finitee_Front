import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Firestore, doc, updateDoc,  initializeFirestore, getDocs, deleteDoc, CACHE_SIZE_UNLIMITED, collection, onSnapshot } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { enableIndexedDbPersistence } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/base.page';
import { AuthService } from './auth.service';
import { Auth } from 'firebase/auth';
@Injectable({
  providedIn: 'root',
})
export class FirestoreService extends BasePage {
  private firestoreInstance!: Firestore;
  private viewListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public viewList$ = this.viewListSubject.asObservable();
  tempStore: any = [];

  private greetingListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public greetingList$ = this.greetingListSubject.asObservable();
  tempStoreGreet: any = [];

  constructor(public authService: AuthService) {
    super(authService);
    this.initFirestore();
  }

  private async initFirestore(): Promise<void> {
    // console.log("Initialzing firebase from firestore service...")
    const firebaseApp = initializeApp(environment.firebaseConfig);

    try {
      await enableIndexedDbPersistence(initializeFirestore(firebaseApp, {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
        // Additional configuration options if needed
      }));
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a time.
        // Handle accordingly...
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence.
        // Handle accordingly...
      }
    }

    this.firestoreInstance = initializeFirestore(firebaseApp, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    });

    //listening to firebase changes for viewingList document
    const viewingListRef = collection(this.firestoreInstance, 'viewingList');
    const specificDocumentId = this.logInfo.UserName;
    const specificDocumentRef = doc(viewingListRef, specificDocumentId);

    onSnapshot(specificDocumentRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = { id: docSnapshot.id, ...docSnapshot.data() };
        this.tempStore = data;
        this.viewListSubject.next(this.tempStore);
      } else {
        console.log('Viewing Document not found');
      }
    }, (error) => {
      console.error('Error listening for document changes:', error);
    });

    //listening to firebase changes for greetingList document
    const greetingListRef = collection(this.firestoreInstance, 'greetingList');
    const specificDocId = this.logInfo.UserId;
    const specificDocRef = doc(greetingListRef, specificDocId);

    onSnapshot(specificDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = {...docSnapshot.data()};
        for (let key of Object.keys(data)) {
         this.tempStoreGreet.push(key) 
        }
        this.greetingListSubject.next(this.tempStoreGreet);        
      } else {
        console.log('Greeting Document not found');
      }
    }, (error) => {
      console.error('Error listening for document changes:', error);
    });
  }

  deleteFieldFromDocuments(fieldToDelete: string): void {
    const viewingListRef = collection(this.firestoreInstance, 'viewingList');
    getDocs(viewingListRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (Array.isArray(userData['names'])) {
          const updatedNames = userData['names'].filter((nameObject: any) => {
            // Assuming nameObject is an object with the field to delete
            return !(nameObject.UserId === fieldToDelete);
          });

          const updatedData = { ...userData, names: updatedNames };

          updateDoc(doc.ref, updatedData).then(() => {
            // console.log(`Field '${fieldToDelete}' deleted from document with ID ${doc.id}`);
          }).catch((error) => {
            console.error(`Error updating document with ID ${doc.id}:`, error);
          });
        }
      });
    }).catch((error) => {
      console.error('Error deleting field from documents:', error);
    });
  }

  

  getFirestoreInstance(): Firestore {
    // console.log("retunring the instance...")
    return this.firestoreInstance;
  }
}
