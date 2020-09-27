/**
 * City interface
 */
import { Coord } from './coord';

export interface City {
  id: number;
  name: string;
  country: string;
  coord: Coord;
}
