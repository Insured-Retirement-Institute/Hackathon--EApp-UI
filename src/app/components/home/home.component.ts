import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { RecommendationApiService } from '../../services/recommendation-api';
import { EAppApiService, TemplateBase } from '../../services/eapp-api';
import { PricingApiService, PricingRequestModel } from '../../services/pricing.api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements OnInit { 
  templates:TemplateBase[] = [];
  displayNameDict:Record<string, string> = {
    ["D2C"]: "Direct to Consumer",
    ["FIA"] : "Fixed Indexed Annuity",
    ["MYGA"]: "Multi-Year Guaranteed Annuity",
    ["BDFIA"]: "Broker-Dealer Fixed Indexed Annuity",
  }

  constructor(private recommendationsService: RecommendationApiService, private templateApiService:EAppApiService,
    private pricingService: PricingApiService, private cd: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.templateApiService.getTemplates().subscribe((response) => {
      console.log(response);
      this.templates = response;
      this.cd.markForCheck();
    });
    // this.recommendationsService.getRecommendations('jj').subscribe((response) => {
    //   console.log(response);
    // });

    // this.templateApiService.getTemplates().subscribe((response) => {
    //   console.log(response);
    //   this.templateApiService.getTemplate(response[1].id).subscribe((response) => {
    //     console.log(response);
    //   });
    // });

    // var fakePricing:PricingRequestModel = {
    //   requestorName: "Jake Galligan",
    //   allocations: [{
    //     assetClass: "Stock",
    //     assetId: "MSFT",
    //     allocationPercentage: 70
    //   },
    //   {
    //     assetClass: "Stock",
    //     assetId: "FIG",
    //     allocationPercentage: 30
    //   }]
    // } 
    // this.pricingService.getPricing(fakePricing).subscribe((response) => {
    //   console.log(response);
    // });
  }
}
