import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DataItemForm, DataOptionForm, DataTypeEnum, Stage, StageForm } from '../questionnaire/questionnaire.component';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { fadeIn } from '../../services/animations';
import { PlaidLinkComponent } from '../plaid-link/plaid-link.component';


@Component({
  selector: 'app-stage',
  imports: [
    ReactiveFormsModule,
    MatRadioModule,
    MatRadioGroup,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    PlaidLinkComponent
],
  animations: [fadeIn],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss',
})
export class StageComponent implements OnInit {
  constructor(
    private cd: ChangeDetectorRef 
  ) {}
  @Input() stage?: Stage;
  @Input() form?: FormGroup<StageForm> | null;
  dataTypeEnum = DataTypeEnum;
  ownerStages = [
    'owner information',
    'owner contact details',
    'beneficiary information',
    'personal finances'
  ];
  readonly startDate = new Date(1990, 0, 1);

  ngOnInit(): void {
      this.cd.detectChanges();
  }

  isOwnerStage(stageTitle: string): boolean {
    let res = this.ownerStages.includes(stageTitle.toLowerCase());
    return res;
  }

  // get options(): FormArray<FormGroup<DataOptionForm>> {
  //   return this.dataItems.get('dataOptions') as FormArray<FormGroup<DataOptionForm>>;
  // }
}
