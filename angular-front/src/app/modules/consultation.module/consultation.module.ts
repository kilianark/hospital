import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/modules/shared.module';
import { ConsultationRoutingModule } from './consultation-routing.module';
import { SelectZoneComponent } from "../../shared/components/select-zone/select-zone.component";
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConsultationRoutingModule,
    SharedModule,
    SelectZoneComponent
],
  providers: [provideHttpClient()],
})
export class ConsultationModule { }
