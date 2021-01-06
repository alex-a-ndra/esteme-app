import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EstemeSharedModule } from 'app/shared/shared.module';
import { dashboardRoute } from './dashboard.route';
import { BenefitsListComponent } from './benefits/benefits.component';
import { BenefitCardComponent } from './benefits/benefitcard/benefitcard.component';

@NgModule({
  imports: [EstemeSharedModule, RouterModule.forChild([dashboardRoute])],
  declarations: [BenefitsListComponent, BenefitCardComponent],
  exports: [BenefitsListComponent, BenefitCardComponent],
})
export class EstemeDashboardModule {}
