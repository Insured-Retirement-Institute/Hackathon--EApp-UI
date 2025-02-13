import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DataItem, DataItemForm, DataOption, DataOptionForm, DataTypeEnum, Stage, StageForm } from '../questionnaire/questionnaire.component';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { fadeIn } from '../../services/animations';
import { PlaidLinkComponent } from '../plaid-link/plaid-link.component';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { hardcodedAllocations } from './consts';


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
    MatNativeDateModule,
    PlaidLinkComponent,
    MatIcon,
    MatButtonModule,
    MatChipsModule,
    FormsModule
  ],
  animations: [fadeIn],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss',
})
export class StageComponent implements OnInit {
  constructor(
    private cd: ChangeDetectorRef
  ) { }
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
  hardcodedAllocations = hardcodedAllocations;
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
    if (parent.selectedValue === dataItem.parentDataItemRequiredOption) {
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
  coreValuesId = '0a2048e4-d595-4564-8ab5-0dbc792818e1';
  interestsId = '38931e26-5aa6-48e7-843d-8ffd64f235f7';
  riskId = 'eeaca486-de54-44cd-874f-93e58d557cc4';
  test1 = '';
  test2 = '';
  test3 = '';
  array1: string[] = [];
  array2: string[] = [];
  array3: string[] = [];
  // Allows adding new custom chips
  addChip1(value: string, id: string) {
    const index = this.array1.findIndex(x => x === value);
    if(index > -1) {
      this.array2.splice(index, 1);
    } else {
      this.array1.push(value);
    }

  }
  addChip2(value: string, id: string) {
    const index = this.array2.findIndex(x => x === value);
    if(index > -1) {
      this.array2.splice(index, 1);
    } else {
      this.array2.push(value);
    }


  }
  addChip3(value: string, id: string) {
    const index = this.array3.findIndex(x => x === value);
    if(index > -1) {
      this.array2.splice(index, 1);
    } else {
      this.array3.push(value);
    }

  }

  // Remove a chip from selection
  removeChip(option: DataOption) {
    // const selected = this.chipControl.value || [];
    // this.chipControl.setValue(selected.filter(chip => chip !== option));
  }




  // get options(): FormArray<FormGroup<DataOptionForm>> {
  //   return this.dataItems.get('dataOptions') as FormArray<FormGroup<DataOptionForm>>;
  // }
}
