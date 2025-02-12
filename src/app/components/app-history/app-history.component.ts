import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApplicationHistoryResponse, EAppApiService } from '../../services/eapp-api';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-history',
  imports: [
    MatButtonModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './app-history.component.html',
  styleUrl: './app-history.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppHistoryComponent implements OnInit {
  applications: ApplicationHistoryResponse[] = []; // Holds the list of applications

  constructor(
    private eAppApiService: EAppApiService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.applications = [
    //   { templateId: '1', id: '1234432432312', firstName: 'John', lastName: 'Doe', status: 'Pending', duration: 10 },
    //   { templateId: '1', id: '1234432432312', firstName: 'Susan', lastName: 'Doe', status: 'Complete', duration: 10 }
    // ]; 

    this.eAppApiService.getApplicationHistory().subscribe(
      (data) => {
        //this.applications = data; // Store the data into applications array
        this.applications = data;
        this.cd.markForCheck(); // Trigger change detection to update the view
      },
      (error) => {
        console.error('Error fetching applications:', error);
        console.log(this.applications);
      }
    );
  }

  // Function to handle 'Continue' button click (you can customize it based on your needs)
  continueApplication(templateId: string, id: string): void {
    console.log(`Continuing with application ID: ${id}`);
    this.router.navigate([`/questionnaire/${templateId}/${id}`]);
    // You can redirect to another page or open a dialog, for example:
    // this.router.navigate(['/application-details', applicationId]);
  }
}