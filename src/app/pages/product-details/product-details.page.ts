import { takeUntil } from 'rxjs/operators';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, NavController } from '@ionic/angular';

import { Product } from './../../interfaces/product';
import { AuthService } from './../../services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit, OnDestroy {

  private unsub$ = new Subject();

  private loading: any;

  product: Product = {};
  productId: string = null;

  get canUpdateProduct() {
    return !this.productId || this.product.userId === this.authService.getAuth().currentUser.uid;
  }

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private authService: AuthService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {
    this.productId = this.activatedRoute.snapshot.params['id'];

    if (!!this.productId) {
      this.loadProduct();
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  loadProduct() {
    this.productService.getProduct(this.productId)
      .pipe(
        takeUntil(this.unsub$)
      )
      .subscribe(data => {
        this.product = data;
      })
  }

  async saveProduct() {
    await this.presentLoading();

    this.product.userId = this.authService.getAuth().currentUser.uid;

    if (!!this.productId) {
      try {
        await this.productService.updateProduct(this.productId, this.product);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      }
      catch (error) {
        console.error(error);
        this.presentToast('Erro ao salvar o produto');
        this.loading.dismiss();
      }

    } else {
      this.product.createdAt = new Date().getTime();

      try {
        await this.productService.addProduct(this.product);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      }
      catch (error) {
        console.error(error);
        this.presentToast('Erro ao salvar o produto');
        this.loading.dismiss();
      }
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Por favor, aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });

    return toast.present();
  }

}
