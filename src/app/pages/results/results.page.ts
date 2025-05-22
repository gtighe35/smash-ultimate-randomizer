import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonChip, IonCol, IonRow, IonGrid } from '@ionic/angular/standalone';
import { PlayerResult } from 'src/app/models/player-result.model';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonChip, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class ResultsPage {
  results = this.db.results;

  constructor(private db: DatabaseService) {
  }

}
