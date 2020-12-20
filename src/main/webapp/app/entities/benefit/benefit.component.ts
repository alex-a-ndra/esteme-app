import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBenefit } from 'app/shared/model/benefit.model';
import { BenefitService } from './benefit.service';
import { BenefitDeleteDialogComponent } from './benefit-delete-dialog.component';

@Component({
  selector: 'jhi-benefit',
  templateUrl: './benefit.component.html',
})
export class BenefitComponent implements OnInit, OnDestroy {
  benefits?: IBenefit[];
  eventSubscriber?: Subscription;

  constructor(protected benefitService: BenefitService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.benefitService.query().subscribe((res: HttpResponse<IBenefit[]>) => (this.benefits = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInBenefits();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IBenefit): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInBenefits(): void {
    this.eventSubscriber = this.eventManager.subscribe('benefitListModification', () => this.loadAll());
  }

  delete(benefit: IBenefit): void {
    const modalRef = this.modalService.open(BenefitDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.benefit = benefit;
  }
}
