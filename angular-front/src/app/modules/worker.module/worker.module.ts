import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { WorkerRoutingModule } from './worker-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/modules/shared.module';
import { CreateWorkerComponent } from '../../pages/home/components/worker/create/create.component';
import { SearchWorkerComponent } from '../../pages/home/components/worker/search/search.component';
import { SelectZoneComponent } from '../../shared/components/select-zone/select-zone.component';
@NgModule({
  declarations: [
    CreateWorkerComponent,
    SearchWorkerComponent,
  ],
  imports: [
    CommonModule,
    WorkerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    SelectZoneComponent
  ],
  providers: [provideHttpClient()],
})
export class WorkerModule {}
