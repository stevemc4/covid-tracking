import { Component, OnInit } from '@angular/core'
import { ImagePicker } from '@ionic-native/image-picker/ngx'
import { Platform, ToastController } from '@ionic/angular'
import { Router } from '@angular/router'
import { FirebaseX } from '@ionic-native/firebase-x/ngx'
import { AngularFireStorage } from '@angular/fire/storage'

import regions, { Cities, Districts, Provinces } from '../../helper/region'
import { Observable } from 'rxjs'

enum States {
  IDLE,
  SUBMITTING
}

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.page.html',
  styleUrls: ['./new-report.page.scss'],
})
export class NewReportPage implements OnInit {

  // Data
  defaultImage: string
  provinces: Provinces[]
  cities: Cities[]
  districts: Districts[]

  // States
  state: States

  // Models
  name: string
  age: number
  gender: string
  selectedProvince: string
  selectedCity: string
  selectedDistrict: string
  address: string
  imageUrl: string


  constructor(
    private imagePicker: ImagePicker,
    public platform: Platform,
    public toastController: ToastController,
    private firebase: FirebaseX,
    private router: Router,
    private storage: AngularFireStorage
  ){
    this.state = States.IDLE 
    this.provinces = regions.getProvinces()
    this.cities = []
    this.districts = []
    this.imageUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw=='
    this.defaultImage = this.imageUrl
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

  handleDistrictChange(e) {
    this.selectedDistrict = e.target.value
  }

  selectImage() {
    this.imagePicker.getPictures({ allow_video: false, maximumImagesCount: 1, outputType: 1, width: 720, height: 720, quality: 65}).then((results) => {
      if (results.length > 0) {
        this.imageUrl = `data:image/png;base64,${results[0]}`
      }
    }, (err) => { });
  }

  checkSubmitStatus(): boolean {
    return !(this.name !== undefined && this.age !== undefined && this.gender !== undefined && this.selectedDistrict !== undefined && this.address !== undefined && this.state !== States.SUBMITTING)
  }

  getSubmitButtonText(): string {
    return this.state === States.SUBMITTING ? 'Submitting...' : 'Submit'
  }

  async handleSubmit() {
    try {
      this.state = States.SUBMITTING
      const data = {
        name: this.name,
        age: this.age,
        gender: this.gender,
        province: this.selectedProvince,
        city: this.selectedCity,
        district: this.selectedDistrict,
        address: this.address
      }
  
      let filePath: Observable<any> = null
      
      if (this.imageUrl !== this.defaultImage) {
        const imgRef = this.storage.ref(`images/${this.name}_${new Date().getTime}_${this.selectedDistrict}.png`)
        await imgRef.putString(this.imageUrl, 'data_url')
        filePath = imgRef.getDownloadURL()
      }
  
      await this.firebase.addDocumentToFirestoreCollection({
        ...data,
        picture: filePath ?? null,
        deleted: false
      },
      'reportedCases',
      async (id) => { 
        console.log(id)
        const toast = await this.toastController.create({
          message: "Report Submitted!",
          duration: 2500
        })
        toast.present()
        this.router.navigate(['/my-reports'])
      },
      async (err) => {
        console.log(err)
        const toast = await this.toastController.create({
          message: "An error occured. Please try again later",
          duration: 2500
        })
        toast.present()
        this.state = States.IDLE
      })
    } catch (e) {
      console.log(e)
      const toast = await this.toastController.create({
        message: "An error occured. Please try again later",
        duration: 2500
      })
      toast.present()
      this.state = States.IDLE
    }
  }

}
