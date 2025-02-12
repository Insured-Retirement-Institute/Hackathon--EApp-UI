import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RecommendationApiService } from '../../services/recommendation-api';
import { CommonModule, JsonPipe } from '@angular/common';
import { PricingModelMock } from '../../constants/allocation-mock.constant';
import { FormsModule } from '@angular/forms';
import { PricingApiService, PricingRequestModel, PricingResponseModel } from '../../services/pricing.api';

@Component({
  selector: 'app-submission',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './submission.component.html',
  styleUrl: './submission.component.scss'
})
export class SubmissionComponent implements OnInit {
  constructor(public recApi: RecommendationApiService, private pricingApi: PricingApiService, private cd: ChangeDetectorRef) { }
  recommendedAllocation?:PricingRequestModel;
  pricingByCarrier: Record<number, PricingResponseModel> = {};
  
  ngOnInit(): void {
    this.carriers.forEach(carrier => { if(carrier.id != 1) carrier.checked = false; }); //reset list
    this.recommendedAllocation = PricingModelMock; // this.recApi.currentRecommendation;
    this.cd.markForCheck();
  }

  getPricing(): void {
    this.pricingByCarrier = {};
    this.pricingApi.getPricing(this.recommendedAllocation!).subscribe((response) => {
      this.pricingByCarrier[1] = response;
      this.carriers.forEach(carrier => {
        if (carrier.checked && carrier.id != 1) {
          let val = structuredClone(response);
          val?.funds.forEach(fund => {
          fund.rate = fund.rate += .1
          });
        this.pricingByCarrier[carrier.id] = val!;
        }
      })
      this.cd.markForCheck();
    });  
  }

  carriers:CarrierModel[] = [
    {
      id: 1,
      name: 'AEL',
      checked: true,
      rating: 'A'
    },
    {
      id: 2,
      name: 'Athene',
      checked: false,
      rating: 'A+'
    },
    {
      id: 3,
      name: 'Jackson',
      checked: false,
      rating: 'A'
    },
    {
      id: 4,
      name: 'Prudential',
      checked: false,
      rating: 'A='
    },
    {
      id: 5,
      name: 'Nationwide',
      checked: false,
      rating: 'A+'
    },
    {
      id: 6,
      name: 'New York Life',
      checked: false,
      rating: 'A++'
    }
  ];
  selectedCarriers: CarrierModel[]= [];

  updateCarrierList(item: CarrierModel): void {
    this.selectedCarriers.push(item);
  }
}

export interface CarrierModel {
  id: number;
  name: string;
  checked: boolean;
  rating: string;
}