import { Component, Input } from '@angular/core';
import { DataItemForm, DataOptionForm, DataTypeEnum, Stage, StageForm } from '../questionnaire/questionnaire.component';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatRadioGroup, MatRadioModule} from '@angular/material/radio';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-stage',
  imports: [
    ReactiveFormsModule,
    MatRadioModule,
    MatRadioGroup,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
  ],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss'
})
export class StageComponent {
  @Input() stage?: Stage;
  @Input() form?: FormGroup<StageForm> | null;
  dataTypeEnum = DataTypeEnum;

  // get options(): FormArray<FormGroup<DataOptionForm>> {
  //   return this.dataItems.get('dataOptions') as FormArray<FormGroup<DataOptionForm>>;
  // }
}
