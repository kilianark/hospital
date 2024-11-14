// src/app/modules/worker/worker-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateWorkerComponent } from '../../pages/home/components/worker/create/create.component';
import { RoleGuard } from '../../guard/role.guard';

const routes: Routes = [
  { path: 'create', component: CreateWorkerComponent, canActivate: [RoleGuard], data: { roles: ['create_worker']} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkerRoutingModule {}
