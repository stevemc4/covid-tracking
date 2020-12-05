import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs';

import regions from '../../helper/region'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  data: Observable<any>
  groupedData: any[]
  regions: typeof regions

  constructor(private firestore: AngularFirestore) {
    this.data = firestore.collection('reportedCases').valueChanges({ idField: 'id' })
    this.groupedData = []
    this.regions = regions
  }

  getGroupedData() {
    this.data.subscribe((data: any[]) => {
      this.groupedData = data
        .reduce((prev, item) => {
          let mutated = [...prev];
          const currentIndex = mutated.findIndex(
            mutatedItem => mutatedItem.province === item.province
          );
          if (currentIndex > -1) {
            mutated[currentIndex].count += 1;
          } else {
            mutated = [...mutated, { province: item.province, count: 1 }];
          }
          return mutated;
        }, [])
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    })
  }

  ngOnInit() {
    this.getGroupedData()
  }

}
