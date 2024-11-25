import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmergenciesRoutingModule } from './emergencies-routing.module';

import { EmergenciesComponent } from '../../pages/home/components/emergencies/emergencies.component';


@NgModule({
  declarations: [
    EmergenciesComponent
  ],
  imports: [
    CommonModule,
    EmergenciesRoutingModule
  ]
})
export class EmergenciesModule { }
