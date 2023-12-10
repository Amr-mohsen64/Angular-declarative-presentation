import { ProductCategoryService } from './../../product-categories/product-category.service';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  catchError,
  combineLatest,
  filter,
  map,
  of,
  startWith,
  throwError,
} from 'rxjs';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ProductCategory } from '../../product-categories/product-category';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';
  // errorMessage = '';

  private errorMessageSubject = new Subject<string>();
  errorMessageAction$ = this.errorMessageSubject.asObservable();

  // private categorySelectedSubject = new BehaviorSubject<number>(0);
  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  constructor(
    private productService: ProductService,
    private categoryService: ProductCategoryService
  ) {}

  categories$ = this.categoryService.categories$.pipe(
    catchError((error) => {
      this.errorMessageSubject.next(error);
      // return of([]);
      return EMPTY;
    })
  );

  products$ = combineLatest([
    // this.productService.productsWithCategory$,
    this.productService.productsWithAdd$,
    this.categorySelectedAction$.pipe(startWith(0)),
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter((product) =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )
    ),
    catchError((error) => {
      this.errorMessageSubject.next(error);
      return EMPTY;
    })
  );

  // ngOnInit(): void {
  //   this.sub = this.productService.getProducts()
  //     .subscribe({
  //       next: products => this.products = products,
  //       error: err => this.errorMessage = err
  //     });
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
