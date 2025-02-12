import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { appRoutes } from './app.routes';
import { MatButton } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon'
import { fadeIn, slideInOutFromLeft } from './services/animations';
import { DrawerService } from './services/drawer.service';
import { transitionFadeIn } from './helpers/animations';
@Component({
  selector: 'app-root',
  standalone: true,
  animations: [
    slideInOutFromLeft,
    fadeIn,
    transitionFadeIn,
  ],
  imports: [
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    private router: Router,
    private drawerService: DrawerService
  ) {

  }
  title = 'iri-hackathon-app';
  nav = appRoutes;
  showDrawer: Signal<boolean> = signal(false);
  queryParams: QuestionnaireParams = {
    stage: 0,
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  
  toggleDrawer(): void {
    this.drawerService.toggleDrawer();
  }

  ngOnInit(): void { }
}

export interface QuestionnaireParams {
  stage?: number;
}