import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioModel } from './recommendation-api';

@Injectable({
    providedIn: 'root'
})
export class PricingApiService {
    private apiUrl = 'https://55mfvx4nfh.us-west-2.awsapprunner.com/pricing';

    constructor(private http: HttpClient) {}
 
    transform(data: PortfolioModel): PricingRequestModel {
        // postman example
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
        let allocations: Allocation[] = [];
        let keys = Object.keys(data.portfolio_allocation);
        for (let key in keys) {
            let weight = data.portfolio_allocation[key].weight;
            const assets = data.portfolio_allocation[key].securities.map(security => {
                return {
                    assetClass: 'Stock',
                    assetId: security.symbol,
                    allocationPercentage: security.allocation
                } as Allocation;
            allocations.concat(assets);
            })
        }
        return {
            requestorName: 'Valued Client',
            allocations: allocations
        }
    }

    getPricing(pricingRequest: PricingRequestModel): Observable<PricingResponseModel> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<PricingResponseModel>(this.apiUrl, pricingRequest, { headers: headers });
    }
}


export interface PricingResponseModel {
    hash: string,
    validUntilDate: Date,
    funds: Fund[]
}

export interface Fund {
    fundName: string,
    rateType: number, // what is this??
    rate: number
}


// {
//     "hash": "7b2248617368223a6e756c6c2c2256616c6964556e74696c44617465223a22323032352d30322d31335431393a33383a33352e393434303136355a222c2246756e6473223a5b7b2246756e644e616d65223a226a616b65206767204341502046756e64222c225261746554797065223a302c2252617465223a322e357d2c7b2246756e644e616d65223a226a616b65206767205041522046756e64222c225261746554797065223a302c2252617465223a302e387d5d7d",
//     "validUntilDate": "2025-02-13T19:38:35.9440165Z",
//     "funds": [
//       {
//         "fundName": "jake gg CAP Fund",
//         "rateType": 0,
//         "rate": 2.5
//       },
//       {
//         "fundName": "jake gg PAR Fund",
//         "rateType": 0,
//         "rate": 0.8
//       }
//     ]
//   }


export interface PricingRequestModel {
    requestorName: string,
    allocations: Allocation[],
    Reason?: string,
}

export interface Allocation {
    assetClass: string,
    assetId: string,
    assetDisplayName: string,
    allocationPercentage: number,
    }

    // {
    //     "requestorName": "jake gg",
    //     "contractDuration": 0,
    //     "allocations": [
    //       {
    //         "assetClass": "Stock",
    //         "assetId": "SPIA",
    //         "allocationPercentage": 100
    //       }
    //     ]
    //   }