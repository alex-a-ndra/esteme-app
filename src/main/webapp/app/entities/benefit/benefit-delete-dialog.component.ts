import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBenefit } from 'app/shared/model/benefit.model';
import { BenefitService } from './benefit.service';

@Component({
  templateUrl: './benefit-delete-dialog.component.html',
})
export class BenefitDeleteDialogComponent {
  benefit?: IBenefit;

  constructor(protected benefitService: BenefitService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.benefitService.delete(id).subscribe(() => {
      this.eventManager.broadcast('benefitListModification');
      this.activeModal.close();
    });
  }
}
