import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MaterialModule } from "./material.module";

import { EnumToStringPipe } from "../../pipe/enum-to-string.pipe";
import SpinnerComponent from "../components/spinner/spinner.component";

@NgModule({
    declarations: [
        EnumToStringPipe,
        SpinnerComponent

    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        EnumToStringPipe,
        MaterialModule,
        SpinnerComponent
    ]
})

export class SharedModule { }

