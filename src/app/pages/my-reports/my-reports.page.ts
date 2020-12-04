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

  ngOnInit() {
  }
  
  async ionViewDidEnter() {
    console.log("Fetching Reports...")
    await this.fetchData()
  }

  async fetchData() {
    this.firebase.fetchFirestoreCollection('reportedCases', (docs) => {
      console.log(`CURRENT REPORTS: ${JSON.stringify(docs)}`)
      const data = Object.values(docs)
      this.data = data
    }, (err) => { console.error(err) })
  }

  async handleRefresh(e) {
    await this.fetchData()
    e.target.complete()
  }

  onFabClick() {
    this.router.navigate(['/new-report'])
  }

}
