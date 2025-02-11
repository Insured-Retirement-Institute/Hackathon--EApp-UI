import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatLabel, MatSelectModule } from '@angular/material/select';
import { StageComponent } from "../stage/stage.component";
import { OrderModule } from 'ngx-order-pipe';

@Component({
  selector: 'app-questionnaire',
  imports: [
    ReactiveFormsModule,
    StageComponent,
    OrderModule 
],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent implements OnInit {

  constructor() {
    this.form = this.fb.group({
      stages: this.fb.array<FormGroup<StageForm>>([])
    });
  }
  fb = inject(FormBuilder)
  apiEApp = ApiEApp;
  eApp = ApiEApp;
  form: FormGroup;

  get stages(): FormArray {
    return this.form.get('stages') as FormArray;
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm(): void {
    this.apiEApp.stages.forEach(stage => {
      const stageGroup = this.fb.group<StageForm>({
        title: new FormControl(stage.title, { nonNullable: true }),
        dataItems: this.fb.array<FormGroup<DataItemForm>>([])
      });

      stage.dataItems.forEach(dataItem => {
        (stageGroup.get('dataItems') as FormArray<FormGroup<DataItemForm>>).push(
          this.fb.group<DataItemForm>({
            dataItemId: new FormControl(dataItem.dataItemId, { nonNullable: true }),
            displayLabel: new FormControl(dataItem.displayLabel, { nonNullable: true }),
            selectedValue: new FormControl('', { nonNullable: true })
          })
        );
      });

      this.stages.push(stageGroup);
    });
  }
}

export enum ApiQuestionTypeEnum {
  select,
  radio,
  checkbox,
  shortText,
  longText,
  date,
  currency,
  percentage,
  decimal,
}

export interface ApiEAppModel {
  id: string,
  callbackUrl: string,
  stages: Stage[],
};

export interface Stage {
  order: number,
  title: string,
  dataItems: DataItem[],
}

export interface DataOption {
  label: string,
  value: string | number,
}

export interface DataItem {
  dataItemId: string,
  order: number,
  displayLabel: string,
  dataType: ApiQuestionTypeEnum,
  dataOptions?: DataOption[]
}

interface DataItemForm {
  dataItemId: FormControl<string>;
  displayLabel: FormControl<string>;
  selectedValue: FormControl<string>;
}

interface StageForm {
  title: FormControl<string>;
  dataItems: FormArray<FormGroup<DataItemForm>>;
}

export const ApiEApp: ApiEAppModel = {
  id: '1234abcd',
  callbackUrl: '',
  stages: [
    {
      order: 1,
      title: 'Contract Information',
      dataItems: [
        {
          dataItemId: '12345abcd',
          order: 1,
          displayLabel: 'What is your contract type?',
          dataType: ApiQuestionTypeEnum.select,
          dataOptions: [
            {
              label: 'Non Qualified',
              value: 'Non Qualified',
            },
            {
              label: 'Traditional IRA',
              value: 'Traditional IRA',
            },
            {
              label: 'Roth IRA',
              value: 'Roth IRA',
            },
          ]
        },
        {
          dataItemId: '12345abcd',
          order: 1,
          displayLabel: 'What is the owner type?',
          dataType: ApiQuestionTypeEnum.select,
          dataOptions: [
            {
              label: 'Individual',
              value: 'Individual',
            },
            {
              label: 'Joint',
              value: 'Joint'
            },
            {
              label: 'Trust',
              value: 'Trust'
            }
          ]
        },
      ],
    }
  ]
};