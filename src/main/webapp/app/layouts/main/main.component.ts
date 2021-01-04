import { Component, OnInit, RendererFactory2, Renderer2, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd, NavigationError } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, OnDestroy {
  private renderer: Renderer2;
  showNavbar: boolean;

  destroy = new Subject();

  constructor(
    private accountService: AccountService,
    private titleService: Title,
    private router: Router,
    private translateService: TranslateService,
    rootRenderer: RendererFactory2
  ) {
    this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);
    this.showNavbar = true;
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().pipe(take(1)).subscribe();
    this.showNavbar = this.shouldNavbarBeShown();

    this.router.events.pipe(takeUntil(this.destroy)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
        this.showNavbar = this.shouldNavbarBeShown();
      }
      if (event instanceof NavigationError && event.error.status === 404) {
        this.router.navigate(['/404']);
      }
    });

    this.translateService.onLangChange.pipe(takeUntil(this.destroy)).subscribe((langChangeEvent: LangChangeEvent) => {
      this.updateTitle();
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    let title: string = routeSnapshot.data && routeSnapshot.data['pageTitle'] ? routeSnapshot.data['pageTitle'] : '';
    if (routeSnapshot.firstChild) {
      title = this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'global.title';
    }
    this.translateService
      .get(pageTitle)
      .pipe(take(1))
      .subscribe(title => this.titleService.setTitle(title));
  }

  /**
   * Checks if the navbar should be shown or not.
   */
  private shouldNavbarBeShown(): boolean {
    return this.accountService.isAuthenticated() && this.router.url !== '/account/register';
  }
}
