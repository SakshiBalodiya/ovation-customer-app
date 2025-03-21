import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: false,
})
export class CategoryPage implements OnInit {
  categories: any[] = [];
  items: any[] = [];
  selectedCategory: any = null;
  filteredItems: any;
  wishlist: number[] = [];
  customerId: number; 
  amount: any;
  type: any;
  cartCount: any;
  orderTotal: any;
  tax: any;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, public modalCtrl: ModalController, private alertController: AlertController, private cdRef: ChangeDetectorRef) {
    this.customerId = Number(localStorage.getItem('customerId')); 
  }

  async ngOnInit() {
    this.loadData();
    this.loadWishlist();
    await this.apiService.loadCart();
    this.updateCartCount();
  }

  async loadData() {
    const data = {
      storeId: this.apiService.storeId,
    };

    try {
      const categoriesResponse: any = await this.apiService.get('storecategories', data);
      this.categories = categoriesResponse.result;
      console.log('Categories:', this.categories);

      const categoryId = history.state.selectedCategory?.id;
      if (categoryId) {
        const category = this.categories.find(cat => cat.id === categoryId);
        if (category) {
          this.selectCategory(category);
        } else {
          this.selectCategory(this.categories[0]);
        }
      } else {
        this.selectCategory(this.categories[0]);
      }

    } catch (error) {
      console.error('Error fetching Categories:', error);
    }

    try {
      const itemsResponse: any = await this.apiService.get('storeitems', data);
      this.items = itemsResponse.result;
      console.log('Items:', this.items);
      this.filterItems();
    } catch (error) {
      console.error('Error fetching Items:', error);
    }
  }

  async loadWishlist() {
    try {
      const response: any = await this.apiService.getWishlist();
      console.log('Wishlist Response:', response);

      const customerWishlist = response.wishlists.filter(
        (item: { customerId: number }) => item.customerId === this.customerId
      );

      this.wishlist = customerWishlist.map((item: { itemId: any }) => item.itemId);

      console.log('Filtered Wishlist:', this.wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }

  isInWishlist(itemId: number): boolean {
    return this.wishlist.includes(itemId);
  }

  async toggleWishlist(itemId: number) {
    try {
      if (this.isInWishlist(itemId)) {
        await this.apiService.removeFromWishlist(itemId);
        this.wishlist = this.wishlist.filter(id => id !== itemId);
      } else {
        await this.apiService.addToWishlist(itemId);
        this.wishlist.push(itemId);
      }
    } catch (error) {
      console.error('Wishlist Error:', error);
    }
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
    console.log('selected', this.selectedCategory);
    this.filterItems();
    setTimeout(() => {
      const element = document.getElementById('category' + category.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    }, 100);
  }

  filterItems() {
    this.filteredItems = this.items.filter(
      (product) => product.categoryId === this.selectedCategory?.id
    );
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
    this.tax = cart.reduce((tax, item) => tax + parseFloat(item.tax), 0);
  }

  back() {
    this.updateCartCount();
    this.cdRef.detectChanges();
    this.router.navigate(['/tabs/tab1']); 
  }

  itemDetails(itemId: any, item: any) {
    this.router.navigate(['/', 'item-details', itemId], { queryParams: item });
  }
}
