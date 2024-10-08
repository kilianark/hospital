import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';

import { PatientStatus } from '../../../../../enums/patient-status.enum';
import { HospitalizedArea } from '../../../../../enums/hospitalized-area.enum';
import { AmbulatoryArea } from '../../../../../enums/ambulatory-area.enum';
import { UrgencyArea } from '../../../../../enums/urgency-area.enum';
import { OperatingRoomArea } from '../../../../../enums/operatingRoom-area.enum';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { PatientService } from '../../../../../services/patient.service';
import { TranslateService } from '@ngx-translate/core';
//import { SearchRoomComponent } from '../../room/search/search.component'; // us del component de llista dhabitacions o no?

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: ['./manage.component.css']
})
export class ManagePatientComponent implements OnInit {
	title = 'Gestionar Estado:'
	patientId!: number ;
	patient!: PatientInterface;
	statusForm: FormGroup;

	PatientStatus = PatientStatus;
	AmbulatoryArea = AmbulatoryArea;
	HospitalizedArea = HospitalizedArea;
	UrgencyArea = UrgencyArea;
	OperatingRoomArea = OperatingRoomArea;

	selectedAmbulatory: AmbulatoryArea | null = null;
	selectedHospitalized: HospitalizedArea | null = null;
	selectedUrgency: UrgencyArea | null = null;
	selectedOperatingRoom: OperatingRoomArea | null = null;


	showSelectRoom: boolean = false;
	showRoomList: boolean = false;
	showAreaA: boolean = false;
	showAreaH: boolean = false;
	showAreaU: boolean = false;
	showAreaO: boolean = false;


	patientStatus = Object.keys(PatientStatus)
		.filter(key => !isNaN(Number(PatientStatus[key as keyof typeof PatientStatus])))
		.map(key => ({value: PatientStatus[key as keyof typeof PatientStatus] }));
	//
	ambulatoryArea = Object.keys(AmbulatoryArea)
		.filter(key => !isNaN(Number(AmbulatoryArea[key as keyof typeof AmbulatoryArea])))
		.map(key => ({value: AmbulatoryArea[key as keyof typeof AmbulatoryArea] }));
	//
	hospitalizedArea = Object.keys(HospitalizedArea)
		.filter(key => !isNaN(Number(HospitalizedArea[key as keyof typeof HospitalizedArea])))
		.map(key => ({value: HospitalizedArea[key as keyof typeof HospitalizedArea] }));
	//
	urgencyArea = Object.keys(UrgencyArea)
		.filter(key => !isNaN(Number(UrgencyArea[key as keyof typeof UrgencyArea])))
		.map(key => ({value: UrgencyArea[key as keyof typeof UrgencyArea] }));
	//
	operatingRoomArea = Object.keys(OperatingRoomArea)
		.filter(key => !isNaN(Number(OperatingRoomArea[key as keyof typeof OperatingRoomArea])))
		.map(key => ({value: OperatingRoomArea[key as keyof typeof OperatingRoomArea] }));


	constructor(private route: ActivatedRoute, private patientService: PatientService, private router: Router, public dialog: MatDialog, private formBuilder: FormBuilder, private translate: TranslateService) {
		
		this.translate.use('es');
		
		this.statusForm = this.formBuilder.group({
			status: ['']
		});

		this.route.params.subscribe(params => {
			this.patientId = +params['id'];
			this.patientService.getPatientById(this.patientId).subscribe(data =>{
				this.patient = data;
			
				this.statusForm.patchValue({
					status: this.patient.status
				});
				if (this.patient.status != PatientStatus.Inactivo) {
					this.showSelectRoom = true;
					this.showRoomList = true;
					if (this.patient.status == PatientStatus.Ambulatorio) this.showAreaA = true;
					if (this.patient.status == PatientStatus.Urgencias) this.showAreaU = true;
					if (this.patient.status == PatientStatus.Quirofano) this.showAreaO = true;
					if (this.patient.status == PatientStatus.Hospitalizado) this.showAreaH = true;
					
				}
			})
		});
	}

	ngOnInit(): void {
	}

	onStatusChange(status: PatientStatus) {
		this.patient.status = status;

		if (status != PatientStatus.Inactivo ) {
			this.showSelectRoom = true;
			if (status == PatientStatus.Ambulatorio) {
				this.showAreaA = true;
				this.showAreaH = false;
				this.showAreaU = false;
				this.showAreaO = false;
			} else if (status == PatientStatus.Hospitalizado) {
				this.showAreaA = false;
				this.showAreaH = true;
				this.showAreaU = false;
				this.showAreaO = false;
			} else if (status == PatientStatus.Urgencias) {
				this.showAreaA = false;
				this.showAreaH = false;
				this.showAreaU = true;
				this.showAreaO = false;
			} else if (status == PatientStatus.Quirofano) {
				this.showAreaA = false;
				this.showAreaH = false;
				this.showAreaU = false;
				this.showAreaO = true;
			}
		} else this.showSelectRoom = false;	
	}

	onAreaChangeA(area: AmbulatoryArea) {
		this.selectedAmbulatory = area;
		console.log('Area Seleccionada: ', area);
	}

	onAreaChangeH(area: HospitalizedArea) {
		this.selectedHospitalized = area;
		console.log('Area Seleccionada: ', area);
	}

	onAreaChangeU(area: UrgencyArea) {
		this.selectedUrgency = area;
		console.log('Area Seleccionada: ', area);
	}

	onAreaChangeO(area: OperatingRoomArea) {
		this.selectedOperatingRoom = area;
		console.log('Area Seleccionada: ', area);
	}


	showDropDown() {
		this.showRoomList = !this.showRoomList;
	}

	
	onSubmit() {
		this.patientService.putPatientData(this.patient).subscribe(data => {
		});

		console.log('Estat Actualitzat:');
		this.confirm();
		this.router.navigate(['/home']);
	}

	confirm() {
		let dialogRef = this.dialog.open(ConfirmComponent, {});
		dialogRef.componentInstance.setMessage("Estado Actualizado");
	}
}