import { Injectable } from '@angular/core';
import { firebaseApp$ } from '@angular/fire/app';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { getApps } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() {
    this.initAnalytics();
  }

  async initAnalytics() {
    console.log('Initializing Firebase Analytics');
    if ((await Capacitor.getPlatform()) === 'web') {
      await FirebaseAnalytics.initializeFirebase(environment.firebaseConfig);
    }
      await FirebaseAnalytics.logEvent({
        name: 'app_started',
        params: { platform: Capacitor.getPlatform() }
      });
  }

  async logEvent(eventName: string, eventParams?: { [key: string]: any }) {
    await FirebaseAnalytics.logEvent({
      name: eventName,
      params: eventParams || {}
    });
  }
}
