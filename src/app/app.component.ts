import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { MatButton } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon'
import { fadeIn, slideInOutFromLeft } from './services/animations';
import { DrawerService } from './services/drawer.service';
@Component({
  selector: 'app-root',
  standalone: true,
  animations: [
    slideInOutFromLeft,
    fadeIn,
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


  toggleDrawer(): void {
    this.drawerService.toggleDrawer();
  }

  ngOnInit(): void { }
}
