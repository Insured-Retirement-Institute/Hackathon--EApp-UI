import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { RecommendationApiService } from '../../services/recommendation-api';
import { TemplateApiService } from '../../services/template-api';
import { PricingApiService, PricingRequestModel } from '../../services/pricing.api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButton,
    MatSliderModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit { 


  constructor(private recommendationsService: RecommendationApiService, private templateApiService:TemplateApiService,
    private pricingService: PricingApiService
  ) { }
  ngOnInit(): void {
    console.log('Home component initialized');
    this.recommendationsService.getRecommendations('jj').subscribe((response) => {
      console.log(response);
    });

    this.templateApiService.getTemplates().subscribe((response) => {
      console.log(response);
      this.templateApiService.getTemplate(response[1].id).subscribe((response) => {
        console.log(response);
      });
    });

    var fakePricing:PricingRequestModel = {
      requestorName: "Jake Galligan",
      allocations: [{
        assetClass: "Stock",
        assetId: "MSFT",
        allocationPercentage: 70
      },
      {
        assetClass: "Stock",
        assetId: "FIG",
        allocationPercentage: 30
      }]
    } 
    this.pricingService.getPricing(fakePricing).subscribe((response) => {
      console.log(response);
    });
  }
}
