import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PricingApiService {
    private apiUrl = 'TODO';

    constructor(private http: HttpClient) {}

    // TODO figure out what the input type is
    getPricing(input: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { prompt: prompt };

        return this.http.post<any>(this.apiUrl, body, { headers: headers });
    }
}