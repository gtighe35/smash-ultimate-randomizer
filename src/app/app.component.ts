import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database.service';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit{
  constructor(private databaseService: DatabaseService, private analyticsService: AnalyticsService) {}
  async ngOnInit(): Promise<void> {
    await this.databaseService.seedCharacters();
  }
}
