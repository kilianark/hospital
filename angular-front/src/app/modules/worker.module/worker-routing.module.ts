// src/app/modules/worker/worker-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateWorkerComponent } from '../../pages/home/components/worker/create/create.component';

const routes: Routes = [
  { path: 'create', component: CreateWorkerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkerRoutingModule {}
