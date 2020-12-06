import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable, Subscription } from 'rxjs';

import RegionHelper from '../../../helper/region'

enum PageState {
  SUMMARY,
  PROVINCE,
  CITY,
  DISTRICT,
}

@Component({
  selector: 'app-regions',
  templateUrl: './regions.page.html',
  styleUrls: ['./regions.page.scss'],
})
export class RegionsPage implements OnInit {

  pageState: PageState
  data: Observable<any>
  groupedData: any[]
  groupedDataSubscription: Subscription
  paramMapSubscription: Subscription
  region: typeof RegionHelper
  currentProvince: string
  currentCity: string

  constructor(private firestore: AngularFirestore, private router: ActivatedRoute) {
    this.paramMapSubscription = router.paramMap.subscribe(param => {
      if(param.has('city')) {
        this.pageState = PageState.CITY
        this.currentProvince = param.get('province')
        this.currentCity = param.get('city')
        this.data = firestore
          .collection(
            'reportedCases',
            q => q.orderBy('createdAt', 'desc').where('deleted', '==', false).where('city', '==', param.get('city'))
          )
          .valueChanges({ idField: 'id' })
      } else if(param.has('province')) {
        this.pageState = PageState.PROVINCE
        this.currentProvince = param.get('province')
        this.data = firestore
          .collection(
            'reportedCases',
            q => q.orderBy('createdAt', 'desc').where('deleted', '==', false).where('province', '==', param.get('province'))
          )
          .valueChanges({ idField: 'id' })
      } else {
        this.pageState = PageState.SUMMARY
        this.data = firestore
          .collection(
            'reportedCases',
            q => q.orderBy('createdAt', 'desc').where('deleted', '==', false)
          )
          .valueChanges({ idField: 'id' })
      }
    })
    this.groupedData = []
    this.region = RegionHelper
  }

  getPageTitle(): string {
    switch (this.pageState) {
      case PageState.PROVINCE: return `Cases of ${this.region.getProvince(this.currentProvince).name}`
      case PageState.CITY: return `Cases of ${this.region.getCity(this.currentCity).name}`
      default: return 'Cases by Region'
    }
  }

  getGroupedData() {
    if (this.groupedDataSubscription)
      this.groupedDataSubscription.unsubscribe()
    switch (this.pageState) {
      case PageState.SUMMARY: this.getGroupedDataByProvince(); break;
      case PageState.PROVINCE: this.getGroupedDataByCity(); break;
      case PageState.CITY: this.getGroupedDataByDistrict(); break;
    }
  }

  getGroupedDataByProvince() {
    this.groupedDataSubscription = this.data.subscribe((data: any[]) => {
      this.groupedData = data
        .reduce((prev, item) => {
          let mutated = [...prev];
          const currentIndex = mutated.findIndex(
            mutatedItem => mutatedItem.id === item.province
          );
          if (currentIndex > -1) {
            mutated[currentIndex].count += 1;
          } else {
            mutated = [...mutated, { id: item.province, name: this.region.getProvince(item.province).name, count: 1 }];
          }
          return mutated;
        }, [])
        .sort((a, b) => b.count - a.count)
    })
  }

  getGroupedDataByCity() {
    this.groupedDataSubscription = this.data.subscribe((data: any[]) => {
      this.groupedData = data
        .reduce((prev, item) => {
          let mutated = [...prev];
          const currentIndex = mutated.findIndex(
            mutatedItem => mutatedItem.id === item.city
          );
          if (currentIndex > -1) {
            mutated[currentIndex].count += 1;
          } else {
            mutated = [...mutated, { id: item.city, name: this.region.getCity(item.city).name, count: 1 }];
          }
          return mutated;
        }, [])
        .sort((a, b) => b.count - a.count)
    })
  }

  getGroupedDataByDistrict() {
    this.groupedDataSubscription = this.data.subscribe((data: any[]) => {
      this.groupedData = data
        .reduce((prev, item) => {
          let mutated = [...prev];
          const currentIndex = mutated.findIndex(
            mutatedItem => mutatedItem.id === item.district
          );
          if (currentIndex > -1) {
            mutated[currentIndex].count += 1;
          } else {
            mutated = [...mutated, { id: item.district, name: this.region.getDistrict(item.district).name, count: 1 }];
          }
          return mutated;
        }, [])
        .sort((a, b) => b.count - a.count)
    })
  }

  ngOnInit() {
    this.getGroupedData()
  }

  ngOnDestroy() {
    this.groupedDataSubscription.unsubscribe()
  }

}
