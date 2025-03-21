import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
  standalone: false,
})
export class ItemDetailsPage implements OnInit {
  isActive = false;
  itemId: any;
  name: any;
  image: any;
  price: any;
  mrp: any;
  categoryId: any;
  filteredItems: any[] = [];
  items: any[] = [];
  cartCount: any;
  orderTotal: any;
  description: any;
  itemDetail: any;
  taxPercentage: any;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      this.itemDetail = {
        ...data,
        id: +data['id'],
      };

      console.log(this.itemDetail);
      this.itemId = data['id'];
      this.name = data['name'];
      this.image = data['image'];
      this.price = data['price'];
      this.taxPercentage = data['taxPercentage'];
      this.mrp = data['mrp'];
      this.categoryId = data['categoryId'];
      this.description = data['description'];
      console.log(this.categoryId);

      this.loadData();
    });
  }

  toggleFavorite() {
    this.isActive = !this.isActive;
  }

  calculateDiscountPercentage(mrp: number, price: number): number {
    return mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  }

  async loadData() {
    const data = {
      storeId: this.apiService.storeId,
    };

    try {
      const itemsResponse: any = await this.apiService.get('storeitems', data);
      this.items = itemsResponse.result;
      this.filterAndSelectRandomItems();
    } catch (error) {
      console.error('Error fetching Items:', error);
    }
  }

  filterAndSelectRandomItems() {
    console.log('All Items:', this.items);
    console.log('Current categoryId:', this.categoryId);

    const categoryIdNumber = Number(this.categoryId);

    this.items.forEach((product) => {
      console.log(`Checking Product ID: ${product.id}, Category: ${product.categoryId}`);
    });

    const sameCategoryItems = this.items.filter(
      (product) => Number(product.categoryId) === categoryIdNumber && product.id != this.itemId
    );

    console.log('Filtered Items (Before Random Selection):', sameCategoryItems);

    this.filteredItems = sameCategoryItems.sort(() => Math.random() - 0.5).slice(0, 5);

    console.log('Final 5 Random Items:', this.filteredItems);
  }

  getItemQuantity(itemId: number): number {
    return this.apiService.getItemQuantity(itemId);
  }

  addToCart(item: any) {
    this.apiService.addToCart(item);
    this.updateCartCount();
  }

  incrementItem(itemId: number) {
    this.apiService.incrementItem(itemId);
    this.updateCartCount();
  }

  decrementItem(itemId: number) {
    this.apiService.decrementItem(itemId);
    this.updateCartCount();
  }

  updateCartCount() {
    const cart = this.apiService.getCart();
    this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    this.orderTotal = cart.reduce((total, item) => total + parseFloat(item.total), 0);
  }

  itemDetails(itemId: any, item: any) {
    this.router.navigate(['/', 'item-details', itemId], { queryParams: item });
  }

}
