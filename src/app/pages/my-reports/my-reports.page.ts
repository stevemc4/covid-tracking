import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FirebaseX } from '@ionic-native/firebase-x/ngx'

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.page.html',
  styleUrls: ['./my-reports.page.scss'],
})
export class MyReportsPage implements OnInit {

  constructor(private router: Router, private firebase: FirebaseX) { }

  names = [
  ]

  ngOnInit() {
  }

  onFabClick() {
    this.router.navigate(['/new-report'])
  }

}
