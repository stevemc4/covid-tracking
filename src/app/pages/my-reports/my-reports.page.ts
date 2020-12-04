import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
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

  constructor(private router: Router, private firestore: AngularFirestore) {
    this.data = this.firestore.collection('reportedCases').valueChanges({ idField: 'id' })
    this.region = RegionHelper
  }

  ngOnInit() {
  }

  onFabClick() {
    this.router.navigate(['/new-report'])
  }

}
