import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductInterface} from '../../interfaces/product-interface';
import {IndexTableInterface} from '../../../shared/interfaces/index-table-interface';
import {Product} from '../../models/product';
import {Subscription} from 'rxjs';
import {ProductService} from '../../service/product.service';

enum Page {
  CREATE, EDIT, LIST
}

@Component({
  selector: 'app-list-product-view',
  templateUrl: './list-product-view.component.html',
  styleUrls: ['./list-product-view.component.scss']
})
export class ListProductViewComponent implements OnInit, OnDestroy {

  editableProduct: ProductInterface;
  productIndexTable: IndexTableInterface;
  currentPage: Page;

  private subscriptions: Subscription[];

  constructor(
    private productService: ProductService
  ) {
    this.productIndexTable = {columns: ['title', 'description', 'brand', 'price'], dataObjects: []};
    this.editableProduct = new Product();
    this.currentPage = Page.LIST;
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  isCreatePage(): boolean {
    return this.currentPage === Page.CREATE;
  }

  isEditPage(): boolean {
    return this.currentPage === Page.EDIT;
  }

  isListPage(): boolean {
    return this.currentPage === Page.LIST;
  }

  setCurrentPage(page: Page): void {
    this.currentPage = page;
  }

  showListView(): void {
    this.setCurrentPage(Page.LIST);
  }

  showEditPage(product: ProductInterface): void {
    this.editableProduct = product;
    this.setCurrentPage(Page.EDIT);
  }

  showCreateView(): void {
    this.setCurrentPage(Page.CREATE);
  }

  createProduct(product: ProductInterface): void {
    const subscription = this.productService.store(product).subscribe(
      value => {
        this.fetchProducts();
        this.showListView();
        subscription.unsubscribe();

      },
      error => {
        console.log(error);
      },
    );

    this.subscriptions.push(subscription);
  }

  updateProduct(product: ProductInterface): void {

    console.log(product);
    const subscription = this.productService.put(product).subscribe(
      value => {
        this.fetchProducts();
        this.showListView();
        subscription.unsubscribe();
      },
      error => {
        console.log(error);
      },
    );

    this.subscriptions.push(subscription);
  }


  deleteProduct(products: Array<ProductInterface>): void {

    products.forEach(p => {

      const subscription = this.productService.delete(p.id).subscribe(
        value => {
          this.fetchProducts();
          subscription.unsubscribe();
        },
        error => {
          console.log(error);
        },
      );

      this.subscriptions.push(subscription);
    });
  }

  private fetchProducts(): void {
    const subscription = this.productService.getAll().subscribe(
      value => {
        this.productIndexTable.dataObjects = value;
        subscription.unsubscribe();
      },
      error => {
        console.log(error);
      },
    );

    this.subscriptions.push(subscription);
  }
}
