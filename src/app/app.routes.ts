import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { SubmissionComponent } from './components/submission/submission.component';

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
        title: 'Questionnaire',
        path: 'questionnaire',
        component: QuestionnaireComponent,
    },
    {
        title: 'Submission',
        path: 'submission',
        component: SubmissionComponent,
    }
];
