export interface PatientInterface{
    codigo: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    telefono: number;
    edad: number;
    birthdate: Date;
    estado: string;
    tipo: string;
    idcama: string; //de momento para acepta "-".
}