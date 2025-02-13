import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RecommendationApiService } from '../../services/recommendation-api';
import { CommonModule, JsonPipe } from '@angular/common';
import { PricingModelMock } from '../../constants/allocation-mock.constant';
import { FormsModule } from '@angular/forms';
import { PricingApiService, PricingRequestModel, PricingResponseModel } from '../../services/pricing.api';
import { EAppApiService } from '../../services/eapp-api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { fadeIn, listAnimation } from '../../services/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PurchaseConfirmationComponent } from '../purchase-confirmation/purchase-confirmation.component';
import { Router, RouterModule } from '@angular/router';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-submission',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    // LottieComponent
  ],
  animations: [
    fadeIn,
    listAnimation
  ],
  templateUrl: './submission.component.html',
  styleUrl: './submission.component.scss'
})
export class SubmissionComponent implements OnInit {
  constructor(public recApi: RecommendationApiService, private pricingApi: PricingApiService, private cd: ChangeDetectorRef,
    private eappApi: EAppApiService, private dialog: MatDialog,
    private router: Router
  ) { }
  recommendedAllocation?: PricingRequestModel;
  pricingByCarrier: Record<number, PricingResponseModel> = {};
  loading = true;
  animationOptions: AnimationOptions = {
    path: 'loading.json'
  };
  ngOnInit(): void {
    console.log(this.eappApi.currentApp);
    this.carriers.forEach(carrier => { if (carrier.id != 1) carrier.checked = false; }); //reset list
    this.recApi.getRecommendations(this.eappApi.currentAnswers)
      .subscribe((response) => {
        this.recApi.currentRecommendation = response;
        this.recommendedAllocation = response;
        this.recommendedAllocation.allocations = this.recommendedAllocation.allocations.sort((a, b) => b.allocationPercentage - a.allocationPercentage);
        this.loading = false;
        this.cd.markForCheck();
      });
  }

  shop(): void {
    const request = structuredClone(this.recommendedAllocation);
    request?.allocations.forEach(allocation => {
      allocation.assetClass = 'Stock'; // workaround for the fact that the API doesn't accept dynamic asset classes
      allocation.allocationPercentage = Math.floor(allocation.allocationPercentage);
    });
    const sum = request?.allocations.reduce((acc, val) => acc + val.allocationPercentage, 0);
    console.log(sum);
    const diff = 100 - sum!;
    console.log(diff);
    request!.allocations[0].allocationPercentage += diff;
    request!.requestorName = "Andrew Barnett"; // maybe dynamic?
    this.pricingByCarrier = {};
    this.pricingApi.getPricing(request!).subscribe((response) => {
      this.pricingByCarrier[1] = response;
      this.carriers.forEach(carrier => {
        if (carrier.checked && carrier.id != 1) {
          let val = structuredClone(response);
          val?.funds.forEach(fund => {
            if (fund.fundName.includes("CAP")) {
              fund.rate = fund.rate -= .2;
            } else {
              fund.rate = fund.rate -= 3;
            }
          });
          this.pricingByCarrier[carrier.id] = val!;
        }
      })
      this.cd.markForCheck();
    });
  }

  openConfirmationModal(): void {
    this.dialog.closeAll();
    const dialog = this.dialog.open<PurchaseConfirmationComponent>(PurchaseConfirmationComponent);
    dialog.afterClosed().subscribe({
      next: () => this.router.navigate(['/app-history'])
    })
  }

  submitApp(): void {
    const form = this.eappApi.currentApp;

    this.eappApi.submitApplication(form!).subscribe((response) => {
      this.openConfirmationModal();
      this.eappApi.signApp(response.id).subscribe((response) => {
      });
    });
  }

  carriers: CarrierModel[] = [
    {
      id: 1,
      name: 'American Equity',
      imgUrl: 'ael.svg',
      checked: true,
      rating: 'A'
    },
    {
      id: 2,
      name: 'Athene',
      imgUrl: 'athene.svg',
      checked: false,
      rating: 'A+'
    },
    {
      id: 3,
      name: 'Jackson',
      imgUrl: 'jackson.svg',
      checked: false,
      rating: 'A'
    },
    {
      id: 4,
      name: 'Prudential',
      imgUrl: 'prudential.svg',
      checked: false,
      rating: 'A+'
    },
    {
      id: 5,
      name: 'Nationwide',
      imgUrl: 'nationwide.svg',
      checked: false,
      rating: 'A+'
    },
    {
      id: 6,
      name: 'New York Life',
      imgUrl: 'ny-life.svg',
      checked: false,
      rating: 'A++'
    }
  ];
}

export interface CarrierModel {
  id: number;
  imgUrl?: string;
  name: string;
  checked: boolean;
  rating: string;
}