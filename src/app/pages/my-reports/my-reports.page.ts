import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.page.html',
  styleUrls: ['./my-reports.page.scss'],
})
export class MyReportsPage implements OnInit {

  data: Observable<any[]>

  constructor(private router: Router, private firestore: AngularFirestore) {
    // this.data = []
  }

  ngOnInit() {
  }
  
  async ionViewDidEnter() {
    console.log("Fetching Reports...")
    await this.fetchData()
  }

  async fetchData() {
    this.data = this.firestore.collection('reportedCases').valueChanges()
  }

  async handleRefresh(e) {
    await this.fetchData()
    e.target.complete()
  }

  onFabClick() {
    this.router.navigate(['/new-report'])
  }

}
