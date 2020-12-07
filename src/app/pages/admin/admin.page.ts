import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { FCM } from '@capacitor-community/fcm'

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';

const { PushNotifications } = Plugins;
const fcm = new FCM()

import regions from '../../helper/region'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  data: Observable<any>
  groupedData: any[]
  groupedDataSubscription: Subscription
  regions: typeof regions

  constructor(private firestore: AngularFirestore, private alertController: AlertController, private auth: AngularFireAuth, private router: Router) {
    this.data = firestore
      .collection(
        'reportedCases',
        q => q.orderBy('createdAt', 'desc').where('deleted', '==', false)
      )
      .valueChanges({ idField: 'id' })
    this.groupedData = []
    this.regions = regions
  }

  getGroupedData() {
    this.groupedDataSubscription = this.data.subscribe((data: any[]) => {
      this.groupedData = data
        .reduce((prev, item) => {
          let mutated = [...prev];
          const currentIndex = mutated.findIndex(
            mutatedItem => mutatedItem.province === item.province
          );
          if (currentIndex > -1) {
            mutated[currentIndex].count += 1;
          } else {
            mutated = [...mutated, { province: item.province, count: 1 }];
          }
          return mutated;
        }, [])
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    })
  }

  ngOnInit() {
    this.getGroupedData()
    try {
      PushNotifications.requestPermission().then( async result => {
        if (result.granted) {
          await PushNotifications.register();
          await fcm.subscribeTo({ topic: 'new-case' })
        } else {
        }
      });
    } catch (e) {
      
    }
  }

  ngOnDestroy() {
    this.groupedDataSubscription.unsubscribe()
  }

  async handleLogout() {
    const alert = await this.alertController.create({
      header: `Logging out`,
      message: `Are you sure want to log out from the application?`,
      buttons: [
        {
          text: 'Log Out',
          role: 'primary',
          cssClass: 'danger',
          handler: async () => {
            try {
              await fcm.unsubscribeFrom({ topic: 'new-case' })
            } catch (e) {

            }
            await this.auth.signOut()
            this.router.navigate(['/login'])
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    })
    alert.present()
  }

}
