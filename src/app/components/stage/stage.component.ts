import { Component, Input } from '@angular/core';
import { DataItemForm, DataOptionForm, DataTypeEnum, Stage, StageForm } from '../questionnaire/questionnaire.component';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { fadeIn } from '../../services/animations';

@Component({
  selector: 'app-stage',
  imports: [
    ReactiveFormsModule,
    MatRadioModule,
    MatRadioGroup,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatDatepickerModule
  ],
  animations: [fadeIn],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss'
})
export class StageComponent {
  @Input() stage?: Stage;
  @Input() form?: FormGroup<StageForm> | null;
  dataTypeEnum = DataTypeEnum;
  groupedIds = [
    '1f3646f9-fc6e-445e-97e4-d256649df192',
    'fa3e0680-14c0-43da-b7ed-8fab27151363',
    'd68285bd-2475-4e04-b251-7afd4c7183a9',
    'c48d214f-c5ac-44ef-a255-30620ccb3710'
  ]
  isGrouped(id: string): boolean {
    return this.groupedIds.includes(id);
  }

  // get options(): FormArray<FormGroup<DataOptionForm>> {
  //   return this.dataItems.get('dataOptions') as FormArray<FormGroup<DataOptionForm>>;
  // }
}
