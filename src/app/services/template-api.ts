import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TemplateApiService {
    private apiUrl1 = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/application/templates';
    private apiUrl2 = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/application/template';
    constructor(private http: HttpClient) {}

    // TODO figure out what the input type is
    getTemplates(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(this.apiUrl1);
    }

    getTemplate(templateId: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(`${this.apiUrl2}/${templateId}`);
    }
}

export interface TemplateBase {
    id: string,
    name: string,
  }