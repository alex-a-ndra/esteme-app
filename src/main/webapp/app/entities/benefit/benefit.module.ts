import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EstemeSharedModule } from 'app/shared/shared.module';
import { BenefitComponent } from './benefit.component';
import { BenefitDetailComponent } from './benefit-detail.component';
import { BenefitUpdateComponent } from './benefit-update.component';
import { BenefitDeleteDialogComponent } from './benefit-delete-dialog.component';
import { benefitRoute } from './benefit.route';

@NgModule({
  imports: [EstemeSharedModule, RouterModule.forChild(benefitRoute)],
  declarations: [BenefitComponent, BenefitDetailComponent, BenefitUpdateComponent, BenefitDeleteDialogComponent],
  entryComponents: [BenefitDeleteDialogComponent],
})
export class EstemeBenefitModule {}
