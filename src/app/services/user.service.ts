import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection<User>('Users');
  }

  getUser(id: string): Observable<User> {
    return this.usersCollection.doc<User>(id).valueChanges();
  }

  addUser(id: string, user: User): Promise<void> {
    const { name, email } = user;
    return this.usersCollection.doc(id).set({ name, email });
  }
}
