import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PricingRequestModel } from './pricing.api';
import { QuestionAnswer } from '../components/questionnaire/questionnaire.component';

@Injectable({
    providedIn: 'root'
})
export class RecommendationApiService {
    private apiUrl = 'https://jys9kgu58a.us-west-2.awsapprunner.com/Recommendation';
    constructor(private http: HttpClient) {}

    getRecommendations(qa: QuestionAnswer[]): Observable<PricingRequestModel> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        var body = {answers: qa};
        return this.http.post<PricingRequestModel>(this.apiUrl, body, { headers: headers });
    }

    currentRecommendation?:PricingRequestModel;
}

interface Security {
    symbol: string;
    name: string;
    allocation: number;
  }
  
  interface SectorAllocation {
    weight: number;
    securities: Security[];
  }
  
  interface PortfolioAllocation {
    primary_affinity_sector: SectorAllocation;
    growth_sectors: SectorAllocation;
    stable_income: SectorAllocation;
    international_exposure: SectorAllocation;
    fixed_income: SectorAllocation;
  }

  
  export interface PortfolioModel {
    portfolio_allocation: Record<string, SectorAllocation>;
    risk_profile: string;
    esg_focus: string;
  }
  
