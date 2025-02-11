import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatLabel, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-questionnaire',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent implements OnInit {

  constructor(
  ) {
  }

  fb = inject(FormBuilder);
  form = this.fb.group({
    data: this.fb.array([
      this.fb.nonNullable.group({
        qId: this.fb.nonNullable.control(0),
        qTitle: this.fb.nonNullable.control(''),
        qType: this.fb.nonNullable.control(ApiQuestionTypeEnum.shortText),
        sId: this.fb.nonNullable.control(0),
        sTitle: this.fb.nonNullable.control(''),
      })
    ])
  });
  eApp = ApiEApp;

  ngOnInit(): void { }
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
  stages: ApiStageModel[],
};

export interface ApiStageModel {
  order: number,
  title: string,
  dataItems: ApiQuestionV2Model[],
}

export interface DataOption {
  label: string,
  value: string | number,
}

export interface ApiQuestionV2Model {
  dataItemId: string,
  order: number,
  displayLabel: string,
  dataType: ApiQuestionTypeEnum,
  dataOptions?: DataOption[]
}

export const ApiEApp: ApiEAppModel = {
  id: '1234abcd',
  callbackUrl: '',
  stages: [
    {
      order: 1,
      title: 'Section 1',
      dataItems: [
        {
          dataItemId: '12345abcd',
          order: 1,
          displayLabel: 'What is your contract type',
          dataType: ApiQuestionTypeEnum.shortText,
          dataOptions: [
            {
              label: 'Non Qualified',
              value: 'Non Qualified',
            },
            {
              label: 'Traditional IRA',
              value: 'Traditional IRA',
            }
          ]
        },
      ],
    }
  ]
};