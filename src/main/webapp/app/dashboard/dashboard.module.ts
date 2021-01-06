import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EstemeSharedModule } from 'app/shared/shared.module';
import { dashboardRoute } from './dashboard.route';

@NgModule({
  imports: [EstemeSharedModule, RouterModule.forChild([dashboardRoute])],
})
export class DashboardModule {}
