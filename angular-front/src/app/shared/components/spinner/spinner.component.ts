import { Component, inject, OnInit } from "@angular/core";
import { SpinnerService } from "../../../services/spinner.service";

@Component({
    selector: 'app-spinner',
    styleUrls: ['./spinner.component.css'],
    template: 
    `<div class="spinner">
    </div>`,
})

export default class SpinnerComponent{

    private readonly spinnerSvc = inject(SpinnerService);
    isLoading = this.spinnerSvc.isLoading;

}