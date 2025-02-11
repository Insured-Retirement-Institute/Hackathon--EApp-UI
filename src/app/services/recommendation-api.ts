import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecommendationApiService {
    private apiUrl = 'https://dkdvnq4vg6.execute-api.us-west-2.amazonaws.com/prod/chat';


    constructor(private http: HttpClient) {}

    getRecommendations(prompt: string): Observable<any> {
        prompt = 'I am a conservative investor looking to retire in the next 5 years. I do no like to invest in technology companies and want to support comapnies that focus on social good.'
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { messages: [{role: 'user', content: [{
            type: 'text',
            text: prompt}]} ]};

        return this.http.post<any>(this.apiUrl, body, { headers: headers });
    }
}

export interface RecommendationRequestModel {
    prompt: 'I am a conservative investor looking to retire in the next 5 years. I do no like to invest in technology companies and want to support comapnies that focus on social good.'
}