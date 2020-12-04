import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FirebaseX } from '@ionic-native/firebase-x/ngx'

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.page.html',
  styleUrls: ['./my-reports.page.scss'],
})
export class MyReportsPage implements OnInit {

  data: any[]

  constructor(private router: Router, private firebase: FirebaseX) {
    this.data = []
  }

  async ngOnInit() {
    await this.fetchData()
  }

  async fetchData() {
    this.firebase.fetchFirestoreCollection('reportedCases', (docs) => {
      const data = Object.values(docs)
      console.log(`CURRENT REPORTS: ${JSON.stringify(data)}`)
      this.data = data
    }, () => {})
  }

  onFabClick() {
    this.router.navigate(['/new-report'])
  }

}
