import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { SortByPage } from '../modals/sort-by/sort-by.page';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit {
  searchSubject: Subject<string> = new Subject(); 
  isActive = false;
  isSearchActive = false;
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300) 
    ).subscribe(query => {
      this.onSearchChange(query);
    });
  }
  toggleFavorite() {
    this.isActive = !this.isActive;
  }
  onSearchInput(query: any) {
    console.log('search result', query);
    this.searchSubject.next(query); 
  }
  onSearchChange(event: any){

    const query = event.target.value.toLowerCase();
    if (query.length < 1) {
      this.isSearchActive = false;
    }
    else {
      this.isSearchActive = true;
      console.log(this.isSearchActive)
    }
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

}
