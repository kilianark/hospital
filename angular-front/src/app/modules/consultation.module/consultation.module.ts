import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule
import { ConsultationRoutingModule } from './consultation-routing.module'; // Ruta del módulo de rutas
import { ConsultationComponent } from '../../pages/home/components/consultation/consultation.component';
import { CreateComponent } from '../../pages/home/components/consultation/appointment/create/create.component';
import { ManageComponent } from '../../pages/home/components/consultation/appointment/manage/manage.component';
import { CalendarComponent } from '../../pages/home/components/consultation/calendar/calendar.component';
import { HasRoleDirective } from '../../directives/has-role.directive';

@NgModule({
  declarations: [
    ConsultationComponent,
    CreateComponent,
    ManageComponent,
    CalendarComponent,
  ],
  imports: [
    CommonModule, // Importa CommonModule para acceder a las directivas comunes de Angular
    ConsultationRoutingModule, // Asegúrate de importar el módulo de rutas
    HasRoleDirective
  ]
})
export class ConsultationModule {}
