import { Component } from '@angular/core';
import { RecommendationApiService } from '../../services/recommendation-api';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-submission',
  imports: [JsonPipe],
  templateUrl: './submission.component.html',
  styleUrl: './submission.component.scss'
})
export class SubmissionComponent {
constructor(public recApi : RecommendationApiService){}
}
