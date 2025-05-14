import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonItem, IonList, IonInput } from '@ionic/angular/standalone';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { DatabaseService } from 'src/app/services/database.service';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
  standalone: true,
  imports: [IonList, IonItem, IonIcon, IonButton, IonContent, CommonModule, FormsModule, HeaderComponent, FooterComponent, IonInput]
})
export class PlayersPage {
  players = this.db.players;

  newPlayerName: string = '';

  constructor(public db: DatabaseService) 
  {
    addIcons({closeOutline});
  }

  addPlayer(): void {
    const name = this.newPlayerName.trim();
    if (name) {
      this.db.addPlayer(name);
      this.newPlayerName = '';
    }
  }

  removePlayer(playerId: string): void {
    this.db.removePlayer(playerId);
  }
}
