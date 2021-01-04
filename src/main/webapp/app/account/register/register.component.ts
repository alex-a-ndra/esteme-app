import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiLanguageService } from 'ng-jhipster';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/shared/constants/error.constants';
import { RegisterService } from './register.service';
import { Authority } from 'app/shared/constants/authority.constants';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
  styleUrls: ['register.scss'],
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('email', { static: false })
  email?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;

  // Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|]).{8,32}$')
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.maxLength(254), Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  constructor(private languageService: JhiLanguageService, private registerService: RegisterService, private fb: FormBuilder) {}

  ngAfterViewInit(): void {
    if (this.email) {
      this.email.nativeElement.focus();
    }
  }

  register(): void {
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    const password = this.registerForm.get(['password'])!.value;
    const firstName = this.registerForm.get(['firstName'])!.value;
    const lastName = this.registerForm.get(['firstName'])!.value;
    if (password !== this.registerForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
    } else {
      const email = this.registerForm.get(['email'])!.value;
      this.registerService
        .save({
          email,
          password,
          firstName,
          lastName,
          langKey: this.languageService.getCurrentLanguage(),
          authorities: [Authority.USER],
          activated: true,
        })
        .subscribe(
          () => (this.success = true),
          response => this.processError(response)
        );
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
