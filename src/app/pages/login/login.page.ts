import { Component, OnInit } from '@angular/core';

import { WindowService } from '../../services/window.service'
import { AngularFireAuth } from '@angular/fire/auth'
import firebase from 'firebase/app'
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

enum State {
  IDLE,
  LOADING,
  CODE,
  VERIFYING
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  windowRef: any
  phoneNumber: string
  code: string
  pageState: State
  firebaseConfirmation: firebase.auth.ConfirmationResult
  recaptchaVerifier: firebase.auth.RecaptchaVerifier
  authSubscription: Subscription

  public get state(): typeof State {
    return State
  }

  constructor(private window: WindowService, private auth: AngularFireAuth, private toastController: ToastController, private router: Router,) {
    this.pageState = State.IDLE
  }

  ngOnInit() {
    this.authSubscription = this.auth.user.subscribe(user => {
      if (user) this.router.navigate(['/my-reports'])
    })
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe()
    }
  }

  async ionViewWillEnter() {
    this.windowRef = this.window.windowRef
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible'
    })
  }

  handleLoginButton() {
    switch (this.pageState) {
      case State.IDLE: this.getCode(); break;
      case State.CODE: this.verifyCode(); break;
      default: break;
    }
  }

  async getCode() {
    try {
      this.pageState = State.LOADING
      const phoneNumber = `+62${this.phoneNumber}`
      this.firebaseConfirmation = await this.auth.signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier)
      this.pageState = State.CODE
    } catch (e) {
      console.error(e)
      const toast = await this.toastController.create({
        message: "Error occurred. Please check your number and try again",
        duration: 2500
      })
      toast.present()
      this.pageState = State.IDLE
    }
  }

  async verifyCode() {
    try {
      this.pageState = State.VERIFYING
      await this.firebaseConfirmation.confirm(this.code)
      this.router.navigate(['/my-reports'])
    } catch (e) {
      console.error(e)
      const toast = await this.toastController.create({
        message: "Verification failed. Please check the code and try again",
        duration: 2500
      })
      toast.present()
      this.pageState = State.CODE
    }
  }

}
