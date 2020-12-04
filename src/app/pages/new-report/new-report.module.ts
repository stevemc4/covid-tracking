import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx'
import { FirebaseX } from '@ionic-native/firebase-x/ngx'

import { IonicModule } from '@ionic/angular';

import { NewReportPageRoutingModule } from './new-report-routing.module';

import { NewReportPage } from './new-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewReportPageRoutingModule
  ],
  declarations: [NewReportPage],
  providers: [
    ImagePicker,
    FirebaseX
  ]
})
export class NewReportPageModule {}
