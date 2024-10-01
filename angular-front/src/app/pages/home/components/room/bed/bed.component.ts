import { Component, OnInit } from '@angular/core';
import { RoomInterface } from '../../../interfaces/room.interface';
import { BedInterface } from '../../../../../interfaces/bed.interface';
import { ActivatedRoute } from '@angular/router';
import { BedService } from '../../../../../services/bed.service';

@Component({
  selector: 'app-bed',
  templateUrl: './bed.component.html',
  styleUrl: './bed.component.css'
})
export class BedComponent implements OnInit {
  title = 'Gestión de camas: Habitación ';
  roomId: number | null = null;  
  room: RoomInterface | null = null;  
  beds: BedInterface[] = [];  

  constructor(private route: ActivatedRoute, private bedService: BedService) {}

  ngOnInit() {
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));
  
    if (this.roomId) {
      console.log('ID de la habitación:', this.roomId);
  
      // Cargar las camas usando el servicio
      this.bedService.getBedData(this.roomId).subscribe(
        (beds: BedInterface[]) => {
          this.beds = beds;
          console.log('Camas obtenidas:', this.beds);
        },
        error => {
          console.error('Error al cargar camas:', error);
        }
      );
    }
  }}