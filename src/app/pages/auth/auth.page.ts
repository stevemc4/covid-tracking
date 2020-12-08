import { Component, OnInit } from '@angular/core';
import firebase from 'firebase'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore} from '@angular/fire/firestore'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth, private router: Router) { }

  authSubscription: Subscription

  ngOnInit() {
    this.authSubscription = this.auth.user.subscribe(user => {
      if (user) this.handleUserRedirection(user)
      else this.router.navigate(['/login', { replaceUrl: true }])
    })
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe()
  }

  async handleUserRedirection(user: firebase.User) {
    const userData = this.firestore.collection('users').doc(user.uid).get().subscribe(data => {
      const content: any = data.data()
      userData.unsubscribe()
      if (content.role === 'ADMIN')
        this.router.navigate(['/admin'], { replaceUrl: true })
      else
        this.router.navigate(['/my-reports'], { replaceUrl: true })
    })
  }

}
