import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-customalert',
  templateUrl: './customalert.page.html',
  styleUrls: ['./customalert.page.scss'],
  standalone: false,

})
export class CustomalertPage implements OnInit {
  heading: any; 
  msg:any;

  constructor(public modalCtrl: ModalController,private navParams: NavParams) { }



  ngOnInit() {
    this.heading = this.navParams.get('heading');
    this.msg = this.navParams.get('msg');
  }

  close() {
    this.modalCtrl.dismiss(null); 
  }

}
