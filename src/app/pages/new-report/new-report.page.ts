import { Component, OnInit } from '@angular/core'
import { ImagePicker } from '@ionic-native/image-picker/ngx'
import { Platform, ToastController } from '@ionic/angular'
import { ActivatedRoute, Router } from '@angular/router'
import { AngularFireStorage } from '@angular/fire/storage'
import { AngularFirestore } from '@angular/fire/firestore'
import firebase from 'firebase'

import regions, { City, District, Province } from '../../helper/region'
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
  provinces: Province[]
  cities: City[]
  districts: District[]

  // States
  state: States
  editingId: string

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
    private router: Router,
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ){
    this.route.queryParams.subscribe(params => {
      this.editingId = params.id
    })
    this.state = States.IDLE 
    this.provinces = regions.getProvinces()
    this.cities = []
    this.districts = []
    this.imageUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw=='
    this.defaultImage = this.imageUrl
  }

  async ngOnInit() {
    if (this.editingId !== null) {
      const document = this.firestore.collection('reportedCases').doc(this.editingId).get()
      document.subscribe(docData => {
        // load data from observer
        const data: any = docData.data()

        // prefetch address select data
        this.cities = regions.getCities(data.province)
        this.districts = regions.getDistricts(data.city)

        // set image
        this.imageUrl = data.picture
        this.defaultImage = data.picture

        // set form values
        this.name = data.name
        this.age = data.age
        this.gender = data.gender
        this.selectedProvince = data.province
        this.selectedCity = data.city
        this.selectedDistrict = data.district
        this.address = data.address
      })
    }
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

  async handleUpload(filename: string) {
    if (this.imageUrl !== this.defaultImage) {
      const imgRef = this.storage.ref(filename)
      await imgRef.putString(this.imageUrl, 'data_url')
      return await imgRef.getDownloadURL().toPromise()
    }
    return null
  }

  async createNew(data: any) {
    try {
      await this.firestore.collection('reportedCases').doc().set(data)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async update(data: any) {
    try {
      await this.firestore.collection('reportedCases').doc(this.editingId).update(data)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async handleSubmit() {
    try {
      this.state = States.SUBMITTING
      const ts = firebase.firestore.FieldValue.serverTimestamp()
      const data = {
        name: this.name,
        age: this.age,
        gender: this.gender,
        province: this.selectedProvince,
        city: this.selectedCity,
        district: this.selectedDistrict,
        address: this.address
      }
      let filePath: Observable<any> = await this.handleUpload(`images/${this.name}_${new Date().getTime()}_${this.selectedDistrict}.png`)

      if (this.editingId !== null)
        await this.update({
          ...data,
          picture: filePath ?? this.imageUrl,
          updatedAt: ts
        })
      else
        await this.createNew({
          ...data,
          picture: filePath ?? null,
          deleted: false,
          createdAt: ts,
          updatedAt: ts
        })

      const toast = await this.toastController.create({
        message: `Report ${this.editingId !== null ? 'Updated' : 'Submitted'}!`,
        duration: 2500
      })
      toast.present()
      this.router.navigate(['/my-reports'])
    } catch (e) {
      console.error(e)
      const toast = await this.toastController.create({
        message: "An error occured. Please try again later",
        duration: 2500
      })
      toast.present()
      this.state = States.IDLE
    }
  }

}
