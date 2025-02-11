import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecommendationApiService {
    private apiUrl = 'https://dmmkd3t0rf.execute-api.us-west-2.amazonaws.com/prod/chat';

    constructor(private http: HttpClient) {}

    getRecommendations(prompt: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { prompt: prompt };

        return this.http.post<any>(this.apiUrl, body, { headers: headers });
    }
}