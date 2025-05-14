import { Component, OnInit } from '@angular/core';
import { IonFooter, IonButtons, IonToolbar, IonButton, IonIcon, IonLabel, IonTitle } from "@ionic/angular/standalone";
import { gameControllerOutline, peopleOutline } from 'ionicons/icons';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [IonIcon, IonButton, IonToolbar, IonButtons, IonFooter, RouterLink, RouterLinkActive]
})
export class FooterComponent  implements OnInit {

  constructor() { 
    addIcons({gameControllerOutline, peopleOutline})
  }

  ngOnInit() {}

}
