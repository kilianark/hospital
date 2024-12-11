export interface Speciality {
  name: string;
  workerType: 'doctor' | 'nurse'; // Tipo de trabajador
  applicableTests: string[];     // Códigos de las pruebas diagnósticas
}
