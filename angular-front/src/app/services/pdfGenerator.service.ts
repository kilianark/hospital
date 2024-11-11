import { Injectable } from "@angular/core";
import jsPDF from 'jspdf';
import { HospitalService } from "./hospital.service";
import { HospitalInterface } from "../interfaces/hospital.interface";
import { lastValueFrom } from "rxjs";
@Injectable({
    providedIn: 'root',
})
export class pdfGeneratorService {

    constructor(
        private hospitalService: HospitalService,
    ) { }

    async generatePDF(patientForm: any) {

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
        const surname1 = patientForm.surname1 || '';
        const surname2 = patientForm.surname2 || '';
        const name = patientForm.name || '';

        doc.setFont('helvetica', 'bold');
        doc.text(`Nombre completo: `, 16, 35);
        doc.setFont('helvetica', 'normal');

        let startPosition = 65;

        doc.text(surname1, startPosition, 35);
        const surname1Width = doc.getTextWidth(surname1);
        startPosition += surname1Width + 2;

        if (patientForm.surname2 != null) {
            doc.text(surname2 + ',', startPosition, 35);
            const surname2Width = doc.getTextWidth(surname2);
            startPosition += surname2Width + 2;
        }

        doc.text(name, startPosition, 35);

        //Datos varios:
        doc.setFont('helvetica', 'bold');
        doc.text(`Código paciente: `, 140, 35);
        doc.setFont('helvetica', 'normal');
        doc.text(`${patientForm.patientCode}`, 180, 35);

        doc.setFont('helvetica', 'bold');
        doc.text(`Fecha de nacimiento: `, 16, 40);
        doc.setFont('helvetica', 'normal');
        const birthDate = formatDate(patientForm.birthDate);
        doc.text(birthDate, 65, 40);


        doc.setFont('helvetica', 'bold');
        doc.text(`Sexo: `, 16, 45);
        doc.setFont('helvetica', 'normal');
        if (patientForm.gender == 'male') {
            doc.text(`Hombre`, 65, 45);
        } else {
            doc.text(`Mujer`, 65, 45);
        }

        // HOSPITAL:
        doc.setFont('helvetica', 'bold');
        doc.text(`Hospital: `, 130, 45);
        doc.setFont('helvetica', 'normal');
        const nombreHospital = await lastValueFrom(this.hospitalService.getHospitalNameByCode(patientForm.hospital));
        doc.text(`${nombreHospital}`, 155, 45);



        doc.setFont('helvetica', 'bold');
        doc.text(`Dirección: `, 16, 50);
        doc.setFont('helvetica', 'normal');
        if (patientForm.address != null) {
            doc.text(`${patientForm.address}`, 65, 50);
        }

        doc.setFont('helvetica', 'bold');
        doc.text(`CIP: `, 140, 50);
        doc.setFont('helvetica', 'normal');
        if (patientForm.cip != null) {
            doc.text(`${patientForm.cip}`, 155, 50);
        }

        doc.setFont('helvetica', 'bold');
        doc.text(`Teléfono: `, 16, 55);
        doc.setFont('helvetica', 'normal');
        doc.text(`${patientForm.phone}`, 65, 55);

        doc.setFont('helvetica', 'bold');
        doc.text(`C. Emergencia: `, 117.5, 55);
        doc.setFont('helvetica', 'normal');
        if (patientForm.emergencyContact != null) {
            doc.text(`${patientForm.emergencyContact}`, 155, 55);
        }

        //cuando tengamos guardada la info sustituir el 'blabla'

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
    };
}
