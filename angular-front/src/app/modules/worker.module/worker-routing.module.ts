// src/app/modules/worker/worker-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateWorkerComponent } from '../../pages/home/components/worker/create/create.component';
import { RoleGuard } from '../../guard/role.guard';
import { SearchWorkerComponent } from '../../pages/home/components/worker/search/search.component';
import { WorkerComponent } from '../../pages/home/components/worker/worker.component';
import { AuthGuard } from '../../guard/auth.guard';

const routes: Routes = [
  { path: '', component: WorkerComponent, canActivate:[RoleGuard, AuthGuard], data:{roles:['general_workers']}},
  { path: 'create', component: CreateWorkerComponent, canActivate: [RoleGuard, AuthGuard], data: { roles: ['create_worker']} },
  {path:'search', component: SearchWorkerComponent, canActivate: [RoleGuard, AuthGuard], data: {roles: ['search_worker']}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkerRoutingModule {}
