import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule
import { ReactiveFormsModule } from '@angular/forms'; // Para formularios reactivos
import { ConsultationRoutingModule } from './consultation-routing.module'; // Ruta del módulo de rutas

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

// Componentes
import { ConsultationComponent } from '../../pages/home/components/consultation/consultation.component';
import { CreateComponent } from '../../pages/home/components/consultation/appointment/create/create.component';
import { ManageComponent } from '../../pages/home/components/consultation/appointment/search/search.component';
import { CalendarComponent } from '../../pages/home/components/consultation/calendar/calendar.component';
import { HasRoleDirective } from '../../directives/has-role.directive';
import { SharedModule } from '../../shared/modules/shared.module';
import{FullCalendarModule} from '@fullcalendar/angular';
import { MyPatientsComponent } from '../../pages/home/components/emergencies/my-patients/my-patients.component';
import { DoctorSelectComponent } from '../../shared/components/doctor-select/doctor-select.component';

@NgModule({
  declarations: [
    ConsultationComponent,
    CreateComponent,
    ManageComponent,
    CalendarComponent,
    MyPatientsComponent
  ],
  imports: [
    CommonModule, // Importa CommonModule para acceder a las directivas comunes de Angular
    ReactiveFormsModule, // Necesario para usar [formGroup] y otras funcionalidades de formularios reactivos
    ConsultationRoutingModule, // Módulo de rutas
    SharedModule,

    // Angular Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    HasRoleDirective,
    FullCalendarModule,
    NgxMaterialTimepickerModule
  ],
})
export class ConsultationModule {}
