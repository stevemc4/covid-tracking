import { Component, OnInit } from '@angular/core'

import regions, { Cities, Districts, Provinces } from '../../helper/region'

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.page.html',
  styleUrls: ['./new-report.page.scss'],
})
export class NewReportPage implements OnInit {

  provinces: Provinces[]
  selectedProvince: string
  cities: Cities[]
  selectedCity: string
  districts: Districts[]
  selectedDistrict: string

  constructor() {
    this.provinces = regions.getProvinces()
    this.cities = []
    this.districts = []
  }

  ngOnInit() {
  }

  handleProvinceChange(e) {
    this.selectedProvince = e.target.value
    this.cities = regions.getCities(e.target.value)
  }

  handleCityChange(e) {
    this.selectedCity = e.target.value
    this.districts = regions.getDistricts(e.target.value)
  }

}
