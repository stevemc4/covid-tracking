import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.page.html',
  styleUrls: ['./my-reports.page.scss'],
})
export class MyReportsPage implements OnInit {

  constructor() { }

  names = [
  ]

  ngOnInit() {
  }

  onFabClick() {
    this.names = [
      ...this.names,
      'Juan'
    ]
  }

}
