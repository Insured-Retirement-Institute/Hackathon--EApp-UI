import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { SubmissionComponent } from './components/submission/submission.component';
import { AppHistoryComponent } from './components/app-history/app-history.component';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        title: 'Home',
        path: 'home',
        component: HomeComponent,
    },
    {
        title: 'App History',
        path: 'app-history',
        component: AppHistoryComponent,
    },
    {
        title: 'Questionnaire',
        path: 'questionnaire/:templateId/:applicationId',
        component: QuestionnaireComponent,
    },
    {
        title: 'Submission',
        path: 'submission',
        component: SubmissionComponent,
    }
];
