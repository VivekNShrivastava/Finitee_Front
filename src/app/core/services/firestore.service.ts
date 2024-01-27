import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Firestore, initializeFirestore, CACHE_SIZE_UNLIMITED, collection, onSnapshot } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { enableIndexedDbPersistence } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private firestoreInstance!: Firestore;
  private viewListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public viewList$ = this.viewListSubject.asObservable();

  constructor() {
    this.initFirestore();
  }

  private async initFirestore():  Promise<void> {
    console.log("Initialzing firebase from firestore service...")
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

    const viewingListRef = collection(this.firestoreInstance, 'viewingList');
    onSnapshot(viewingListRef, (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      this.viewListSubject.next(updatedData);
      console.log("udpated", updatedData);
    });
  }

  getFirestoreInstance(): Firestore {
    console.log("retunring the instance...")
    return this.firestoreInstance;
  }
}
