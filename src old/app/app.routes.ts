import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';

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
    }
];
