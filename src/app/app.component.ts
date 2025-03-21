import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { TranslationService } from './services/translation.service';
import { Router } from '@angular/router';
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(public router: Router,private translationService: TranslationService) {
    this.translationService.init();
  }
}
