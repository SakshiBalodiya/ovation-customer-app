import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { SortByPage } from '../modals/sort-by/sort-by.page';
import { ApiService } from '../services/api.service';
import Fuse from 'fuse.js';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit {
  fuse: Fuse<any> | null = null;
  searchSubject: Subject<string> = new Subject(); 
  isActive = false;
  isSearchActive = false;
  @ViewChild('searchbar', { static: false }) searchbar!: IonSearchbar;
  items: any; 
  filteredItems: any[] = [];
  topSearches: string[] = ['Good Knight', 'Tata Salt', 'Amul Milk', 'Oil', 'Sugar'];
  wishlist: any;
  customerId: any;
  randomItems: any;
  cartCount: any;
  orderTotal: any;
  searchTimeout: any;
  recentSearches: string[] = [];
  tax: any;
  constructor(private modalController: ModalController, private apiService: ApiService) { 
    
  }

  async ngOnInit() {
    this.customerId = Number(localStorage.getItem('customerId')); 
    this.searchSubject.pipe(
      debounceTime(300) 
    ).subscribe(query => {
      this.onSearchChange(query);
    });
    this.loadData();
    this.loadWishlist();
    await this.apiService.loadCart();
    this.loadRecentSearches();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchbar?.setFocus();
    }, 300);
    this.updateCartCount();
  }

  async loadData() {
    const data = {
      storeId: this.apiService.storeId,
    };

    try {
      const itemsResponse: any = await this.apiService.get('storeitems', data);
      this.items = itemsResponse.result;
      this.filteredItems = [...this.items];
      console.log('Items:', this.items);
      this.randomItems = this.getRandomItems(this.items, 4);
    } catch (error) {
      console.error('Error fetching Items:', error);
    }
  }

  getRandomItems(array: any[], count: number): any[] {
    let shuffled = [...array].sort(() => Math.random() - 0.4);
    return shuffled.slice(0, count);
  }

  toggleFavorite() {
    this.isActive = !this.isActive;
  }

  // onSearchInput(query: any) {
  //   console.log('search result', query);
  //   this.searchSubject.next(query); 
  // }
  
  onSearchInput(event: any) {
    this.searchSubject.next(event.target.value);
  }

  // onSearchChange(query: string) {
  //   query = query.trim().toLowerCase();
  //   if (query.length < 1) {
  //     this.isSearchActive = false;
  //     this.filteredItems = [...this.items];
  //   } else {
  //     this.isSearchActive = true;
  //     this.filteredItems = this.items.filter((item: { name: string; }) =>
  //       item.name.toLowerCase().includes(query)
  //     );
  //     this.saveRecentSearch(query);
  //   }
  //   console.log('Filtered Items:', this.filteredItems);
  // }

  initializeFuse() {
    if (!this.items || this.items.length === 0) {
      console.warn('Items list is empty, cannot initialize Fuse.js');
      return;
    }

    const options = {
      keys: ['name', 'keywords'], // Fields to search
      threshold: 0.5, // Lower = stricter match, higher = more lenient
      includeScore: true, // Optional: Get match score
    };

    this.fuse = new Fuse(this.items, options); // Initialize Fuse.js
  }

  onSearchChange(query: string) {
    query = query.trim().toLowerCase();

    if (!this.fuse) {
      this.initializeFuse(); // Ensure Fuse.js is initialized before search
    }

    if (query.length < 1) {
      this.isSearchActive = false;
      this.filteredItems = [...this.items];
    } else {
      this.isSearchActive = true;

      if (this.fuse) {
        const results = this.fuse.search(query);
        this.filteredItems = results.map(result => result.item); // Extract matched items
      } else {
        console.error('Fuse.js is not initialized');
        this.filteredItems = [];
      }

      // Delay saving the recent search
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.saveRecentSearch(query);
      }, 3000);
    }

    console.log('Filtered Items:', this.filteredItems);
  }

  // onSearchChange(query: string) {
  //   query = query.trim().toLowerCase();
  //   if (query.length < 1) {
  //     this.isSearchActive = false;
  //     this.filteredItems = [...this.items];
  //   } else {
  //     this.isSearchActive = true;
  //     this.filteredItems = this.items.filter((item: { name: string; keywords?: string }) => {
  //       const keywordsArray = item.keywords ? item.keywords.toLowerCase().split(',').map(k => k.trim()) : [];

  //       return (
  //         item.name.toLowerCase().includes(query) ||
  //         keywordsArray.some(keywords => keywords.includes(query)) 
  //       );
  //     });
  //     clearTimeout(this.searchTimeout);

  //     this.searchTimeout = setTimeout(() => {
  //       this.saveRecentSearch(query);
  //     }, 3000);
  //   }
  //   console.log('Filtered Items:', this.filteredItems);
  // }
  


  selectTopSearch(item: string) {
    this.searchbar.value = item; 
    this.onSearchChange(item); 
  }


  async sortBy() {
    const modal = await this.modalController.create({
      component: SortByPage,
      cssClass: 'sortBy-modal',
      breakpoints: [0.25, 0.5, 0.75],
      initialBreakpoint: 0.40,
      // backdropBreakpoint: ,
      componentProps: {
        backdropDismiss: false,
      }
    });
    await modal.present();
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
        this.wishlist = this.wishlist.filter((id: number) => id !== itemId);
      } else {
        await this.apiService.addToWishlist(itemId);
        this.wishlist.push(itemId);
      }
    } catch (error) {
      console.error('Wishlist Error:', error);
    }
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

  // saveRecentSearch(query: string) {
  //   let searches: string[] = JSON.parse(localStorage.getItem('recentSearches') || '[]');

  //   searches = searches.filter(item => item !== query);

  //   searches.unshift(query);

  //   if (searches.length > 5) {
  //     searches.pop();
  //   }

  //   localStorage.setItem('recentSearches', JSON.stringify(searches));
  //   this.recentSearches = searches;
  // }

  saveRecentSearch(query: string) {
    let searches: string[] = JSON.parse(localStorage.getItem('recentSearches') || '[]');

    if (!searches.includes(query)) {
      searches.unshift(query);
    }

    if (searches.length > 5) {
      searches = searches.slice(0, 5);
    }

    localStorage.setItem('recentSearches', JSON.stringify(searches));
    this.recentSearches = searches;
  }

  loadRecentSearches() {
    this.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    console.log(this.recentSearches);
  }

  selectSearch(item: string) {
    this.searchbar.value = item;
    this.onSearchChange(item);
  }

  clearRecentSearches() {
    localStorage.removeItem('recentSearches'); 
    this.recentSearches = [];
  }

}
