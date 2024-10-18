import { Component } from '@angular/core';
import { RoomService } from '../../../../../services/room.service';
import { RoomInterface } from '../../../../../interfaces/room.interface';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HospitalZone } from '../../../../../enums/hospital-zones.enum';
import { TranslateService } from '@ngx-translate/core';
import { AmbulatoryArea } from '../../../../../enums/ambulatory-area.enum';
import { HospitalizedArea } from '../../../../../enums/hospitalized-area.enum';
import { UrgencyArea } from '../../../../../enums/urgency-area.enum';
import { OperatingRoomArea } from '../../../../../enums/operatingRoom-area.enum';

@Component({
	selector: 'app-search-room',
	templateUrl: './search.component.html',
	styleUrl: './search.component.css',
})
export class SearchRoomComponent {
	title = 'Búsqueda Habitaciones:';
	rooms: RoomInterface[] = [];
	roomForm: FormGroup;
	isVisible: boolean = false;

	HospitalZone = HospitalZone;

	showSelect: boolean;

	hospitalZones = Object.keys(HospitalZone)
    	.filter((key) => !isNaN(Number(HospitalZone[key as keyof typeof HospitalZone])))
    	.map((key) => ({ value: HospitalZone[key as keyof typeof HospitalZone] }));
  	//
	ambulatoryArea = Object.keys(AmbulatoryArea)
		.filter((key) => !isNaN(Number(AmbulatoryArea[key as keyof typeof AmbulatoryArea])))
		.map((key) => ({ value: AmbulatoryArea[key as keyof typeof AmbulatoryArea] }));
	//
	hospitalizedArea = Object.keys(HospitalizedArea)
		.filter((key) => !isNaN(Number(HospitalizedArea[key as keyof typeof HospitalizedArea])))
		.map((key) => ({ value: HospitalizedArea[key as keyof typeof HospitalizedArea] }));
	//
	operatingRoomArea = Object.keys(OperatingRoomArea)
		.filter((key) => !isNaN(Number(OperatingRoomArea[key as keyof typeof OperatingRoomArea])))
		.map((key) => ({ value: OperatingRoomArea[key as keyof typeof OperatingRoomArea] }));
	//
	urgencyArea = Object.keys(UrgencyArea)
		.filter((key) => !isNaN(Number(UrgencyArea[key as keyof typeof UrgencyArea])))
		.map((key) => ({ value: UrgencyArea[key as keyof typeof UrgencyArea] }));
	//

	actualZone: HospitalZone;

  	selectedZone: AmbulatoryArea | HospitalizedArea | UrgencyArea | OperatingRoomArea | null = null;

  	currentArea;
  	currentAreaType: string;


  	constructor( private router: Router, private formBuilder: FormBuilder, private roomService: RoomService, private translator: TranslateService) {

		this.translator.use('es');

		setTimeout(() => {
		this.showSelect = true;
		}, 1);

		this.roomForm = this.formBuilder.group({
      		roomNumber: [''],
			floor: [''],
			zone: [''],
			area: [''],
			capacity: [''],
			availability: [''],
    	});
  	}

	onZoneChange(zone: HospitalZone) {
		this.actualZone = zone;
		this.selectedZone = null;
	
		if (zone != HospitalZone.Inactivo) this.updateArea();
	}

	updateArea() {
		if (this.actualZone == HospitalZone.Ambulatorio) {
		  this.currentArea = this.ambulatoryArea;
		  this.currentAreaType = 'AMBULATORY_AREA';
		} else if (this.actualZone == HospitalZone.Hospitalizacion) {
		  this.currentArea = this.hospitalizedArea;
		  this.currentAreaType = 'HOSPITALIZED_AREA';
		} else if (this.actualZone == HospitalZone.Urgencias) {
		  this.currentArea = this.urgencyArea;
		  this.currentAreaType = 'URGENCY_AREA';
		} else if (this.actualZone == HospitalZone.Quirofano) {
		  this.currentArea = this.operatingRoomArea;
		  this.currentAreaType = 'OPERATING_AREA';
		}
	  }

	onSubmit() {
		const searchFilters = this.roomForm.value;

		const roomNumber = searchFilters.roomNumber ? parseInt(searchFilters.roomNumber) : null;

		const floor = searchFilters.floor ? parseInt(searchFilters.floor) : null;

		const capacity = searchFilters.capacity ? parseInt(searchFilters.capacity) : null;

		const availability = searchFilters.availability !== null ? searchFilters.availability : null;

		this.roomService
		.searchRooms(
			roomNumber,
			floor,
			searchFilters.area,
			searchFilters.zone,
			capacity,
			availability
		)
		.subscribe(
			(rooms: RoomInterface[]) => {
			this.rooms = rooms;
			this.isVisible = true;
			},
			(error) => {
			console.error('Error al buscar habitaciones:', error);
			}
		);
	}

	goToRooms(roomId: number) {
		if (roomId !== undefined) {
			this.router.navigate(['/home/room/beds', roomId]);
		} else {
			console.log(this.rooms[0]);
			console.log('No hay camas asignadas a esta habitación.');
		}
	}

	toggleDisplay() {
		this.isVisible = true;
	}
}
