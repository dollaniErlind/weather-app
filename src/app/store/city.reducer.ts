import {ActionsUnion, ActionTypesEnum} from './city.actions';

export const initialCityId = 3183875; // Default selected id belongs to city of Tirana (Albania)

export function cityReducer(state: number = initialCityId, action: ActionsUnion) {
  switch (action.type) {
    case ActionTypesEnum.SetCityId:
      return action.payload;
    case ActionTypesEnum.ClearCityId:
      return null;
    default:
      return state;
  }
}


