import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MaterialModule } from "./material.module";

import { EnumToStringPipe } from "../../pipe/enum-to-string.pipe";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import SpinnerComponent from "../components/spinner/spinner.component";
import { IdToStringPipe } from "../../pipe/id-to-string.pipe";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { DoctorSelectComponent } from "../components/selects/doctor-select/doctor-select.component";
import { FormsModule } from "@angular/forms";
import { HospitalSelectComponent } from "../components/selects/hospital-select/hospital-select.component";


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        EnumToStringPipe,
        SpinnerComponent,
        IdToStringPipe,
        DoctorSelectComponent,
        HospitalSelectComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ConfirmDialogComponent,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        })
    ],
    exports: [
        EnumToStringPipe,
        MaterialModule,
        ConfirmDialogComponent,
        SpinnerComponent,
        DoctorSelectComponent,
        IdToStringPipe,
        HospitalSelectComponent
    ]
})

export class SharedModule { }

