import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { WorkerComponent } from '../../worker/worker.component';
import { WorkerInterface } from '../../../../../interfaces/worker.interface';
import { OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  title="Calendario"
  doctorID : number;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: [
    ]
  };
  constructor(
    private readonly keycloak: KeycloakService
) {}
  ngOnInit(): void {
       this.keycloak.loadUserProfile().then((profile) => {
      this.doctorID = profile.attributes['doctorID'][0];
      })
    this.loadDates();
  }
  loadDates(){
  
    
  }

}
