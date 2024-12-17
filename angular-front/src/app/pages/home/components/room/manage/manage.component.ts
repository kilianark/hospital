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
import { Observable } from 'rxjs/internal/Observable';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UrgencyArea } from '../../../../../enums/urgency-area.enum';
import { SignalRService } from '../../../../../services/signal-r.service';

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
  UrgencyArea = UrgencyArea;
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private bedService: BedService,
    private roomService: RoomService,
    private signalRService: SignalRService
  ) { }

  ngOnInit() {
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.roomId) {
      this.loadRoomData();

      this.signalRService.listenForUpdates((tableName) => {
        console.log('entra en signalR');
        if(tableName === 'Beds') {
          console.log('Si entra en if de signalR');
          this.loadRoomData();
        }
      });
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

    this.patientService.getPatientData(/* parámetros necesarios */).subscribe(
      (patients: PatientInterface[]) => {
        this.patients = patients;
        this.patientService.setPatients(patients); // Configura la lista de pacientes en el servicio
      },
      (error) => console.error('Error al cargar paciente:', error)
    );

    this.roomService.getRoomData().subscribe(
      (rooms: RoomInterface[]) => this.rooms = rooms.filter(room => room.id !== this.roomId),
      (error) => this.confirm('Error al cargar habitaciones', 'error')
    );
  }

  get isSeatRoom(): boolean {

    return this.room?.area == UrgencyArea.SalaEspera ;
  }

  get dynamicTitle(): string {
    return this.isSeatRoom ? 'Gestión de asientos: Habitación ' : 'Gestión de camas: Habitación ';
  }

  get dynamicCreateButtonLabel(): string {
    return this.isSeatRoom ? 'Crear asiento' : 'Crear cama';
  }
  editBed(bed: BedInterface) {
    this.selectedBed = { ...bed };
    this.isEditModalOpen = true;
  }

  openCreateBedModal() {
    if (this.beds.length >= this.room.capacity) {
      this.confirm(
        this.isSeatRoom
          ? 'No se pueden crear más asientos, se ha alcanzado la capacidad de la habitación.'
          : 'No se pueden crear más camas, se ha alcanzado la capacidad de la habitación.',
        'error'
      );
      return;
    }

    const newCode = this.generateBedCode(this.room.roomNumber, this.beds);
    this.selectedBed = {
      id: 0,
      bedCode: newCode,
      roomId: this.roomId!,
      availability: true
    };
    this.isEditModalOpen = true;
  }




  saveBed() {
    if (this.selectedBed) {
      // Verificar si es una sala de espera (asiento)
      const isSeat = this.isSeatRoom;

      // Verificar si el código ya existe
      const existingBed = (isSeat ? this.beds : this.beds).find(item => item.bedCode === this.selectedBed.bedCode);
      if (existingBed && existingBed.id !== this.selectedBed.id) {
        this.confirm('El código ya existe. Por favor, elija otro.', 'warning');
        return;
      }

      if (this.selectedBed.id === 0) {
        // Crear nuevo asiento o cama
        if (isSeat) {
          this.bedService.postBedData(this.selectedBed).subscribe(
            (newSeat) => {
              this.beds.push(newSeat);  // Añadir asiento a la lista de asientos
              this.isEditModalOpen = false;
              this.selectedBed = null;
              this.confirm('Asiento creado correctamente', 'success');
            },
            (error) => this.confirm('No se puede crear el asiento. Código repetido', 'warning')
          );
        } else {
          this.bedService.postBedData(this.selectedBed).subscribe(
            (newBed) => {
              this.beds.push(newBed);  // Añadir cama a la lista de camas
              this.isEditModalOpen = false;
              this.selectedBed = null;
              this.confirm('Cama creada correctamente', 'success');
            },
            (error) => this.confirm('No se puede crear la cama. Código repetido', 'warning')
          );
        }
      } else {
        // Actualizar cama o asiento
        if (this.selectedBed.roomId !== this.roomId) {
          if (isSeat) {
            this.confirm('No se puede mover el asiento a otra habitación desde aquí.', 'error');
          } else {
            this.confirm('No se puede mover la cama a otra habitación desde aquí.', 'error');
          }
          return;
        }

        if (isSeat) {
          this.bedService.putBedData(this.selectedBed).subscribe(
            () => {
              const index = this.beds.findIndex(s => s.id === this.selectedBed!.id);
              if (index !== -1) this.beds[index] = { ...this.selectedBed };
              this.isEditModalOpen = false;
              this.selectedBed = null;
              this.loadBeds();  // Recargar lista de asientos
              this.confirm('Asiento actualizado correctamente', 'success');
            },
            (error) => this.confirm('Error al actualizar el asiento. Código repetido', 'warning')
          );
        } else {
          this.bedService.putBedData(this.selectedBed).subscribe(
            () => {
              const index = this.beds.findIndex(b => b.id === this.selectedBed!.id);
              if (index !== -1) this.beds[index] = { ...this.selectedBed };
              this.isEditModalOpen = false;
              this.selectedBed = null;
              this.loadBeds();  // Recargar lista de camas
              this.confirm('Cama actualizada correctamente', 'success');
            },
            (error) => this.confirm('Error al actualizar la cama. Código repetido', 'warning')
          );
        }
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
        }, (error) => this.confirm('Error al eliminar la cama, cama asignada', 'error'));
      });
    });
  }



  // Ajustar generateBedCode para aceptar roomNumber y lista de camas
  generateBedCode(roomNumber: number, bedsInDestination: BedInterface[]): string {
    const usedLetters = new Set(bedsInDestination.map(bed => bed.bedCode.slice(-1)));
    let letter = 'A';

    while (usedLetters.has(letter)) {
      letter = String.fromCharCode(letter.charCodeAt(0) + 1);
      if (letter > 'Z') throw new Error('No hay más códigos disponibles');
    }

    return `${roomNumber}${letter}`;
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
    const isSeat = this.isSeatRoom;  // Verificar si es una sala de espera (asiento)
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: isSeat ? 'Eliminar Asiento' : 'Eliminar Cama',
        message: isSeat
          ? `¿Estás seguro de que deseas eliminar el asiento ${bed.bedCode}?`
          : `¿Estás seguro de que deseas eliminar la cama ${bed.bedCode}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Verificar si el asiento o cama tiene un paciente asignado antes de intentar eliminarla
        this.getPatientByBedId(bed.id).subscribe(
          (patient) => {
            if (patient) {
              // Si hay un paciente asignado, mostramos un mensaje de error
              this.confirm(`No se puede eliminar el ${isSeat ? 'asiento' : 'cama'} ${bed.bedCode} porque está asignado a un paciente.`, 'error');
            } else {
              // Si no hay paciente, procedemos con la eliminación
              if (isSeat) {
                // Si es asiento, usamos el servicio para eliminar un asiento
                this.bedService.deleteBed(bed.id).subscribe(
                  () => {
                    this.beds = this.beds.filter(s => s.id !== bed.id);  // Filtramos la lista de asientos
                    this.confirm('Asiento eliminado correctamente', 'success');
                    this.loadBeds();  // Cargar los asientos nuevamente
                  },
                  (error) => {
                    this.confirm('Error al eliminar el asiento. Por favor, inténtelo de nuevo.', 'error');
                    console.error('Error al eliminar el asiento:', error);
                  }
                );
              } else {
                // Si es cama, usamos el servicio para eliminar una cama
                this.bedService.deleteBed(bed.id).subscribe(
                  () => {
                    this.beds = this.beds.filter(b => b.id !== bed.id);  // Filtramos la lista de camas
                    this.confirm('Cama eliminada correctamente', 'success');
                    this.loadBeds();  // Cargar las camas nuevamente
                  },
                  (error) => {
                    this.confirm('Error al eliminar la cama. Por favor, inténtelo de nuevo.', 'error');
                    console.error('Error al eliminar la cama:', error);
                  }
                );
              }
            }
          },
          (error) => {
            this.confirm('Error al verificar asignación de pacientes.', 'error');
            console.error('Error al verificar paciente asignado:', error);
          }
        );
      } else {
        console.log('Eliminación cancelada.');
      }
    });
  }



  getPatientByBedId(bedId: number): Observable<PatientInterface | null> {
    return this.patientService.getPatientByBedId(bedId);
  }
}
