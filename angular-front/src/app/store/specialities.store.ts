import {Speciality} from '../interfaces/speciality.interface';

export var specialities: Speciality[] = [
  // Especialidades de Doctores
  { name: 'Cardiología', workerType: 'doctor', applicableTests: ['ECG', 'ECHO', 'ANGIOGRAPHY', 'HEART_FUNCTION'] },
  { name: 'Neurología', workerType: 'doctor', applicableTests: ['EEG', 'MRI', 'CT_SCAN'] },
  { name: 'Pediatría', workerType: 'doctor', applicableTests: ['PREGNANCY', 'STOOL_TEST', 'URINALYSIS'] },
  { name: 'Oncología', workerType: 'doctor', applicableTests: ['TUMOR_MARKERS', 'LUNG_BIOPSY', 'LIVER_BIOPSY', 'CT_SCAN'] },
  { name: 'Dermatología', workerType: 'doctor', applicableTests: ['SKIN_BIOPSY', 'ALLERGY_TEST'] },
  { name: 'Ginecología', workerType: 'doctor', applicableTests: ['PREGNANCY', 'CERVICAL_CANCER_SCREEN', 'ULTRASOUND', 'CTG'] },
  { name: 'Hematología', workerType: 'doctor', applicableTests: ['HEMOGRAM', 'COAGULATION', 'HBA1C', 'FERRITIN', 'HYPERCOAGULABILITY_TEST'] },
  { name: 'Endocrinología', workerType: 'doctor', applicableTests: ['GLUCOSE', 'THYROID', 'HORMONAL_PROFILE', 'VITAMIN_D', 'VITAMIN_B12'] },
  { name: 'Radiología', workerType: 'doctor', applicableTests: ['CHEST_XRAY', 'CT_SCAN', 'MRI', 'ULTRASOUND', 'MAMMOGRAPHY', 'DOPPLER', 'CAROTID_ULTRASOUND'] },
  { name: 'Gastroenterología', workerType: 'doctor', applicableTests: ['STOMACH_ULTRASOUND', 'COLONOSCOPY', 'LIVER_FUNCTION', 'AMYLASE', 'LIPASE'] },
  { name: 'Neumología', workerType: 'doctor', applicableTests: ['PULMONARY_FUNCTION', 'LUNG_FUNCTION', 'TB_TEST', 'CHEST_XRAY'] },
  { name: 'Genética Médica', workerType: 'doctor', applicableTests: ['HUMAN_GENE_TEST', 'GENETIC_SCREENING', 'CYSTIC_FIBROSIS'] },
  { name: 'Inmunología', workerType: 'doctor', applicableTests: ['ANA', 'NATURAL_KILLER_CELLS', 'HOMOCYSTEINE'] },

  // Especialidades de Enfermeros
  { name: 'Cuidados Intensivos', workerType: 'nurse', applicableTests: ['BLOOD_GAS', 'COAGULATION', 'RENAL_FUNCTION', 'HEART_RATE_MONITOR'] },
  { name: 'Pediatría', workerType: 'nurse', applicableTests: ['VACCINATION', 'STOOL_TEST', 'URINALYSIS'] },
  { name: 'Geriatría', workerType: 'nurse', applicableTests: ['BONE_DENSITOMETRY', 'VITAMIN_D', 'THYROID'] },
  { name: 'Emergencias', workerType: 'nurse', applicableTests: ['BLOOD_GAS', 'HEART_RATE_MONITOR', 'COAGULATION', 'SEPSIS_TEST'] },
  { name: 'Rehabilitación', workerType: 'nurse', applicableTests: ['PHYSIOTHERAPY_ASSESSMENT'] },
  { name: 'Salud Mental', workerType: 'nurse', applicableTests: ['PSYCHIATRIC_EVALUATION'] },
  { name: 'Laboratorio Clínico', workerType: 'nurse', applicableTests: ['HEPATITIS_TEST', 'HIV_TEST', 'BLOOD_CULTURE', 'URINE_CULTURE', 'STREP_TEST', 'RAPID_FLU_TEST'] },
  { name: 'Enfermedades Infecciosas', workerType: 'nurse', applicableTests: ['TB_TEST', 'MALARIAL_TEST', 'ZIKA_TEST', 'CHIKUNGUNYA_TEST', 'SEPSIS_TEST'] },
  { name: 'Nutrición', workerType: 'nurse', applicableTests: ['VITAMIN_D', 'VITAMIN_B12', 'FERRITIN'] }
];

