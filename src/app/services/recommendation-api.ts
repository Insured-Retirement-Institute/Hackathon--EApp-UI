import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecommendationApiService {
    private apiUrl = 'https://dkdvnq4vg6.execute-api.us-west-2.amazonaws.com/prod/chat';
    public response: string = "{\"statusCode\":200,\"headers\":{\"Content-Type\":\"application/json\",\"Access-Control-Allow-Origin\":\"*\"},\"body\":{\"portfolio_allocation\":{\"primary_affinity\":{\"weight\":35,\"securities\":[{\"symbol\":\"NVDA\",\"name\":\"NVIDIA Corporation\",\"allocation\":12},{\"symbol\":\"MSFT\",\"name\":\"Microsoft Corporation\",\"allocation\":13},{\"symbol\":\"CRM\",\"name\":\"Salesforce\",\"allocation\":10}]},\"growth_sectors\":{\"weight\":25,\"securities\":[{\"symbol\":\"DKNG\",\"name\":\"DraftKings Inc\",\"allocation\":8},{\"symbol\":\"COIN\",\"name\":\"Coinbase Global\",\"allocation\":9},{\"symbol\":\"NKE\",\"name\":\"Nike Inc\",\"allocation\":8}]},\"stable_income\":{\"weight\":15,\"securities\":[{\"symbol\":\"V\",\"name\":\"Visa Inc\",\"allocation\":8},{\"symbol\":\"MA\",\"name\":\"Mastercard Inc\",\"allocation\":7}]},\"international_exposure\":{\"weight\":15,\"securities\":[{\"symbol\":\"TSM\",\"name\":\"Taiwan Semiconductor\",\"allocation\":8},{\"symbol\":\"ASML\",\"name\":\"ASML Holding\",\"allocation\":7}]},\"fixed_income\":{\"weight\":10,\"securities\":[{\"symbol\":\"AGG\",\"name\":\"iShares Core U.S. Aggregate Bond ETF\",\"allocation\":10}]}},\"risk_profile\":\"aggressive growth\",\"total_positions\":11,\"rebalancing_frequency\":\"quarterly\"}}";
    public jsonformat: any = {
        "statusCode": 200,
        "headers": {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        "body": {
          "portfolio_allocation": {
            "primary_affinity": {
              "weight": 35,
              "securities": [
                {
                  "symbol": "NVDA",
                  "name": "NVIDIA Corporation",
                  "allocation": 12
                },
                {
                  "symbol": "MSFT",
                  "name": "Microsoft Corporation",
                  "allocation": 13
                },
                {
                  "symbol": "CRM",
                  "name": "Salesforce",
                  "allocation": 10
                }
              ]
            },
            "growth_sectors": {
              "weight": 25,
              "securities": [
                {
                  "symbol": "DKNG",
                  "name": "DraftKings Inc",
                  "allocation": 8
                },
                {
                  "symbol": "COIN",
                  "name": "Coinbase Global",
                  "allocation": 9
                },
                {
                  "symbol": "NKE",
                  "name": "Nike Inc",
                  "allocation": 8
                }
              ]
            },
            "stable_income": {
              "weight": 15,
              "securities": [
                {
                  "symbol": "V",
                  "name": "Visa Inc",
                  "allocation": 8
                },
                {
                  "symbol": "MA",
                  "name": "Mastercard Inc",
                  "allocation": 7
                }
              ]
            },
            "international_exposure": {
              "weight": 15,
              "securities": [
                {
                  "symbol": "TSM",
                  "name": "Taiwan Semiconductor",
                  "allocation": 8
                },
                {
                  "symbol": "ASML",
                  "name": "ASML Holding",
                  "allocation": 7
                }
              ]
            },
            "fixed_income": {
              "weight": 10,
              "securities": [
                {
                  "symbol": "AGG",
                  "name": "iShares Core U.S. Aggregate Bond ETF",
                  "allocation": 10
                }
              ]
            }
          },
          "risk_profile": "aggressive growth",
          "total_positions": 11,
          "rebalancing_frequency": "quarterly"
        }
      };
    constructor(private http: HttpClient) {}

    getRecommendations(prompt: string): Observable<PortfolioModel> {
        // TODO maybe direct to anthropic
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { messages: [{role: 'user', content:'convervative investor'} ]};

        return this.http.post<PortfolioModel>(this.apiUrl, body, { headers: headers });
    }
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
  
