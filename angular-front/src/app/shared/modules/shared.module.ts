import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MaterialModule } from "./material.module";

import { EnumToStringPipe } from "../../pipe/enum-to-string.pipe";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import SpinnerComponent from "../components/spinner/spinner.component";
import { IdToStringPipe } from "../../pipe/id-to-string.pipe";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpLoaderFactory } from "../../modules/home.module/home.module";
import { HttpClient } from "@angular/common/http";

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
        IdToStringPipe
    ]
})

export class SharedModule { }

