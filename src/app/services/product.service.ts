import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsCollection: AngularFirestoreCollection<Product>;

  constructor(private afs: AngularFirestore) {
    this.productsCollection = this.afs.collection<Product>('Products');
  }

  getProducts(): Observable<Product[]> {
    return this.productsCollection.snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            return { id, ...data };
          });
        })
      );
  }

  getProduct(id: string): Observable<Product> {
    return this.productsCollection.doc<Product>(id).valueChanges();
  }

  addProduct(product: Product): Promise<DocumentReference> {
    return this.productsCollection.add(product);
  }

  updateProduct(id: string, product: Product): Promise<void> {
    return this.productsCollection.doc<Product>(id).update(product);
  }

  deleteProduct(id: string): Promise<void> {
    return this.productsCollection.doc<Product>(id).delete();
  }
}
