import { Action } from '@ngrx/store';

export enum ActionTypesEnum {
  SetCityId = '[City Id] Set',
  ClearCityId = '[City Id] Clear'
}

export class SetCityId implements Action {
  readonly type = ActionTypesEnum.SetCityId;

  constructor(public payload: number) {}
}

export class ClearCityId implements Action {
  readonly type = ActionTypesEnum.ClearCityId;
}

export type ActionsUnion = SetCityId | ClearCityId;
