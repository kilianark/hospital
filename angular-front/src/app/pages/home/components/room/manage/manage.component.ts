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
export class ManageComponent implements OnInit {
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
        this.loadRoomData();
      }
    }

    loadRoomData() {
      this.roomService.getRoomById(this.roomId!).subscribe((data) => {
        this.room = data;
      });

      this.bedService.getBedData(this.roomId!).subscribe(
        (beds: BedInterface[]) => this.beds = beds,
        (error) => this.confirm('Error al cargar camas', 'error')
      );

      this.patientService.getPatientData(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.roomId).subscribe(
        (patients: PatientInterface[]) => this.patients = patients,
        (error) => console.error('Error al cargar paciente:', error)
      );

      this.roomService.getRoomData().subscribe(
        (rooms: RoomInterface[]) => this.rooms = rooms.filter(room => room.id !== this.roomId),
        (error) => this.confirm('Error al cargar habitaciones', 'error')
      );
    }

    editBed(bed: BedInterface) {
      this.selectedBed = { ...bed };
      this.isEditModalOpen = true;
    }

    openCreateBedModal() {
      if (this.beds.length >= this.room.capacity) {
        this.confirm('No se pueden crear más camas, se ha alcanzado la capacidad de la habitación.', 'error');
        return;
      }
      // Generar un código único basado en el número de habitación actual y las camas actuales
      const newBedCode = this.generateBedCode(this.room.roomNumber, this.beds);
      this.selectedBed = { id: 0, bedCode: newBedCode, roomId: this.roomId!, availability: true };
      this.isEditModalOpen = true;
    }



    saveBed() {
      if (this.selectedBed) {


        const existingBed = this.beds.find(bed => bed.bedCode === this.selectedBed.bedCode);
        if (existingBed && existingBed.id !== this.selectedBed.id) {
          this.confirm('El código de cama ya existe. Por favor, elija otro.', 'warning');
          return;
        }

        if (this.selectedBed.id === 0) {
          this.bedService.postBedData(this.selectedBed).subscribe(
            (newBed) => {
              this.beds.push(newBed);
              this.isEditModalOpen = false;
              this.selectedBed = null;
              this.confirm('Cama creada correctamente', 'success');
            },
            (error) => this.confirm('No se puede crear la cama. Código repetido', 'warning')
          );
        } else {
          this.bedService.putBedData(this.selectedBed).subscribe(
            () => {
              const index = this.beds.findIndex(b => b.id === this.selectedBed!.id);
              if (index !== -1) this.beds[index] = { ...this.selectedBed };
              this.isEditModalOpen = false;
              this.selectedBed = null;
              this.loadBeds();
              this.confirm('Cama actualizada correctamente', 'success');
            },
            (error) => this.confirm('Código repetido', 'warning')
          );
        }
      }
    }

    moveBed(destinationRoomId: number) {
      if (!this.selectedBed) {
        this.confirm('No se ha seleccionado ninguna cama para mover.', 'error');
        return;
      }

      if (!destinationRoomId) {
        this.confirm('Debe seleccionar una habitación de destino para mover la cama.', 'error');
        return;
      }

      // Cargar la habitación de destino para verificar su capacidad
      this.roomService.getRoomById(destinationRoomId).subscribe((destinationRoom) => {
        this.bedService.getBedData(destinationRoomId).subscribe((destinationBeds) => {

          // Comprobar si la habitación de destino está llena
          if (destinationBeds.length >= destinationRoom.capacity) {
            this.confirm('No se pueden mover más camas a esta habitación, se ha alcanzado su capacidad máxima.', 'error');
            return;
          }

          // Generar un nuevo código de cama para la habitación destino
          const newBedCode = this.generateBedCode(destinationRoom.roomNumber, destinationBeds);

          // Eliminar la cama de la habitación actual
          this.bedService.deleteBed(this.selectedBed!.id).subscribe(() => {
            // Crear la cama en la habitación de destino con un nuevo código
            const newBed: BedInterface = {
              ...this.selectedBed!,
              roomId: destinationRoomId,
              bedCode: newBedCode
            };

            this.bedService.postBedData(newBed).subscribe(
              (createdBed) => {

                this.beds = this.beds.filter(b => b.id !== this.selectedBed!.id);
                destinationBeds.push(createdBed);
                this.isEditModalOpen = false;
                this.selectedBed = null;
                this.confirm('Cama movida correctamente', 'success');
                this.loadBeds();
              },
              (error) => this.confirm('Error al mover la cama', 'error')
            );
          }, (error) => this.confirm('Error al eliminar la cama', 'error'));
        });
      });
    }



    // Ajustar generateBedCode para aceptar roomNumber y lista de camas
    generateBedCode(roomNumber: number, bedsInDestination: BedInterface[]): string {
      const usedLetters = new Set(bedsInDestination.map(bed => bed.bedCode.slice(-1)));
      let letter = 'A';

      // Buscar la primera letra disponible
      while (usedLetters.has(letter)) {
        letter = String.fromCharCode(letter.charCodeAt(0) + 1);
      }

      return `${roomNumber}${letter}`.toUpperCase(); 
    }



    loadBeds() {
      this.bedService.getBedData(this.roomId!).subscribe(
        (beds: BedInterface[]) => this.beds = beds,
        (error) => this.confirm('Error al cargar camas', 'error')
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
          this.beds = this.beds.filter(b => b.id !== bed.id);
          this.confirm('Cama eliminada correctamente', 'success');
        });
      }
    }

    getPatientByBedId(bedId: number): PatientInterface | null {
      return this.patients.find(patient => patient.bedId === bedId) || null;
    }
}
