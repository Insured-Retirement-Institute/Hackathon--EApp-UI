import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {
  NgxPlaidLinkModule,
  PlaidOnEventArgs,
  PlaidOnExitArgs,
  PlaidOnSuccessArgs,
} from 'ngx-plaid-link';

@Component({
  selector: 'app-plaid-link',
  templateUrl: './plaid-link.component.html',
  styleUrls: ['./plaid-link.component.css'],
  imports: [CommonModule, HttpClientModule, NgxPlaidLinkModule, MatButtonModule],
  standalone: true,
})
export class PlaidLinkComponent implements OnInit, AfterViewInit {
  public tokenFetched: boolean = false;
  // Fetch this from your backend.
  public linkToken = 'link-sandbox-62f1e2a6-b1c8-4a3d-8910-4a4f3bfdab4e';
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    // Make request to backend...
    setTimeout(() => this.enableButton(), 500);
  }

  enableButton() {
    // Set the link token and show the button.
    this.linkToken = 'link-sandbox-62f1e2a6-b1c8-4a3d-8910-4a4f3bfdab4e';
    this.tokenFetched = true;
  }

  onSuccess(event: PlaidOnSuccessArgs) {
    console.log({ success: event });
  }

  onEvent(event: PlaidOnEventArgs) {
    console.log({ event });
  }

  onExit(event: PlaidOnExitArgs) {
    console.log({ error: event });
  }

  onLoad(event: any) {
    console.log({ load: event });
  }

  onClick(event: any) {
    console.log({ click: event });
  }
}