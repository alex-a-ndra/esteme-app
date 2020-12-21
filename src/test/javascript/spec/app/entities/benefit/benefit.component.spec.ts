import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EstemeTestModule } from '../../../test.module';
import { BenefitComponent } from 'app/entities/benefit/benefit.component';
import { BenefitService } from 'app/entities/benefit/benefit.service';
import { Benefit } from 'app/shared/model/benefit.model';

describe('Component Tests', () => {
  describe('Benefit Management Component', () => {
    let comp: BenefitComponent;
    let fixture: ComponentFixture<BenefitComponent>;
    let service: BenefitService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EstemeTestModule],
        declarations: [BenefitComponent],
      })
        .overrideTemplate(BenefitComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BenefitComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BenefitService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Benefit(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.benefits && comp.benefits[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
