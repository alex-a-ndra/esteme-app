import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IBenefit, Benefit } from 'app/shared/model/benefit.model';
import { BenefitService } from './benefit.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-benefit-update',
  templateUrl: './benefit-update.component.html',
})
export class BenefitUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    isUsedBies: [],
  });

  constructor(
    protected benefitService: BenefitService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ benefit }) => {
      this.updateForm(benefit);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(benefit: IBenefit): void {
    this.editForm.patchValue({
      id: benefit.id,
      name: benefit.name,
      isUsedBies: benefit.isUsedBies,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const benefit = this.createFromForm();
    if (benefit.id !== undefined) {
      this.subscribeToSaveResponse(this.benefitService.update(benefit));
    } else {
      this.subscribeToSaveResponse(this.benefitService.create(benefit));
    }
  }

  private createFromForm(): IBenefit {
    return {
      ...new Benefit(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      isUsedBies: this.editForm.get(['isUsedBies'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBenefit>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IUser): any {
    return item.id;
  }

  getSelected(selectedVals: IUser[], option: IUser): IUser {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
