import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EAppApiService {
    private getTemplatesUrl = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/application/templates';
    private getTemplateUrl = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/application/template';
    private submitAppUrl = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/application/submit';
    constructor(private http: HttpClient) {}

    // TODO figure out what the input type is
    getTemplates(): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(this.getTemplatesUrl);
    }

    getTemplate(templateId: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(`${this.getTemplateUrl}/${templateId}`);
    }

    submitApplication(application: Application): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<ApplicatonResponse>(this.submitAppUrl, application, { headers: headers });
    }
}


export interface ApplicatonResponse {
    id: string,
    submitDate: Date,
}

export interface Application { 
    id: string,
    dataItems: DataItem[],
    submittedDate: Date
}

export interface DataItem {
    dataItemId: string,
    value: string
}
// {
//     "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     "dataItems": [
//       {
//         "dataItemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//         "value": "string"
//       }
//     ],
//     "submittedDate": "2025-02-11T22:58:28.491Z"
//   }

export interface TemplateBase {
    id: string,
    name: string,
  }