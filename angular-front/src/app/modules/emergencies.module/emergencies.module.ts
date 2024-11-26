import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmergenciesRoutingModule } from './emergencies-routing.module';

import { EmergenciesComponent } from '../../pages/home/components/emergencies/emergencies.component';
import { PoolPatientsComponent } from '../../pages/home/components/emergencies/pool-patients/pool-patients.component';


@NgModule({
  declarations: [
    EmergenciesComponent,
    PoolPatientsComponent
  ],
  imports: [
    CommonModule,
    EmergenciesRoutingModule
  ]
})
export class EmergenciesModule { }
