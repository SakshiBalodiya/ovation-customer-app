import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { TranslationService } from './services/translation.service';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(public router: Router,private translationService: TranslationService,) {
    this.translationService.init();
    this.lockLandscape();
    let user_login = localStorage.getItem('isLoggedIn');
    // if (user_login === 'true') {
    //   console.log(user_login);
    //   this.router.navigate(['tabs/tab1'])
    // }
  }

  async lockLandscape() {
    if (Capacitor.isNativePlatform()) {
      try {
        await ScreenOrientation.lock({ orientation: 'portrait' });
        console.log('Screen orientation locked to portrait');
      } catch (err) {
        console.error('Error locking screen orientation:', err);
      }
    } else {
      console.warn('ScreenOrientation API is not available in this browser.');
    }
  }

}
