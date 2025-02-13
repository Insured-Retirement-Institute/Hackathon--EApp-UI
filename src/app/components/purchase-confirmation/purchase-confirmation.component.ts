import { AfterViewInit, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-purchase-confirmation',
  imports: [
    RouterModule,
    MatButtonModule
  ],
  templateUrl: './purchase-confirmation.component.html',
  styleUrl: './purchase-confirmation.component.scss'
})
export class PurchaseConfirmationComponent implements AfterViewInit {
  constructor(
    private dialogRef: MatDialogRef<PurchaseConfirmationComponent, boolean>,
    private router: Router
  ) { }
  ngAfterViewInit(): void {
    this.dialogRef.updateSize('46rem', '30rem');
  }

  goTo(): void {
    this.router.navigate(['/app-history']);
    this.dialogRef.close();
  }
}
