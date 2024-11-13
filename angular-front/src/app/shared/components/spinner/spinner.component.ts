import { Component, inject, OnInit } from "@angular/core";
import { SpinnerService } from "../../../services/spinner.service";

@Component({
    selector: 'app-spinner',
    styleUrls: ['./spinner.component.css'],
    template: 
    `<div class="spinner" *ngIf="isLoading()">
    </div>`,
})

export default class SpinnerComponent implements OnInit{

    private readonly spinnerSvc = inject(SpinnerService);
    isLoading = this.spinnerSvc.isLoading;

    ngOnInit() {
        console.log("SpinnerComponent loaded"); // Imprime cuando el componente se inicializa
    }

}