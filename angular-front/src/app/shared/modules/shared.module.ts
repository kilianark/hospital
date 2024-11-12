import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MaterialModule } from "./material.module";

import { EnumToStringPipe } from "../../pipe/enum-to-string.pipe";

import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";


@NgModule({
    declarations: [
        EnumToStringPipe,

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
    ]
})

export class SharedModule { }

