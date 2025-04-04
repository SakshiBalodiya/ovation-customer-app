import { Component, OnInit } from '@angular/core';
import { EnvService } from '../services/env.service';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  name: any;
  email: any;
  contact: any;
  customerId: string | null = null; // Updated to be dynamically fetched

  networkStatus: string = '';
  networkStatusSubscription: Subscription | null = null;

  constructor(private envService: EnvService, private router: Router, private apiService: ApiService) {
    // Subscribe to network status changes
    this.networkStatusSubscription = this.envService.getNetworkStatus().subscribe(status => {
      this.networkStatus = status;
      console.log(this.networkStatus, 'this.networkStatus');
    });
  }

  async ngOnInit() {
    this.router.events.subscribe(async event => {
      if (event instanceof NavigationEnd && event.url === '/tabs/tab4') {
        await this.loadUserProfile(); 
      }
    });
  }

 async ionViewWillEnter() {
    console.log("Profile page entered");
    this.customerId = localStorage.getItem('customerId');
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    if (!this.customerId) return;

    const data = {
      customerId: this.customerId,
      storeId: this.apiService.storeId,
    };

    try {
      const response: any = await this.apiService.get('profile', data);
      console.log('API Response:', response);

      if (response.profile && response.profile.length > 0) {
        const userProfile = response.profile[0];

        this.name = userProfile.name;
        this.email = userProfile.email;

        console.log('Profile Loaded:', this.name, this.email);
      } else {
        console.error('No profile data found.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  logout() {
    const cartDetails = localStorage.getItem('cart');
    const selectedAddressId = localStorage.getItem('selectedAddressId');
    const currentCustomerId = localStorage.getItem('customerId');
    
    // localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    localStorage.removeItem('isLoggedIn');
    localStorage.clear();
    if (currentCustomerId) {
      localStorage.setItem('previousCustomerId', currentCustomerId);
    }
  
    if (cartDetails) {
      localStorage.setItem('cart', cartDetails);
    }
    if (selectedAddressId) {
      localStorage.setItem('selectedAddressId', selectedAddressId);
    }
    this.envService.user_login = 'false';
    this.router.navigate(['/']);

    console.log('User logged out successfully');
  }

  reload() {
    window.location.reload();
  }
}
