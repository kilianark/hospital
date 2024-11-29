import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MaterialModule } from "./material.module";

import { EnumToStringPipe } from "../../pipe/enum-to-string.pipe";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import SpinnerComponent from "../components/spinner/spinner.component";
import { IdToStringPipe } from "../../pipe/id-to-string.pipe";

@NgModule({
    declarations: [
        EnumToStringPipe,
        SpinnerComponent,
        IdToStringPipe
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ConfirmDialogComponent,
    ],
    exports: [
        EnumToStringPipe,
        MaterialModule,
        ConfirmDialogComponent,
        SpinnerComponent,
        IdToStringPipe
    ]
})

export class SharedModule { }

