import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'
import { Observable, Subscription } from 'rxjs';
import firebase from 'firebase/app'

import RegionHelper from '../../helper/region'


@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.page.html',
  styleUrls: ['./my-reports.page.scss'],
})
export class MyReportsPage implements OnInit {

  data: Observable<any[]>
  userSubscription: Subscription
  region: typeof RegionHelper

  constructor(private router: Router, private firestore: AngularFirestore, private alertController: AlertController, public auth: AngularFireAuth) {
    this.userSubscription = this.auth.user.subscribe(user => {
      this.data = this.firestore.collection('reportedCases', q =>
        q.where('deleted', '==', false).where('user', '==', user.uid).orderBy('createdAt', 'desc')
      ).valueChanges({ idField: 'id' })
    })
    this.region = RegionHelper
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
  }

  onFabClick() {
    this.router.navigate(['/new-report'])
  }

  handleUpdate(id: string) {
    this.router.navigate([`/update`], { queryParams: { id }})
  }

  async handleDelete(caseData: any) {
    const alert = await this.alertController.create({
      header: `Delete ${caseData.name}`,
      message: `Are you sure want to delete ${caseData.name}'s case?`,
      buttons: [
        {
          text: 'Delete',
          role: 'primary',
          cssClass: 'danger',
          handler: () => {
            this.deleteItem(caseData.id)
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

  async deleteItem(id: string) {
    await this.firestore.collection('reportedCases').doc(id).update({
      deleted: true,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
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
            await this.auth.signOut()
            this.router.navigate(['/login'], { replaceUrl: true })
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
