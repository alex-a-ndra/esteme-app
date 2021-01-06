import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'est-benefitcard',
  templateUrl: './benefitcard.component.html',
  styleUrls: ['./benefitcard.component.scss'],
})
export class BenefitCardComponent implements AfterViewInit {
  @Input()
  title?: string;

  @Input()
  imageUrl?: string;

  @Input()
  description?: string;

  @Input()
  affordable?: boolean;

  imageSource = '../.../../../../../content/images/logo_esteme.svg';

  constructor() {}

  ngAfterViewInit(): void {
    if (this.imageUrl) {
      this.imageSource = this.imageUrl;
    }
  }
}
