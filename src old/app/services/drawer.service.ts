import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  constructor() { }

  private showDrawerSignal = signal<boolean>(false);

  public toggleDrawer(showDrawer?: boolean): boolean {
    if (showDrawer !== undefined) {
      this.showDrawerSignal.set(showDrawer);
      return showDrawer;
    }
    return this.showDrawerSignal.apply((value: boolean) => value = !value);
  }

  public getDrawerStatusSignal(): Signal<boolean> {
    return computed(() => this.showDrawerSignal());
  }
}
