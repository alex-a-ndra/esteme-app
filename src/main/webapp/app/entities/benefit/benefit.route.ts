import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IBenefit, Benefit } from 'app/shared/model/benefit.model';
import { BenefitService } from './benefit.service';
import { BenefitComponent } from './benefit.component';
import { BenefitDetailComponent } from './benefit-detail.component';
import { BenefitUpdateComponent } from './benefit-update.component';

@Injectable({ providedIn: 'root' })
export class BenefitResolve implements Resolve<IBenefit> {
  constructor(private service: BenefitService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBenefit> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((benefit: HttpResponse<Benefit>) => {
          if (benefit.body) {
            return of(benefit.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Benefit());
  }
}

export const benefitRoute: Routes = [
  {
    path: '',
    component: BenefitComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'estemeApp.benefit.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BenefitDetailComponent,
    resolve: {
      benefit: BenefitResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'estemeApp.benefit.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BenefitUpdateComponent,
    resolve: {
      benefit: BenefitResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'estemeApp.benefit.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BenefitUpdateComponent,
    resolve: {
      benefit: BenefitResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'estemeApp.benefit.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
