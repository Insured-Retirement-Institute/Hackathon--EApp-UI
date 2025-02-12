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
  public ltFetched: boolean = false;
  // Fetch this from your backend.
  public lt = 'link-sandbox-ec142fcd-2072-42a0-8b75-ec2945a069d4';
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    // Make request to backend...
    setTimeout(() => this.enableButton(), 500);
  }

  enableButton() {
    // Set the lt and show the button.
    this.lt = 'link-sandbox-ec142fcd-2072-42a0-8b75-ec2945a069d4';
    this.ltFetched = true;
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