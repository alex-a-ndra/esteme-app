import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { EstemeTestModule } from '../../test.module';
import { HomeComponent } from 'app/home/home.component';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/core/login/login.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { MockLoginService } from '../../helpers/mock-login.service';
import { FormBuilder } from '@angular/forms';
import { MockRouter } from '../../helpers/mock-route.service';
import { Router } from '@angular/router';

describe('Component Tests', () => {
  describe('Home Component', () => {
    let comp: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let accountService: AccountService;
    let mockLoginService: MockLoginService;
    let mockRouter: MockRouter;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [EstemeTestModule],
        declarations: [HomeComponent],
        providers: [
          FormBuilder,
          {
            provide: LoginService,
            useClass: MockLoginService,
          },
        ],
      })
        .overrideTemplate(HomeComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HomeComponent);
      comp = fixture.componentInstance;
      accountService = TestBed.get(AccountService);
      mockLoginService = TestBed.get(LoginService);
      mockRouter = TestBed.get(Router);
    });

    it('Should call accountService.getAuthenticationState on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(accountService.getAuthenticationState).toHaveBeenCalled();
    });

    it('Should call accountService.isAuthenticated when it checks authentication', () => {
      // WHEN
      comp.isAuthenticated();

      // THEN
      expect(accountService.isAuthenticated).toHaveBeenCalled();
    });

    it('should redirect user when register', () => {
      // WHEN
      comp.register();

      // THEN
      expect(mockRouter.navigateSpy).toHaveBeenCalledWith(['/account/register']);
    });

    it('should redirect user when request password', () => {
      // WHEN
      comp.requestResetPassword();

      // THEN
      expect(mockRouter.navigateSpy).toHaveBeenCalledWith(['/account/reset', 'request']);
    });
  });
});
