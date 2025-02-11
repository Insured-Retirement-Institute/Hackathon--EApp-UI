import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatLabel, MatSelectModule } from '@angular/material/select';
import { StageComponent } from "../stage/stage.component";
import { OrderModule } from 'ngx-order-pipe';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-questionnaire',
  imports: [
    ReactiveFormsModule,
    MatButton,
    StageComponent,
    OrderModule
  ],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent implements OnInit {

  fb = inject(FormBuilder)
  apiEApp = ApiEApp;
  eApp = ApiEApp;
  mainForm: FormGroup<{ stages: FormArray<FormGroup<StageForm>> }> = this.fb.group({
    stages: this.fb.array<FormGroup<StageForm>>([])
  });
  currentStageIndex = 0;
  activeStage = this.apiEApp.stages[0];
  activeForm: FormGroup<StageForm> | null = null;
  get stages(): FormArray<FormGroup<StageForm>> {
    return this.mainForm.get('stages') as FormArray<FormGroup<StageForm>>;
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
        const group = this.fb.group<DataItemForm>({
          order: new FormControl(dataItem.order, { nonNullable: true }),
          dataItemId: new FormControl(dataItem.dataItemId, { nonNullable: true }),
          dataType: new FormControl(dataItem.dataType, {nonNullable: true}),
          displayLabel: new FormControl(dataItem.displayLabel, { nonNullable: true }),
          parentDataItemId: new FormControl({ value: dataItem.parentDataItemId, disabled: true }, { nonNullable: true }),
          parentDataItemRequiredOption: new FormControl({ value: dataItem.parentDataItemRequiredOption, disabled: true }, { nonNullable: true }),
          selectedValue: new FormControl('', { nonNullable: true })
        });
        if (dataItem.parentDataItemId) {
          group.controls.parentDataItemId.enable();
          group.controls.parentDataItemRequiredOption.enable();
          group.updateValueAndValidity();
        }
        (stageGroup.get('dataItems') as FormArray<FormGroup<DataItemForm>>).push(group);
      });

      this.stages.push(stageGroup);
    });
    this.activeForm = this.getFirstStage();
  }

  getFirstStage(): FormGroup<StageForm> | null {
    return this.stages.length > 0 ? this.stages.at(0) : null;
  }

  getNextStage(): FormGroup<StageForm> | null {
    if (this.currentStageIndex < this.stages.length - 1) {
      this.currentStageIndex++;
      return this.stages.at(this.currentStageIndex);
    }
    return null;
  }

  goTo(stageOrder?: number): void {
    let stage: Stage | undefined;
    const order = this.activeStage.order;
    this.activeForm = this.getNextStage();
  }
}

export enum DataTypeEnum {
  select = 'select',
  radio = 'radio',
  checkbox = 'checkbox',
  shortText = 'shortText',
  longText = 'longText',
  date = 'date',
  currency = 'currency',
  percentage = 'percentage',
  decimal = 'decimal',
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
  parentDataItemId?: string,
  parentDataItemRequiredOption?: 'Yes' | 'No'
  displayLabel: string,
  dataType: DataTypeEnum,
  dataOptions?: DataOption[]
}

export interface DataOptionForm {
  label: FormControl<string>;
  value: FormControl<string | number>;
}

export interface DataItemForm {
  order: FormControl<number>;
  dataItemId: FormControl<string>;
  dataType: FormControl<DataTypeEnum>;
  dataOptions?: FormArray<FormGroup<DataOptionForm>>
  parentDataItemId: FormControl<string | undefined>;
  parentDataItemRequiredOption: FormControl<'Yes' | 'No' | undefined>;
  displayLabel: FormControl<string>;
  selectedValue: FormControl<string>;
}

export interface StageForm {
  title: FormControl<string>;
  dataItems: FormArray<FormGroup<DataItemForm>>;
}

export const ApiEApp: ApiEAppModel = {
  "id": "a1cba943-aed1-4523-9df6-62e15dd04145",
  "callbackUrl": "/application/template/{templateId}",
  "stages": [
    {
      "order": 1,
      "title": "General Details",
      "dataItems": [
        {
          "dataItemId": "eb7e628a-7b9e-45fb-a36a-9b14cc854f04",
          "order": 1,
          "displayLabel": "Is this annuity part of a retirement account?",
          "dataType": DataTypeEnum.radio,
          "dataOptions": [
            {
              "label": "Yes",
              "value": "Yes"
            },
            {
              "label": "No",
              "value": "No"
            }
          ]
        },
        {
          "dataItemId": "1201ecc8-6dc1-47a3-8d5a-8db2233bbc41",
          "order": 2,
          "parentDataItemId": "eb7e628a-7b9e-45fb-a36a-9b14cc854f04",
          "parentDataItemRequiredOption": "Yes",
          "displayLabel": "What type?",
          "dataType": DataTypeEnum.select,
          "dataOptions": [
            {
              "label": "Traditional IRA",
              "value": "TraditionalIra"
            },
            {
              "label": "Roth IRA",
              "value": "RothIra"
            },
            {
              "label": "Inherited Traditional",
              "value": "InheritedIra"
            },
            {
              "label": "Inherited Roth",
              "value": "InheritedRoth"
            }
          ]
        }
      ]
    },
    {
      "order": 2,
      "title": "Ownership Details",
      "dataItems": [
        {
          "dataItemId": "7ae825c3-0843-4a9f-9bff-3bcebc5b19e1",
          "order": 1,
          "displayLabel": "Who will own this annuity?",
          "dataType": DataTypeEnum.radio,
          "dataOptions": [
            {
              "label": "One Person",
              "value": "Individual"
            },
            {
              "label": "Two People",
              "value": "Joint"
            },
            {
              "label": "Trust",
              "value": "Trust"
            },
            {
              "label": "Corporation",
              "value": "Corporation"
            }
          ]
        },
        {
          "dataItemId": "7a8650e5-7891-497a-a54b-7c1c1bbfb6e4",
          "order": 2,
          "displayLabel": "Who will receive the benefits of this annuity?",
          "dataType": DataTypeEnum.radio,
          "dataOptions": [
            {
              "label": "Same as Owner(s)",
              "value": "SameAsOwner"
            },
            {
              "label": "Another Person",
              "value": "Individual"
            },
            {
              "label": "Two Other People",
              "value": "Joint"
            }
          ]
        },
        
      ]
    },
  ]
};