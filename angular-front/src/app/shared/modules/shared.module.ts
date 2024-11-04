import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MaterialModule } from "./material.module";

import { EnumToStringPipe } from "../../pipe/enum-to-string.pipe";


@NgModule({
    declarations: [
        EnumToStringPipe,

    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        EnumToStringPipe,
        MaterialModule
    ]
})

export class SharedModule { }

