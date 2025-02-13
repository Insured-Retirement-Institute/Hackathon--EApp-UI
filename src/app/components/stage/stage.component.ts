import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DataItem, DataItemForm, DataOptionForm, DataTypeEnum, Stage, StageForm } from '../questionnaire/questionnaire.component';
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
  showpreBuilt = false;
  showCustom = false;
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

  canShow(stage: Stage, dataItem: DataItem): boolean {
    var parent = this.form?.value.dataItems?.find(x => x.dataItemId === dataItem.parentDataItemId);
    if (!parent) {
      return true;
    }
    if (parent.selectedValue ===  dataItem.parentDataItemRequiredOption) {
      return true;
    }
    
    return false;
  }

  setPreBuilt(): void {
    this.showCustom = false;
    this.showpreBuilt = true
    this.cd.detectChanges();
  }

  reset(): void {
    this.showCustom = false;
    this.showpreBuilt = false
    this.cd.detectChanges();
  }

  setCustom(): void {
    this.showpreBuilt = false;
    this.showCustom = true
    this.cd.detectChanges();
  }

  // get options(): FormArray<FormGroup<DataOptionForm>> {
  //   return this.dataItems.get('dataOptions') as FormArray<FormGroup<DataOptionForm>>;
  // }
}
