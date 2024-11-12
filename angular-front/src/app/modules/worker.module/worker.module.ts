import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { WorkerRoutingModule } from './worker-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/modules/shared.module';
import { CreateWorkerComponent } from '../../pages/home/components/worker/create/create.component';
@NgModule({
  declarations: [
    CreateWorkerComponent,
  ],
  imports: [
    CommonModule,
    WorkerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  providers: [provideHttpClient()],
})
export class WorkerModule {}
