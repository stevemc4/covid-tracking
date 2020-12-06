import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'
import { Observable } from 'rxjs';
import firebase from 'firebase/app'

import RegionHelper from '../../helper/region'


@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.page.html',
  styleUrls: ['./my-reports.page.scss'],
})
export class MyReportsPage implements OnInit {

  data: Observable<any[]>
  region: typeof RegionHelper

  constructor(private router: Router, private firestore: AngularFirestore, private alertController: AlertController, public auth: AngularFireAuth) {
    this.data = this.firestore.collection('reportedCases', q =>
      q.where('deleted', '==', false)
    ).valueChanges({ idField: 'id' })
    this.region = RegionHelper
  }

  ngOnInit() {
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

}
