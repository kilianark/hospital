import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { countries } from '../../store/country-data.store';
import { Country } from '../../interfaces/country.interface';
import { PatientInterface } from '../../interfaces/patient.interface';
import { PatientService } from '../../services/patient.service';

import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css'],
})
export class RecordComponent implements OnInit {
  isEditable: boolean = false;
  public countries: Country[] = countries;
  patientForm: FormGroup;
  public patientSurname: string = 'Hola';
  patientResp!: PatientInterface;

  patient: PatientInterface[] = [];

  camps: string[] = [
    'dni',
    'cip',
    'name',
    'birth',
    'surname1',
    'surname2',
    'phone',
    'email',
    'country',
    'emergencyContact',
    'gender',
    'address',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private formBuilder: FormBuilder,
    private patientService: PatientService
  ) {
    this.patientForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname1: ['', [Validators.required]],
      surname2: [''],
      gender: ['', [Validators.required]],
      birth: ['', [Validators.required]],
      country: ['', [Validators.required]],
      address: [''],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      cip: ['', [Validators.pattern(/^[A-Z]{4} \d{8}$/)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],

      patientCode: [''],
      emergencyContact: ['', [Validators.pattern(/^\d{9}$/)]],
    });

    this.patientForm.get('patientCode')?.disable();
    for (const value of this.camps) {
      this.patientForm.get(value)?.disable();
    }

    this.patientService.getPatientData(data).subscribe((data) => {
      this.patient = data.map((patient) => ({
        ...patient,
        birthDate: new Date(patient.birthDate),
      }));

      this.patientForm.patchValue({
        name: this.patient[0].name,
        surname1: this.patient[0].surname1,
        surname2: this.patient[0].surname2,
        gender: this.patient[0].gender,
        birth: this.patient[0].birthDate.toISOString().split('T')[0],
        country: this.patient[0].country,
        address: this.patient[0].address,
        dni: this.patient[0].dni,
        cip: this.patient[0].cip,
        email: this.patient[0].email,
        phone: this.patient[0].phone,

        patientCode: this.patient[0].patientCode,
        emergencyContact: this.patient[0].emergencyContact,
      });

      this.patientForm.get('name')?.valueChanges.subscribe((value) => {
        this.patient[0].name = value;
      });
      this.patientForm.get('surname1')?.valueChanges.subscribe((value) => {
        this.patient[0].surname1 = value;
      });
      this.patientForm.get('surname2')?.valueChanges.subscribe((value) => {
        this.patient[0].surname2 = value;
      });
      this.patientForm.get('gender')?.valueChanges.subscribe((value) => {
        this.patientForm.get('gender')?.value;
      });
      this.patientForm.get('birth')?.valueChanges.subscribe((value) => {
        this.patient[0].birthDate = value;
      });
      this.patientForm.get('country')?.valueChanges.subscribe((value) => {
        this.patient[0].country = value;
      });
      this.patientForm.get('address')?.valueChanges.subscribe((value) => {
        this.patient[0].address = value;
      });
      this.patientForm.get('dni')?.valueChanges.subscribe((value) => {
        this.patient[0].dni = value;
      });
      this.patientForm.get('cip')?.valueChanges.subscribe((value) => {
        this.patient[0].cip = value;
      });
      this.patientForm.get('email')?.valueChanges.subscribe((value) => {
        this.patient[0].email = value;
      });
      this.patientForm.get('phone')?.valueChanges.subscribe((value) => {
        this.patient[0].phone = value;
      });
      this.patientForm
        .get('emergencyContact')
        ?.valueChanges.subscribe((value) => {
          this.patient[0].emergencyContact = value;
        });
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.patientService.putPatientData(this.patient[0]).subscribe((data) => {
      this.patientResp = data;
    });
    this.togleIsEditable();
  }

  togleIsEditable() {
    this.isEditable = !this.isEditable;

    if (this.isEditable) {
      for (const value of this.camps) {
        this.patientForm.get(value)?.enable();
      }
    } else {
      for (const value of this.camps) {
        this.patientForm.get(value)?.disable();
      }
      console.log(this.patient[0]);
    }
  }

  generatePDF() {
    const doc = new jsPDF();
    let currentLine = 65;
    const lineSpacing = 10;
    const maxLineWidth = 180;
    const sectionSeparation = 20;

    function formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }

    //para esta función he tenido que modificar tsconfig.json:
    function addSection(title, content, currentCol, drawLine = false) {
      doc.setFont('helvetica', 'bold');
      doc.text(title, 16, currentCol);

      doc.setFont('helvetica', 'normal');
      const line = doc.splitTextToSize(content, maxLineWidth);
      doc.text(line, 16, currentCol + lineSpacing);

      const lineHeight = line.length * lineSpacing;

      if (drawLine) {
        const linePosition = currentCol + lineHeight + 2;
        doc.setLineWidth(0.5);
        doc.setDrawColor(0);
        doc.line(16, linePosition, 190, linePosition);

        return linePosition;
      }

      return currentCol + sectionSeparation;
    }

    //Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Historia Clínica', 105, 20, { align: 'center' });

    //Rectángulo
    doc.setFontSize(12);
    doc.setLineWidth(0.5);
    doc.rect(10, 30, 190, 28);

    //Nombre completo:
    const surname1 = this.patientForm.get('surname1')?.value || '';
    const surname2 = this.patientForm.get('surname2')?.value || '';
    const name = this.patientForm.get('name')?.value || '';

    doc.setFont('helvetica', 'bold');
    doc.text(`Nombre completo: `, 16, 35);
    doc.setFont('helvetica', 'normal');

    let startPosition = 65;

    doc.text(surname1, startPosition, 35);
    const surname1Width = doc.getTextWidth(surname1);
    startPosition += surname1Width + 2;

    doc.text(surname2 + ',', startPosition, 35);
    const surname2Width = doc.getTextWidth(surname2);
    startPosition += surname2Width + 2;

    doc.text(name, startPosition, 35);

    //Datos varios:
    doc.setFont('helvetica', 'bold');
    doc.text(`Código paciente: `, 140, 35);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.patientForm.get('patientCode')?.value}`, 180, 35);

    doc.setFont('helvetica', 'bold');
    doc.text(`Fecha de nacimiento: `, 16, 40);
    doc.setFont('helvetica', 'normal');
    const birthDate = this.patientForm.get('birth')?.value;
    doc.text(formatDate(birthDate), 65, 40);

    doc.setFont('helvetica', 'bold');
    doc.text(`Sexo: `, 16, 45);
    doc.setFont('helvetica', 'normal');
    if (this.patientForm.get('gender')?.value == 'male') {
      doc.text(`Hombre`, 65, 45);
    } else {
      doc.text(`Mujer`, 65, 45);
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`Dirección: `, 16, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.patientForm.get('address')?.value}`, 65, 50);

    doc.setFont('helvetica', 'bold');
    doc.text(`CIP: `, 140, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.patientForm.get('cip')?.value}`, 155, 50);

    doc.setFont('helvetica', 'bold');
    doc.text(`Teléfono: `, 16, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.patientForm.get('phone')?.value}`, 65, 55);

    doc.setFont('helvetica', 'bold');
    doc.text(`C. Emergencia: `, 117.5, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.patientForm.get('emergencyContact')?.value}`, 155, 55);

    //cuando tengamos guardada la info sustituir el 'blabla' por un get.
    //Historial
    currentLine = addSection(
      'Antecedentes médicos:',
      'Varicela a los 10 años. Neumonía a los 20 años, tratada adecuadamente sin secuelas. Episodios de gastritis, tratados con medicamentos antiácidos, sin complicaciones ni hospitalizaciones.',
      currentLine + lineSpacing
    );

    currentLine = addSection(
      'Alergias:',
      'Sin alergias medicamentosas o ambientales relevantes.',
      currentLine + lineSpacing,
      true
    );

    currentLine = addSection(
      'Motivo de consulta:',
      'El paciente acude a consulta refiriendo síntomas de tos seca persistente y fatiga desde hace aproximadamente dos semanas. No presenta fiebre ni dificultad respiratoria. La tos se ha intensificado por la noche, afectando su calidad de sueño.',
      currentLine + lineSpacing
    );

    currentLine = addSection(
      'Diagnóstico:',
      'Tos seca idiopática: La tos seca puede ser idiopática, especialmente si no se identifican otros síntomas asociados. Podría estar relacionada con irritantes ambientales o sequedad del aire.',
      currentLine + lineSpacing
    );

    currentLine = addSection(
      'Plan terapéutico:',
      'Augmentine 875/125mg 1 cada 8h durante 10 días. Paracetamol 1 gramo cada 8 horas si dolor. Dexketoprofeno 25mg: 1 comprimido cada 8 horas si persistencia de dolor. Alternar con Paracetamol. Dacortin 30mg en pauta descendente: 2 pastillas x 3 días, 1 pastilla x 2 días, 1/2 pastilla x 1 día',
      currentLine + lineSpacing
    );

    doc.output('dataurlnewwindow');
  }
}
