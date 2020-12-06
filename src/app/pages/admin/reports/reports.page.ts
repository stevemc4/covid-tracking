import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs';

import RegionHelper from '../../../helper/region'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  data: Observable<any>
  region: typeof RegionHelper

  constructor(private firestore: AngularFirestore) {
    this.data = this.firestore.collection('reportedCases', q =>
      q.where('deleted', '==', false).orderBy('createdAt', 'desc')
    ).valueChanges({ idField: 'id' })
    this.region = RegionHelper
  }

  ngOnInit() {
  }

}
