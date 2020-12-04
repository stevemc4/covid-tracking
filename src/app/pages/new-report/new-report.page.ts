import { Component, OnInit } from '@angular/core'
import { ImagePicker } from '@ionic-native/image-picker/ngx'
import { Platform, ToastController } from '@ionic/angular'

import regions, { Cities, Districts, Provinces } from '../../helper/region'

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.page.html',
  styleUrls: ['./new-report.page.scss'],
})
export class NewReportPage implements OnInit {

  // Models
  name: string
  age: number
  gender: string
  selectedProvince: string
  selectedCity: string
  selectedDistrict: string
  address: string
  imageUrl: string

  provinces: Provinces[]
  cities: Cities[]
  districts: Districts[]

  constructor(private imagePicker: ImagePicker, public platform: Platform, public toastController: ToastController) {
    this.provinces = regions.getProvinces()
    this.cities = []
    this.districts = []
    this.imageUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw=='
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

  selectImage() {
    this.imagePicker.getPictures({ allow_video: false, maximumImagesCount: 1}).then((results) => {
      if (results.length > 0) {
        this.imageUrl = results[0]
      }
    }, (err) => { });
  }

  async handleSubmit() {
    // actually do submit
    const toast = await this.toastController.create({
      message: "Report Submitted!",
      duration: 2500
    })
    toast.present()
  }

}
