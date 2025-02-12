// plaid-link.service.ts
import { Injectable } from '@angular/core';

declare var Plaid: any;

@Injectable({
  providedIn: 'root',
})
export class PlaidLinkService {
  private plaidHandler: any;

  constructor() {}

  initializePlaidLink(config: any): void {
    this.plaidHandler = Plaid.create(config);
  }

  openPlaidLink(): void {
    if (this.plaidHandler) {
      this.plaidHandler.open();
    } else {
      console.error('Plaid Link handler is not initialized.');
    }
  }

  exitPlaidLink(): void {
    if (this.plaidHandler) {
      this.plaidHandler.exit();
    } else {
      console.error('Plaid Link handler is not initialized.');
    }
  }

  destroyPlaidLink(): void {
    if (this.plaidHandler) {
      this.plaidHandler.destroy();
    } else {
      console.error('Plaid Link handler is not initialized.');
    }
  }
}
