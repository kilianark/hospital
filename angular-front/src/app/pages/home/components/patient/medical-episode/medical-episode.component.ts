import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../../../services/patient.service';
import { PatientInterface } from '../../../../../interfaces/patient.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../../components/confirm/confirm.component';


@Component({
  selector: 'app-medical-episode',
  templateUrl: './medical-episode.component.html',
  styleUrls: ['./medical-episode.component.css']
})
export class MedicalEpisodeComponent implements OnInit {
  title = 'Enviar a prueba diagnóstica:';
  patientId!: number;
  patient!: PatientInterface;
  testForm: FormGroup;
  testTypes = [
    { value: 'bloodTest', label: 'Prueba de Sangre' },
    { value: 'xRay', label: 'Radiografía' },
    { value: 'ctScan', label: 'Tomografía Computarizada (CT)' },
    { value: 'ultrasound', label: 'Ultrasonido' },
    { value: 'mri', label: 'Resonancia Magnética (MRI)' },
    { value: 'ecg', label: 'Electrocardiograma (ECG)' },
    { value: 'echocardiogram', label: 'Ecocardiograma' },
    { value: 'endoscopy', label: 'Endoscopia' },
    { value: 'biopsy', label: 'Biopsia' },
    { value: 'colonoscopy', label: 'Colonoscopia' },
    { value: 'mammogram', label: 'Mamografía' },
    { value: 'petScan', label: 'Tomografía por Emisión de Positrones (PET)' },
    { value: 'pulmonaryFunctionTest', label: 'Prueba de Función Pulmonar' },
    { value: 'skinTest', label: 'Prueba de Piel (Alérgicas, Tuberculosis)' },
    { value: 'geneticTest', label: 'Prueba Genética' },
    { value: 'urineTest', label: 'Análisis de Orina' },
    { value: 'liverFunctionTest', label: 'Prueba de Función Hepática' },
    { value: 'kidneyFunctionTest', label: 'Prueba de Función Renal' },
    { value: 'hearingTest', label: 'Prueba de Audición' },
    { value: 'visionTest', label: 'Prueba de Visión' },
    { value: 'stoolTest', label: 'Prueba de Heces' },
    { value: 'thyroidFunctionTest', label: 'Prueba de Función Tiroidea' },
    { value: 'hivTest', label: 'Prueba de VIH' },
    { value: 'hepatitisTest', label: 'Prueba de Hepatitis' },
    { value: 'pregnancyTest', label: 'Prueba de Embarazo' },
    { value: 'allergyTest', label: 'Prueba de Alergia' },
    { value: 'pcrTest', label: 'Prueba PCR (Reacción en Cadena de la Polimerasa)' },
    { value: 'tuberculosisTest', label: 'Prueba de Tuberculosis' },
    { value: 'vitaminDTest', label: 'Prueba de Vitamina D' },
    { value: 'cholesterolTest', label: 'Prueba de Colesterol' },
    { value: 'bloodSugarTest', label: 'Prueba de Azúcar en Sangre' },
    { value: 'prostateTest', label: 'Prueba de Próstata (PSA)' },
    { value: 'hba1cTest', label: 'Prueba de HbA1c (Hemoglobina Glicada)' },
    { value: 'eeg', label: 'Electroencefalograma (EEG)' },
    { value: 'sleepStudy', label: 'Estudio del Sueño (Polisomnografía)' },
    { value: 'stressTest', label: 'Prueba de Esfuerzo' },
    { value: 'oralGlucoseToleranceTest', label: 'Prueba de Tolerancia a la Glucosa Oral' },
    { value: 'lactoseIntoleranceTest', label: 'Prueba de Intolerancia a la Lactosa' },
    { value: 'cancerMarkerTest', label: 'Prueba de Marcadores Cancerígenos' },
    { value: 'dnaTest', label: 'Prueba de ADN' },
    { value: 'amniocentesis', label: 'Amniocentesis' },
    { value: 'cordBloodTest', label: 'Prueba de Sangre de Cordón Umbilical' },
    { value: 'boneDensityTest', label: 'Prueba de Densidad Ósea' },
    { value: 'hormoneTest', label: 'Prueba de Hormonas' },
    { value: 'cystoscopy', label: 'Cistoscopia' },
    { value: 'hormonalProfileTest', label: 'Perfil Hormonal' },
    { value: 'liverBiopsy', label: 'Biopsia Hepática' },
    { value: 'urinaryFlowTest', label: 'Prueba de Flujo Urinario' },
    { value: 'sweatTest', label: 'Prueba del Sudor' },
    { value: 'fecalOccultBloodTest', label: 'Prueba de Sangre Oculta en Heces' },
    { value: 'genomicSequencing', label: 'Secuenciación Genómica' },
    { value: 'lipidPanel', label: 'Panel de Lípidos' },
    { value: 'cancerScreening', label: 'Cribado de Cáncer' },
    { value: 'cardiacCT', label: 'Tomografía Computarizada Cardíaca' },
    { value: 'cardiacMRI', label: 'Resonancia Magnética Cardíaca' },
    { value: 'spirometryTest', label: 'Prueba de Espirometría' },
    { value: 'sputumTest', label: 'Prueba de Esputo' },
    { value: 'nasalSwabTest', label: 'Prueba de Hisopo Nasal' },
    { value: 'urinaryProteinTest', label: 'Prueba de Proteínas en Orina' },
    { value: 'autoimmuneTest', label: 'Prueba Autoinmune' },
    { value: 'boneMarrowTest', label: 'Prueba de Médula Ósea' },
    { value: 'parasiticInfectionTest', label: 'Prueba de Infección Parasitarias' },
    { value: 'drugTest', label: 'Prueba de Drogas' },
    { value: 'mentalHealthAssessment', label: 'Evaluación de Salud Mental' },
    { value: 'geneticCarrierScreening', label: 'Cribado de Portadores Genéticos' },
    { value: 'postmortemExam', label: 'Examen Postmortem' },
    { value: 'infectiousDiseaseTest', label: 'Prueba de Enfermedades Infecciosas' },
    { value: 'lymeDiseaseTest', label: 'Prueba de Enfermedad de Lyme' },
    { value: 'zikaVirusTest', label: 'Prueba de Virus Zika' },
    { value: 'malariaTest', label: 'Prueba de Malaria' },
    { value: 'dengueTest', label: 'Prueba de Dengue' },
    { value: 'chronicFatigueSyndromeTest', label: 'Prueba de Síndrome de Fatiga Crónica' },
    { value: 'sickleCellTest', label: 'Prueba de Anemia de Células Falciformes' },
    { value: 'chlamydiaTest', label: 'Prueba de Clamidia' },
    { value: 'gonorrheaTest', label: 'Prueba de Gonorrea' },
    { value: 'hpvTest', label: 'Prueba de VPH (Virus del Papiloma Humano)' },
    { value: 'cysticFibrosisTest', label: 'Prueba de Fibrosis Quística' },
    { value: 'hantavirusTest', label: 'Prueba de Hantavirus' },
    { value: 'brucellosisTest', label: 'Prueba de Brucelosis' },
    { value: 'sepsisTest', label: 'Prueba de Sepsis' },
    { value: 'preoperativeTests', label: 'Pruebas Preoperatorias' },
    { value: 'tshTest', label: 'Prueba de TSH (Hormona Estimulante de la Tiroides)' },
    { value: 'corticosteroidTest', label: 'Prueba de Corticosteroides' },
    { value: 'liverUltrasound', label: 'Ultrasonido Hepático' },
    { value: 'gallbladderUltrasound', label: 'Ultrasonido de Vesícula Biliar' },
    { value: 'transvaginalUltrasound', label: 'Ultrasonido Transvaginal' },
    { value: 'abdominalUltrasound', label: 'Ultrasonido Abdominal' },
    { value: 'renalUltrasound', label: 'Ultrasonido Renal' },
    { value: 'pelvicUltrasound', label: 'Ultrasonido Pélvico' },
    { value: 'thyroidUltrasound', label: 'Ultrasonido Tiroideo' },
    { value: 'laparoscopy', label: 'Laparoscopia' },
    { value: 'cytologyTest', label: 'Citoquímica' },
    { value: 'bloodCultureTest', label: 'Prueba de Cultivo de Sangre' },
    { value: 'chestCT', label: 'Tomografía Computarizada de Tórax' },
    { value: 'coronaryAngiography', label: 'Angiografía Coronaria' },
    { value: 'coronaryCTAngiography', label: 'Angiografía por TC Coronaria' },
    { value: 'fetalHeartMonitor', label: 'Monitor de Corazón Fetal' },
    { value: 'pelvicExamination', label: 'Examen Pélvico' },
    { value: 'testicularExamination', label: 'Examen Testicular' },
    { value: 'urethralSwabTest', label: 'Prueba de Hisopo Uretral' },
    { value: 'hemoglobinTest', label: 'Prueba de Hemoglobina' },
    { value: 'whiteBloodCellCount', label: 'Recuento de Glóbulos Blancos' },
    { value: 'redBloodCellCount', label: 'Recuento de Glóbulos Rojos' },
    { value: 'plateletCount', label: 'Recuento de Plaquetas' },
    { value: 'dnaMethylationTest', label: 'Prueba de Metilación del ADN' },
    { value: 'multigenePanelTest', label: 'Prueba de Panel Multigénico' },
    { value: 'dopplerUltrasound', label: 'Ultrasonido Doppler' },
    { value: 'microbiologyTest', label: 'Prueba Microbiológica' }
  ];


  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.testForm = this.formBuilder.group({
      testType: [''],
      testReason: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.patientId = +params['id'];
      this.patientService.getPatientById(this.patientId).subscribe((data) => {
        this.patient = data;
      });
    });
  }

  onSubmit() {
    const testData = this.testForm.value;
    const testRequest = {
      patientId: this.patient.id,
      testType: testData.testType,
      testReason: testData.testReason
    };


  }

  transferToTests(patient: PatientInterface) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: 'Enviar a pruebas diagnósticas',
        message: `¿Estás seguro de que deseas enviar al paciente ${patient.name} ${patient.surname1} a pruebas diagnósticas?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.testForm.patchValue({ patientId: patient.id });
      }
    });
  }

  confirm(message: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmComponent, {});
    dialogRef.componentInstance.setMessage(message, type);
  }
}
