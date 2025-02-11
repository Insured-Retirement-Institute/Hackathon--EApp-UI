import { Component } from '@angular/core';
import { RecommendationApiService } from '../../services/recommendation-api';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-submission',
  imports: [],
  templateUrl: './submission.component.html',
  styleUrl: './submission.component.scss'
})
export class SubmissionComponent {
constructor(public recApi : RecommendationApiService){}
}
