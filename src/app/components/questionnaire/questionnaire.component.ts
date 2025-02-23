import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatLabel, MatSelectModule } from '@angular/material/select';
import { StageComponent } from "../stage/stage.component";
import { OrderModule } from 'ngx-order-pipe';
import { MatButton, MatFabButton } from '@angular/material/button';
import { RecommendationApiService } from '../../services/recommendation-api';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuestionnaireParams } from '../../app.component';
import { EAppApiService } from '../../services/eapp-api';
import { MatIcon } from '@angular/material/icon';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { fadeIn, listAnimation } from '../../services/animations';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-questionnaire',
  imports: [
    ReactiveFormsModule,
    MatButton,
    StageComponent,
    OrderModule,
    CommonModule,
    MatProgressBarModule,
    RouterModule,
    MatIcon,
    LottieComponent,
    MatSidenavModule
  ],
  animations: [
    fadeIn,
    listAnimation
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
  animationOptions: AnimationOptions = {
    path: 'loading.json'
  }
  fb = inject(FormBuilder)
  apiEApp: ApiEAppModel | null = null;
  mainForm: FormGroup<{ stages: FormArray<FormGroup<StageForm>> }> = this.fb.group({
    stages: this.fb.array<FormGroup<StageForm>>([])
  });
  currentStageIndex = 0;
  activeStage: Stage | undefined = undefined;
  activeForm: FormGroup<StageForm> | undefined = undefined;
  showAll = false;
  questionAnswers: QuestionAnswer[] = [];
  progress = 0;
  currentMode:MatDrawerMode = 'side';

  get stages(): FormArray<FormGroup<StageForm>> {
    return this.mainForm.get('stages') as FormArray<FormGroup<StageForm>>;
  }

  ngOnInit(): void {
    const templateId = this.activatedRoute.snapshot.paramMap.get('templateId') as string;
    const applicationId = this.activatedRoute.snapshot.paramMap.get('applicationId') as string;

    if (applicationId && applicationId !== 'new') {
      this.eAppApi.getApplication(applicationId).subscribe((response) => {
        this.apiEApp = response;
        this.activeStage = this.apiEApp.stages[0];
        this.progress = ((this.currentStageIndex + 1) * 100) / this.apiEApp?.stages.length;
        this.eAppApi.currentApp = this.apiEApp;
        this.initializeForm();
        this.cd.markForCheck();
      });
    } else {
      this.eAppApi.getTemplate(templateId).subscribe((response) => {
        this.apiEApp = response;
        this.apiEApp.status = 'Pending';
        this.apiEApp.id = this.generateUUID();
        this.apiEApp.templateId = templateId;
        this.apiEApp.name = 'Application' + this.apiEApp.id;
        this.activeStage = this.apiEApp.stages[0];
        this.progress = ((this.currentStageIndex + 1) * 100) / this.apiEApp?.stages.length;
        this.eAppApi.currentApp = this.apiEApp;
        this.initializeForm();
        this.cd.markForCheck();
      });
    }
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
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
          selectedValue: new FormControl(dataItem.selectedValue ?? '', { nonNullable: true })
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
    let data: QuestionAnswer[] = [];
    this.mainForm.value.stages?.forEach(s => s.dataItems?.forEach(d => {
      if (d.dataItemId && d.selectedValue) {

        // try to append the values to the model
        const match = this.apiEApp?.stages.find(stage => stage.title == s.title);
        match?.dataItems.forEach(item => {
          if (item.dataItemId == d.dataItemId) {
            item.selectedValue = d.selectedValue ?? '';
          }
        })
        data.push({
          question: d.displayLabel ?? '',
          answer: d.selectedValue
        })
      }
    }));
    this.eAppApi.currentAnswers = data;
    this.router.navigate(['/submission']);
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
  templateId: string,
  status: string,
  callbackUrl: string,
  name: string;
  firstname: string;
  lastname: string;
  stages: Stage[],
};

export interface Stage {
  order: number,
  title: string,
  dataItems: DataItem[],
}

export interface DataOption {
  label: string,
  value: string | number | string[] | number[],
}

export interface DataItem {
  dataItemId: string,
  order: number,
  parentDataItemId?: string,
  parentDataItemRequiredOption?: any;
  displayLabel: string,
  dataType: DataTypeEnum,
  dataOptions?: DataOption[],
  selectedValue: string,
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