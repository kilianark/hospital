import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EnumToStringPipe } from "../pipe/enum-to-string.pipe";



@NgModule({
declarations: [ 
    EnumToStringPipe,

],
imports: [
    CommonModule,
],
exports: [
    EnumToStringPipe
]
})

export class SharedModule{}

