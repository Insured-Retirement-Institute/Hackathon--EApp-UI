import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEAppModel, QuestionAnswer } from '../components/questionnaire/questionnaire.component';

@Injectable({
    providedIn: 'root'
})
export class EAppApiService {
    private baseUrl = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/application';
    private getTemplatesUrl = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/application/templates';
    private getTemplateUrl = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/application/template';
    private submitAppUrl = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/application/submit';
    private historyUrl = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/application/history';
    private getAppUrl = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/application';
    private signUrl = 'https://8h9ti2mhrm.us-west-2.awsapprunner.com/sign';
    public currentApp?:ApiEAppModel;
    public currentAnswers:QuestionAnswer[] = [];
    constructor(private http: HttpClient) {}

    getTemplates(): Observable<TemplateBase[]> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<TemplateBase[]>(this.getTemplatesUrl);
    }

    getTemplate(templateId: string): Observable<ApiEAppModel> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<ApiEAppModel>(`${this.getTemplateUrl}/${templateId}`);
    }


    // this is more of a save than a submit
    submitApplication(application: ApiEAppModel): Observable<ApplicatonResponse> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<ApplicatonResponse>(this.submitAppUrl, application, { headers: headers });
    }

    saveApplication(application: ApiEAppModel): Observable<ApplicatonResponse> {
        return this.submitApplication(application);
    }

    getApplication(id: string): Observable<ApiEAppModel> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<ApiEAppModel>(this.getAppUrl + `/${id}`);;
    }

    getApplicationHistory(): Observable<ApplicationHistoryResponse[]> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<ApplicationHistoryResponse[]>(this.historyUrl);;
    }

    signApp(id:string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.signUrl}/${id}`, {}, { headers: headers });
    }
}

export interface ApplicationHistoryResponse{
    applicationId: string,
    templateId: string,
    firstName: string,
    lastName: string,
    duration: string,
    submittedDate: Date,
    status: string
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