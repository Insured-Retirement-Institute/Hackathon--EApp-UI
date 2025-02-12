import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatLabel, MatSelectModule } from '@angular/material/select';
import { StageComponent } from "../stage/stage.component";
import { OrderModule } from 'ngx-order-pipe';
import { MatButton } from '@angular/material/button';
import { RecommendationApiService } from '../../services/recommendation-api';
import { CommonModule } from '@angular/common';
import { SubmissionComponent } from '../submission/submission.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuestionnaireParams } from '../../app.component';
import { EAppApiService } from '../../services/eapp-api';

@Component({
  selector: 'app-questionnaire',
  imports: [
    ReactiveFormsModule,
    MatButton,
    StageComponent,
    OrderModule,
    CommonModule,
    SubmissionComponent,
    MatProgressBarModule,
    RouterModule,
  ],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class QuestionnaireComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eAppApi: EAppApiService,
    private cd: ChangeDetectorRef,
    private recommendationApi: RecommendationApiService
  ) { }
  fb = inject(FormBuilder)
  apiEApp: ApiEAppModel|null = null;
  mainForm: FormGroup<{ stages: FormArray<FormGroup<StageForm>> }> = this.fb.group({
    stages: this.fb.array<FormGroup<StageForm>>([])
  });
  currentStageIndex = 0;
  activeStage: Stage | undefined = undefined;
  activeForm: FormGroup<StageForm> | undefined = undefined;
  showAll = false;
  progress = 0;
  get stages(): FormArray<FormGroup<StageForm>> {
    return this.mainForm.get('stages') as FormArray<FormGroup<StageForm>>;
  }

  ngOnInit(): void {
    const templateId = this.activatedRoute.snapshot.paramMap.get('templateId') as string;
    this.eAppApi.getTemplate(templateId).subscribe((response) => {
      this.apiEApp = response;
      this.activeStage = this.apiEApp.stages[0];
      this.progress = ((this.currentStageIndex + 1) * 100) / this.apiEApp?.stages.length;
      this.initializeForm();
      this.cd.markForCheck();
    });
  }

  showAllocation() {
    this.showAll = !this.showAll;
  }

  initializeForm(): void {
    this.apiEApp?.stages.forEach(stage => {
      const stageGroup = this.fb.group<StageForm>({
        title: new FormControl(stage.title, { nonNullable: true }),
        dataItems: this.fb.array<FormGroup<DataItemForm>>([])
      });

      stage.dataItems.forEach(dataItem => {
        const group = this.fb.group<DataItemForm>({
          order: new FormControl(dataItem.order, { nonNullable: true }),
          dataItemId: new FormControl(dataItem.dataItemId, { nonNullable: true }),
          dataType: new FormControl(dataItem.dataType, { nonNullable: true }),
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
    this.activeStage = this.apiEApp?.stages.at(0);
    this.activeForm = this.getFirstForm();
  }

  getFirstForm(): FormGroup<StageForm> | undefined {
    return this.stages.length > 0 ? this.stages.at(0) : undefined;
  }

  getNextStageForm(): FormGroup<StageForm> | undefined {
    if (this.currentStageIndex < this.stages.length - 1) {
      this.currentStageIndex++;
      return this.stages.at(this.currentStageIndex);
    }
    return undefined;
  }

  getNextStageObj(): Stage | undefined {
    if (this.currentStageIndex <= this.stages.length - 1) {
      return this.apiEApp?.stages.at(this.currentStageIndex);
    }
    return undefined;
  }

  getPrevStageForm(): FormGroup<StageForm> | undefined {
    if (this.currentStageIndex === 0) {
      return this.stages.at(0);
    };
    if (this.currentStageIndex <= this.stages.length - 1) {
      this.currentStageIndex--;
      return this.stages.at(this.currentStageIndex);
    }
    return undefined;
  }

  getPrevStageObj(): Stage | undefined {
    if (this.currentStageIndex === 0) {
      return this.apiEApp?.stages.at(0);
    };
    if (this.currentStageIndex <= this.stages.length - 1) {
      return this.apiEApp?.stages.at(this.currentStageIndex);
    }
    return undefined;
  }

  goNext(): void {
    this.activeForm = this.getNextStageForm();
    this.activeStage = this.getNextStageObj();
    this.progress = ((this.currentStageIndex + 1) * 100) / this.apiEApp!.stages.length;
  }


  goBack(): void {
    this.activeForm = this.getPrevStageForm();
    this.activeStage = this.getPrevStageObj();
    this.progress = ((this.currentStageIndex + 1) * 100) / this.apiEApp!.stages.length;;
  }

  goToStep(stepIndex: number) {
    this.currentStageIndex = stepIndex;
    this.activeForm = this.stages.at(this.currentStageIndex);
    this.activeStage = this.apiEApp!.stages.at(this.currentStageIndex);
    this.progress = ((this.currentStageIndex + 1) * 100) / this.apiEApp!.stages.length;
  }

  submit(): void {
    let data:QuestionAnswer[] = [];
    this.mainForm.value.stages?.forEach(s => s.dataItems?.forEach(d => {
      if (d.dataItemId && d.selectedValue) {
        data.push({
          question: d.displayLabel ?? '',
          answer: d.selectedValue
        })
      }
    }));
    this.recommendationApi.getRecommendations(data)
    .subscribe((response) => {
      this.recommendationApi.currentRecommendation = response;
      // route to shop page
  });
  }
}

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface PostModel {
  id: string;
  dataItems: { dataItemId: string; value: string | number }[];
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
  parentDataItemRequiredOption?: any;
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
  parentDataItemRequiredOption: FormControl<any | undefined>;
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

export const ApiEAppV2: ApiEAppModel = {
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
        }
      ]
    },
    {
      "order": 3,
      "title": "Owner Information",
      "dataItems": [
        {
          "dataItemId": "1f3646f9-fc6e-445e-97e4-d256649df192",
          "order": 1,
          "displayLabel": "First Name",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "fa3e0680-14c0-43da-b7ed-8fab27151363",
          "order": 2,
          "displayLabel": "Middle Name",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "d68285bd-2475-4e04-b251-7afd4c7183a9",
          "order": 3,
          "displayLabel": "Last Name",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "c48d214f-c5ac-44ef-a255-30620ccb3710",
          "order": 4,
          "displayLabel": "Suffix",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "",
          "order": 5,
          "displayLabel": "Date of Birth",
          "dataType": DataTypeEnum.date
        },
        {
          "dataItemId": "",
          "order": 6,
          "displayLabel": "SSN",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "",
          "order": 7,
          "displayLabel": "Gender",
          "dataType": DataTypeEnum.select,
          "dataOptions": [
            {
              "label": "Male",
              "value": "Male"
            },
            {
              "label": "Female",
              "value": "Female"
            }
          ]
        }
      ]
    },
    {
      "order": 4,
      "title": "Owner Contact Details",
      "dataItems": [
        {
          "dataItemId": "",
          "order": 1,
          "displayLabel": "Resident Address",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "",
          "order": 2,
          "displayLabel": "City",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "",
          "order": 3,
          "displayLabel": "State",
          "dataType": DataTypeEnum.select,
          "dataOptions": [
            {
              "label": "AL",
              "value": "AL"
            },
            {
              "label": "AK",
              "value": "AK"
            },
            {
              "label": "AZ",
              "value": "AZ"
            },
            {
              "label": "AR",
              "value": "AR"
            },
            {
              "label": "CA",
              "value": "CA"
            },
            {
              "label": "CO",
              "value": "CO"
            },
            {
              "label": "CT",
              "value": "CT"
            },
            {
              "label": "DE",
              "value": "DE"
            },
            {
              "label": "FL",
              "value": "FL"
            },
            {
              "label": "GA",
              "value": "GA"
            },
            {
              "label": "HI",
              "value": "HI"
            },
            {
              "label": "ID",
              "value": "ID"
            },
            {
              "label": "IL",
              "value": "IL"
            },
            {
              "label": "IN",
              "value": "IN"
            },
            {
              "label": "IA",
              "value": "IA"
            },
            {
              "label": "KS",
              "value": "KS"
            },
            {
              "label": "KY",
              "value": "KY"
            },
            {
              "label": "LA",
              "value": "LA"
            },
            {
              "label": "ME",
              "value": "ME"
            },
            {
              "label": "MD",
              "value": "MD"
            },
            {
              "label": "MA",
              "value": "MA"
            },
            {
              "label": "MI",
              "value": "MI"
            },
            {
              "label": "MN",
              "value": "MN"
            },
            {
              "label": "MS",
              "value": "MS"
            },
            {
              "label": "MO",
              "value": "MO"
            },
            {
              "label": "MT",
              "value": "MT"
            },
            {
              "label": "NE",
              "value": "NE"
            },
            {
              "label": "NV",
              "value": "NV"
            },
            {
              "label": "NH",
              "value": "NH"
            },
            {
              "label": "NJ",
              "value": "NJ"
            },
            {
              "label": "NM",
              "value": "NM"
            },
            {
              "label": "NY",
              "value": "NY"
            },
            {
              "label": "NC",
              "value": "NC"
            },
            {
              "label": "ND",
              "value": "ND"
            },
            {
              "label": "OH",
              "value": "OH"
            },
            {
              "label": "OK",
              "value": "OK"
            },
            {
              "label": "OR",
              "value": "OR"
            },
            {
              "label": "PA",
              "value": "PA"
            },
            {
              "label": "RI",
              "value": "RI"
            },
            {
              "label": "SC",
              "value": "SC"
            },
            {
              "label": "SD",
              "value": "SD"
            },
            {
              "label": "TN",
              "value": "TN"
            },
            {
              "label": "TX",
              "value": "TX"
            },
            {
              "label": "UT",
              "value": "UT"
            },
            {
              "label": "VT",
              "value": "VT"
            },
            {
              "label": "VA",
              "value": "VA"
            },
            {
              "label": "WA",
              "value": "WA"
            },
            {
              "label": "WV",
              "value": "WV"
            },
            {
              "label": "WI",
              "value": "WI"
            },
            {
              "label": "WY",
              "value": "WY"
            }
          ]
        },
        {
          "dataItemId": "",
          "order": 4,
          "displayLabel": "Zip",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "",
          "order": 5,
          "displayLabel": "Is your mailing address the same as your resident address?",
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
        }
      ]
    },
    {
      "order": 5,
      "title": "Owner Citizenship & Employment",
      "dataItems": [
        {
          "dataItemId": "",
          "order": 1,
          "displayLabel": "Are you a US citizen?",
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
          "dataItemId": "",
          "order": 2,
          "displayLabel": "Government ID Number",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "",
          "order": 3,
          "displayLabel": "Government ID Type",
          "dataType": DataTypeEnum.radio,
          "dataOptions": [
            {
              "label": "Driver's License",
              "value": "DriversLicense"
            },
            {
              "label": "Passport",
              "value": "Passport"
            }
          ]
        }
      ]
    },
    {
      "order": 6,
      "title": "Beneficiary Information",
      "dataItems": [
        {
          "dataItemId": "",
          "order": 1,
          "displayLabel": "How is this person related to the owner?",
          "dataType": DataTypeEnum.radio,
          "dataOptions": [
            {
              "label": "Child",
              "value": "Child"
            },
            {
              "label": "Spouse",
              "value": "Spouse"
            }
          ]
        },
        {
          "dataItemId": "",
          "order": 2,
          "displayLabel": "First Name",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "",
          "order": 3,
          "displayLabel": "Middle Name",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "",
          "order": 4,
          "displayLabel": "Last Name",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "",
          "order": 5,
          "displayLabel": "Date of Birth",
          "dataType": DataTypeEnum.date
        },
        {
          "dataItemId": "",
          "order": 6,
          "displayLabel": "SSN",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "",
          "order": 7,
          "displayLabel": "Gender",
          "dataType": DataTypeEnum.select,
          "dataOptions": [
            {
              "label": "Male",
              "value": "Male"
            },
            {
              "label": "Female",
              "value": "Female"
            }
          ]
        }
      ]
    },
    {
      "order": 7,
      "title": "Personal Finances",
      "dataItems": [
        {
          "dataItemId": "",
          "order": 1,
          "displayLabel": "What is the total value of your liquid assets?",
          "dataType": DataTypeEnum.currency
        },
        {
          "dataItemId": "",
          "order": 2,
          "displayLabel": "What is the total value of your non-liquid assets?",
          "dataType": DataTypeEnum.currency
        },
        {
          "dataItemId": "39c599a5-d1e8-44f8-9bb0-7e2622d807db",
          "order": 3,
          "displayLabel": "Are you still working?",
          "dataType": DataTypeEnum.select,
          "dataOptions": [
            {
              "label": "Yes, Full-Time",
              "value": "FullTime"
            },
            {
              "label": "Yes, Part-Time",
              "value": "PartTime"
            },
            {
              "label": "No, I'm Retired",
              "value": "Retired"
            }
          ]
        },
        {
          "dataItemId": "",
          "order": 3,
          "displayLabel": "What is your gross monthly household income?",
          "parentDataItemId": "39c599a5-d1e8-44f8-9bb0-7e2622d807db",
          "parentDataItemRequiredOption": "FullTime",
          "dataType": DataTypeEnum.currency
        },
        {
          "dataItemId": "",
          "order": 3,
          "displayLabel": "What is your gross monthly household income?",
          "parentDataItemId": "39c599a5-d1e8-44f8-9bb0-7e2622d807db",
          "parentDataItemRequiredOption": "PartTime",
          "dataType": DataTypeEnum.currency
        },
        {
          "dataItemId": "",
          "order": 4,
          "displayLabel": "What is your current monthly household expenses?",
          "dataType": DataTypeEnum.currency
        }
      ]
    },
    {
      "order": 8,
      "title": "Suitability",
      "dataItems": [
        {
          "dataItemId": "",
          "order": 1,
          "displayLabel": "How many years before you will need access to this money?",
          "dataType": DataTypeEnum.radio,
          "dataOptions": [
            {
              "label": "5",
              "value": "5"
            },
            {
              "label": "7",
              "value": "7"
            },
            {
              "label": "10",
              "value": "10"
            }
          ]
        },
        {
          "dataItemId": "",
          "order": 2,
          "displayLabel": "Why are you purchasing this annuity?",
          "dataType": DataTypeEnum.select,
          "dataOptions": [
            {
              "label": "Guaranteed Lifetime Income",
              "value": "GuaranteedLifetimeIncome"
            },
            {
              "label": "Protection",
              "value": "Protection"
            },
            {
              "label": "PotentialGrowth",
              "value": "Retired"
            },
            {
              "label": "Estate Planning",
              "value": "EstatePlanning"
            }
          ]
        },
        {
          "dataItemId": "",
          "order": 3,
          "displayLabel": "What is the original source of the funds being used to purchase this annuity?",
          "dataType": DataTypeEnum.select,
          "dataOptions": [
            {
              "label": "Annuity",
              "value": "Annuity"
            },
            {
              "label": "Life Insurance",
              "value": "LifeInsurance"
            },
            {
              "label": "Savings/Checking",
              "value": "SavingsChecking"
            },
            {
              "label": "Stocks/Bonds/Mutual Funds",
              "value": "StocksBondsMutualFunds"
            },
            {
              "label": "CD",
              "value": "CD"
            }
          ]
        }
      ]
    },
    {
      "order": 9,
      "title": "Funding",
      "dataItems": [
        {
          "dataItemId": "",
          "order": 1,
          "displayLabel": "What much premium will you contribute to this annuity?",
          "dataType": DataTypeEnum.currency
        },
        {
          "dataItemId": "375bb26a-8ba2-49ae-a2ae-c7203314685b",
          "order": 2,
          "displayLabel": "Where are the funds coming from?",
          "dataType": DataTypeEnum.select,
          "dataOptions": [
            {
              "label": "Online Money Transfer (EFT)",
              "value": "EFT"
            },
            {
              "label": "Existing Annuity",
              "value": "1035"
            },
            {
              "label": "Retirement Account",
              "value": "Rollover"
            }
          ]
        },
        {
          "dataItemId": "",
          "order": 3,
          "displayLabel": "What type of bank account will you be transferring from?",
          "parentDataItemId": "375bb26a-8ba2-49ae-a2ae-c7203314685b",
          "parentDataItemRequiredOption": "EFT",
          "dataType": DataTypeEnum.radio,
          "dataOptions": [
            {
              "label": "Checking",
              "value": "Checking"
            },
            {
              "label": "Savings",
              "value": "Savings"
            }
          ]
        },
        {
          "dataItemId": "",
          "order": 4,
          "displayLabel": "What is the routing number of your account?",
          "parentDataItemId": "375bb26a-8ba2-49ae-a2ae-c7203314685b",
          "parentDataItemRequiredOption": "EFT",
          "dataType": DataTypeEnum.shortText
        },
        {
          "dataItemId": "",
          "order": 5,
          "displayLabel": "What is the account number of your account?",
          "parentDataItemId": "375bb26a-8ba2-49ae-a2ae-c7203314685b",
          "parentDataItemRequiredOption": "EFT",
          "dataType": DataTypeEnum.shortText
        }
      ]
    },
    {
      "order": 10,
      "title": "Allocation",
      "dataItems": [
        {
          "dataItemId": "",
          "order": 1,
          "displayLabel": "What are your core values? What principles do you abide by?",
          "dataType": DataTypeEnum.longText
        },
        {
          "dataItemId": "",
          "order": 1,
          "displayLabel": "Are there any particular industries that you are interested in? (Ex. Technology, Aviation, Energy, etc.)",
          "dataType": DataTypeEnum.longText
        },
        {
          "dataItemId": "",
          "order": 1,
          "displayLabel": "Would you prefer low-risk with steady returns, or are you okay with higher risk for potentially higher returns?",
          "dataType": DataTypeEnum.longText
        }
      ]
    }
  ]
}