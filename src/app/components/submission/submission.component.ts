import { Component } from '@angular/core';
import { RecommendationApiService } from '../../services/recommendation-api';
import { CommonModule, JsonPipe } from '@angular/common';
import { PricingModelMock } from '../../constants/allocation-mock.constant';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-submission',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './submission.component.html',
  styleUrl: './submission.component.scss'
})
export class SubmissionComponent {
  constructor(public recApi: RecommendationApiService) { }
  pricingModel = PricingModelMock;
  carriers:CarrierModel[] = [
    {
      name: 'AEL',
      checked: true,
    },
    {
      name: 'Athene',
      checked: false,
    },
    {
      name: 'Jackson',
      checked: false,
    },
  ];
  selectedCarriers: CarrierModel[]= [];

  updateCarrierList(item: CarrierModel): void {
    this.selectedCarriers.push(item);
  }
}

export interface CarrierModel {
  name: string;
  checked: boolean;
}