import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root'
})
export class EnvService {
  user_login: string = 'false';
  NETWORK_STATUS = new BehaviorSubject<string>('Online');
  constructor(private api: ApiService) {
    this.checkNetworkStatus();
    this.listenToNetworkChanges();
  }


  async checkNetworkStatus() {
    const status = await Network.getStatus();
    console.log('Initial network status:', status);
    this.NETWORK_STATUS.next(status.connected ? 'Online' : 'Offline');
  }

  listenToNetworkChanges() {
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed:', status);
      this.NETWORK_STATUS.next(status.connected ? 'Online' : 'Offline');
    });
  }
  getNetworkStatus() {
    return this.NETWORK_STATUS.asObservable();
  }
}
