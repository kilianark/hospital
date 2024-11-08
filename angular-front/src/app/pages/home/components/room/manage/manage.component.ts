import { Component, OnInit } from '@angular/core';
import { RoomInterface } from '../../../../../interfaces/room.interface';
import { BedInterface } from '../../../../../interfaces/bed.interface';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../../../../services/room.service';
import { BedService } from '../../../../../services/bed.service';
import { PatientService } from '../../../../../services/patient.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent {

    title = 'Gestión de camas: Habitación ';
    roomId: number | null = null;
    room!: RoomInterface;
    beds: BedInterface[] = [];
    patients: PatientInterface[] = [];
    selectedBed: BedInterface | null = null;
    isEditModalOpen: boolean = false;
    rooms: RoomInterface[] = [];

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
            this.confirm('Error al cargar camas', 'error');
            console.error('Error al cargar camas:', error);
          }
        );

        this.patientService.getPatientData(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.roomId).subscribe(
          (patients: PatientInterface[]) => {
            this.patients = patients;
          },
          (error) => {
            console.error('Error al cargar paciente:', error);
          }
        );

        this.roomService.getRoomData().subscribe((rooms: RoomInterface[]) => {
          this.rooms = rooms.filter(room => room.id !== this.roomId);
        },
        (error) => {
          this.confirm('Error al cargar habitaciones', 'error');
          console.error('Error al cargar habitaciones:', error);
        });
      }
    }

    editBed(bed: BedInterface) {
      this.selectedBed = { ...bed };
      this.isEditModalOpen = true;
    }

    openCreateBedModal() {
      // Verificar capacidad
      if (this.beds.length >= this.room.capacity) {
        this.confirm('No se pueden crear más camas, se ha alcanzado la capacidad de la habitación.', 'error');
        return;
      }

      const newBedCode = this.generateBedCode(this.roomId!);
      this.selectedBed = {
        id: 0,
        bedCode: newBedCode,
        roomId: this.roomId!,
        availability: true
      };
      this.isEditModalOpen = true;
    }


    generateBedCode(roomId: number): string {
      const usedLetters = new Set(this.beds.map(bed => bed.bedCode.charAt(bed.bedCode.length - 1)));

      let letter = 'A';

      while (usedLetters.has(letter)) {
        letter = String.fromCharCode(letter.charCodeAt(0) + 1);
      }

      return `${this.room.roomNumber}${letter}`.toUpperCase(); // Asegurarse de que el código sea mayúsculas
    }


    saveBed() {
      if (this.selectedBed) {
        // Obtener el código de cama original
        const originalBedCode = this.beds.find(bed => bed.id === this.selectedBed!.id)?.bedCode;

        if (originalBedCode) {
          // Mantener la parte fija del código (número de habitación) y solo permitir editar la última letra
          const roomCodePart = originalBedCode.slice(0, -1); // Parte fija
          const newLetter = this.selectedBed.bedCode.slice(-1).toUpperCase();

          // Validar que el nuevo carácter sea una letra
          if (!/^[A-Z]$/.test(newLetter)) {
            this.confirm('El código de cama debe terminar en una letra. Por favor, elija otro.', 'warning');
            return;
          }

          // Actualizar el código de cama con la nueva letra y la parte fija
          this.selectedBed.bedCode = `${roomCodePart}${newLetter}`;
        } else {
          // En caso de crear una nueva cama, convertir el código a mayúsculas
          this.selectedBed.bedCode = this.selectedBed.bedCode.toUpperCase();
        }

        const existingBed = this.beds.find(bed => bed.bedCode === this.selectedBed.bedCode);
        if (existingBed && existingBed.id !== this.selectedBed.id) {
          this.confirm('El código de cama ya existe. Por favor, elija otro.', 'warning');
          return;
        }

        if (this.selectedBed.id === 0) {
          // Crear nueva cama
          this.bedService.postBedData(this.selectedBed).subscribe(
            (newBed) => {
              this.beds.push(newBed);
              this.isEditModalOpen = false;
              this.selectedBed = null;
              this.confirm('Cama creada perfectamente', 'success');
            },
            (error) => {
              this.confirm('No se puede crear la cama. Codigo repetido', 'warning');
              console.error('Error al crear la cama:', error);
            }
          );
        } else {
          // Actualizar cama existente
          this.bedService.putBedData(this.selectedBed).subscribe(
            () => {
              const index = this.beds.findIndex(b => b.id === this.selectedBed!.id);
              if (index !== -1) {
                this.beds[index] = { ...this.selectedBed };
              }
              this.confirm('Cama actualizada perfectamente', 'success');
              this.isEditModalOpen = false;
              this.selectedBed = null;
              this.loadBeds();
            },
            (error) => {
              this.confirm('Error al actualizar la cama', 'error');
              console.error('Error al actualizar la cama:', error);
            }
          );
        }
      }
    }




    loadBeds() {
      this.bedService.getBedData(this.roomId!).subscribe(
        (beds: BedInterface[]) => {
          this.beds = beds;
        },
        (error) => {
          this.confirm('Error al cargar camas', 'error');
          console.error('Error al cargar camas:', error);
        }
      );
    }



    confirm(message: string, type: string) {
      const dialogRef = this.dialog.open(ConfirmComponent, {});
      dialogRef.componentInstance.setMessage(message, type);
    }

    cancelEdit() {
      this.isEditModalOpen = false;
      this.selectedBed = null;
    }

    deleteBed(bed: BedInterface) {
      const patient = this.getPatientByBedId(bed.id);
      if (!patient) {

          this.bedService.deleteBed(bed.id).subscribe(() => {
            this.beds = this.beds.filter((b) => b.id !== bed.id);
            this.confirm('Cama eliminada perfectamente', 'success');
          });

      }
    }

    getPatientByBedId(bedId: number): PatientInterface | null {
      return this.patients.find((patient) => patient.bedId === bedId) || null;
    }


}
