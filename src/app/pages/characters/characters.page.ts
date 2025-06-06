import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCheckbox, IonHeader, IonTitle, IonToolbar, IonToggle, IonList, IonItem, IonLabel, IonButton, IonInput, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { DatabaseService } from 'src/app/services/database.service';
import { Character } from 'src/app/models/character.model';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { Router } from '@angular/router';
import { PlayerResult } from 'src/app/models/player-result.model';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.page.html',
  styleUrls: ['./characters.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonCheckbox, IonButton, IonLabel, IonItem, IonList, IonToggle, IonContent, IonInput, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class CharactersPage {
characters = this.db.characters;

  generateCount = this.db.generateCount;
  noDuplicates = this.db.noDuplicates;

  constructor(
    private db: DatabaseService,
    private router: Router
  ) {}

  get availableCharacters(): Character[] {
    return Object.values(this.characters()).filter(c => !c.vetoed);
  }

  get vetoedCharacters(): Character[] {
    return Object.values(this.characters()).filter(c => c.vetoed);
  }

  generateCharacters(): void {
    this.db.generatePlayerResults(this.generateCount(), this.noDuplicates())
 
    this.router.navigate(['/results']);
  }

  toggleVeto(character: Character) {
    if (character.vetoed) {
      this.db.unvetoCharacter(character.name);
    } else {
      this.db.vetoCharacter(character.name);
    }
  }

  trackByName(index: number, item: Character): string {
    return item.name;
  }
}
