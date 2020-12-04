import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'
import { Observable } from 'rxjs';

import RegionHelper from '../../helper/region'


@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.page.html',
  styleUrls: ['./my-reports.page.scss'],
})
export class MyReportsPage implements OnInit {

  data: Observable<any[]>
  region: typeof RegionHelper

  constructor(private router: Router, private firestore: AngularFirestore, private alertController: AlertController) {
    this.data = this.firestore.collection('reportedCases').valueChanges({ idField: 'id' })
    this.region = RegionHelper
  }

  ngOnInit() {
  }

  onFabClick() {
    this.router.navigate(['/new-report'])
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
          handler: () => this.deleteItem(caseData.id)
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

  }

}
