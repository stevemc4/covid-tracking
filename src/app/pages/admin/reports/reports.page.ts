import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore'
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import RegionHelper from '../../../helper/region'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  data: Observable<any>
  region: typeof RegionHelper
  paramMapSubscription: Subscription

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute) {
    this.paramMapSubscription = this.route.paramMap.subscribe(param => {
      if(param.has('district')) {
        this.data = this.firestore.collection('reportedCases', q =>
          q.where('deleted', '==', false).where('district', '==', param.get('district')).orderBy('createdAt', 'desc')
        ).valueChanges({ idField: 'id' })
      } else {
        this.data = this.firestore.collection('reportedCases', q =>
          q.where('deleted', '==', false).orderBy('createdAt', 'desc')
        ).valueChanges({ idField: 'id' })
      }
    })
    this.region = RegionHelper
  }

  ngOnInit() {
  }

}
