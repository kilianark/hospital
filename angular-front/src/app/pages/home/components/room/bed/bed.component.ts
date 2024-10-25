import { Component, OnInit } from '@angular/core';
import { RoomInterface } from '../../../../../interfaces/room.interface';
import { BedInterface } from '../../../../../interfaces/bed.interface';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../../../../services/room.service';
import { BedService } from '../../../../../services/bed.service';
import { PatientService } from '../../../../../services/patient.service';

import { MatDialog } from '@angular/material/dialog';
import { RecordComponent } from '../../../../../components/recordpatient/record.component';

@Component({
  selector: 'app-bed',
  templateUrl: './bed.component.html',
  styleUrl: './bed.component.css',
})
export class BedComponent implements OnInit {
  title = 'Gestión de camas: Habitación ';
  roomId: number | null = null;
  room!: RoomInterface;
  beds: BedInterface[] = [];
  bedId!: number;
  patients: PatientInterface[] = [];
  patient!: PatientInterface;

  selectedBed: BedInterface | null = null; // Para la cama seleccionada
  isEditModalOpen: boolean = false; // Para controlar la apertura del modal

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private bedService: BedService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.roomId) {
      this.roomService.getRoomById(this.roomId).subscribe((data) => {
        this.room = data;
      });

      this.bedService.getBedData(this.roomId).subscribe(
        (beds: BedInterface[]) => {
          this.beds = beds;
        },
        (error) => {
          console.error('Error al cargar camas:', error);
        }
      );

      this.patientService
        .getPatientData(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.bedId)
        .subscribe(
          (patients: PatientInterface[]) => {
            this.patients = patients;
          },
          (error) => {
            console.error('Error al cargar paciente:', error);
          }
        );
    }
  }

  // Devuelve el paciente asignado a una cama o null si no hay paciente
  getPatientByBedId(bedId: number): PatientInterface | null {
    return this.patients.find((patient) => patient.bedId === bedId) || null;
  }

  // Abrir el formulario de edición
  editBed(bed: BedInterface) {
    this.selectedBed = { ...bed }; // Clonamos el objeto cama para editarlo sin afectar el original
    this.isEditModalOpen = true; // Abrimos el modal de edición
  }

  // Abrir el formulario de creación de cama
  openCreateBedModal() {
    this.selectedBed = {
      id: 0, // Esto indica que estamos creando una nueva cama
      bedCode: '',
      roomId: this.roomId!,
      availability: true // O cualquier valor predeterminado que desees
    };
    this.isEditModalOpen = true;
  }

  // Guardar cambios o crear nueva cama
  saveBed() {
    if (this.selectedBed) {
      if (this.selectedBed.id === 0) {
        // Crear nueva cama
        this.bedService.postBedData(this.selectedBed).subscribe(
          (newBed) => {
            this.beds.push(newBed); // Agregamos la nueva cama a la lista
            this.isEditModalOpen = false; // Cerramos el modal
            this.selectedBed = null; // Limpiamos la cama seleccionada
          },
          (error) => {
            console.error('Error al crear la cama:', error);
          }
        );
      } else {
        // Actualizar cama existente
        const index = this.beds.findIndex(b => b.id === this.selectedBed!.id);
        if (index !== -1) {
          this.beds[index] = { ...this.selectedBed }; // Actualizamos la cama en la lista
        }
        this.isEditModalOpen = false; // Cerramos el modal
        this.selectedBed = null; // Limpiamos la cama seleccionada
      }
    }
  }

  // Cancelar la edición o creación
  cancelEdit() {
    this.isEditModalOpen = false; // Cierra el modal sin guardar cambios
    this.selectedBed = null; // Limpiamos la cama seleccionada
  }

  // Eliminar una cama
  deleteBed(bed: BedInterface) {
    const patient = this.getPatientByBedId(bed.id);
    if (!patient) {
      if (confirm('¿Estás seguro de que deseas eliminar esta cama?')) {
        this.bedService.deleteBed(bed.id).subscribe(() => {
          this.beds = this.beds.filter((b) => b.id !== bed.id); // Actualiza la lista de camas
        });
      }
    }
  }
}
