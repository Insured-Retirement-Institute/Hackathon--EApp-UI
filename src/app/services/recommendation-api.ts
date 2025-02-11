import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecommendationApiService {
    private apiUrl = 'https://dkdvnq4vg6.execute-api.us-west-2.amazonaws.com/prod/chat';
    public response: any;

    constructor(private http: HttpClient) {}

    getRecommendations(prompt: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { messages: [{role: 'user', content: [{
            type: 'text',
            text: prompt}]} ]};

        return this.http.post<any>(this.apiUrl, body, { headers: headers });
    }
}

interface Holding {
    symbol: string;
    name: string;
    weight: number;
    category: string;
  }
  
  interface SectorAllocation {
    weight: number;
    holdings: Holding[];
  }
  
  interface PortfolioAllocation {
    primary_affinity_sector: SectorAllocation;
    growth_sectors: SectorAllocation;
    stable_income: SectorAllocation;
    international_exposure: SectorAllocation;
    fixed_income: SectorAllocation;
  }

  
  interface PortfolioModel {
    portfolio_allocation: PortfolioAllocation;
    risk_profile: string;
    esg_focus: string;
  }
  
