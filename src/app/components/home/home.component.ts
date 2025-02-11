import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { RecommendationApiService } from '../../services/recommendation-api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButton,
    MatSliderModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit { 


  constructor(private recommendationsService: RecommendationApiService) { }
  ngOnInit(): void {
    this.recommendationsService.getRecommendations('jj').subscribe((response) => {
      console.log(response);
    });
  }
}
