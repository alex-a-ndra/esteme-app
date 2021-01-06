import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { BenefitService } from 'app/entities/benefit/benefit.service';
import { IBenefit } from 'app/shared/model/benefit.model';

@Component({
  selector: 'est-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss'],
})
export class BenefitsListComponent implements OnInit, OnDestroy {
  benefits?: IBenefit[];
  eventSubscriber?: Subscription;

  mockBenefitLitteYears = {
    title: 'Little Years',
    description: 'Schwangerschaftsbox',
    imageUrl: '.../.../../../../../content/images/LittleYears.jpg',
    affordable: true,
  };

  mockBenefitMindshine = {
    title: 'Mindshine',
    description: 'Personal Training für Körper und Geist',
    imageUrl: '.../.../../../../../content/images/mindshine.jpg',
    affordable: true,
  };

  constructor(private benefitService: BenefitService, protected eventManager: JhiEventManager) {}

  ngOnInit(): void {
    this.loadAll();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  /**
   * Load all benefits.
   */
  loadAll(): void {
    this.benefitService.query().subscribe((res: HttpResponse<IBenefit[]>) => (this.benefits = res.body || []));
  }
}
