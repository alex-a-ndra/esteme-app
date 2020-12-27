import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { EstemeSharedModule } from 'app/shared/shared.module';
import { EstemeCoreModule } from 'app/core/core.module';
import { EstemeAppRoutingModule } from './app-routing.module';
import { EstemeHomeModule } from './home/home.module';
import { EstemeEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    BrowserModule,
    EstemeSharedModule,
    EstemeCoreModule,
    EstemeHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    EstemeEntityModule,
    EstemeAppRoutingModule,
  ],
  declarations: [
    MainComponent,
    NavbarComponent,
    ErrorComponent,
    PageRibbonComponent,
    ActiveMenuDirective,
    FooterComponent,
    DashboardComponent,
  ],
  bootstrap: [MainComponent],
})
export class EstemeAppModule {}
