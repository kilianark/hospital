import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule
import { ConsultationRoutingModule } from './consultation-routing.module'; // Ruta del módulo de rutas
import { ConsultationComponent } from '../../pages/home/components/consultation/consultation.component';
import { AppointmentComponent } from '../../pages/home/components/consultation/appointment/appointment.component';

@NgModule({
  declarations: [
    ConsultationComponent,
    AppointmentComponent, // Declara tus componentes aquí
  ],
  imports: [
    CommonModule, // Importa CommonModule para acceder a las directivas comunes de Angular
    ConsultationRoutingModule, // Asegúrate de importar el módulo de rutas
  ]
})
export class ConsultationModule {}
