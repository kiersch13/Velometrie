import { BikeCategory } from './bike-category';

export interface Bike {
  id: number;
  name: string;
  kategorie: BikeCategory;
  kilometerstand: number;
  fahrstunden: number;
  stravaId: string;
  userId: number;
  indoorKilometerstand: number;
  sattelhoehe: number | null;
  sattelversatz: number | null;
  vorbaulaenge: number | null;
  vorbauwinkel: number | null;
  kurbellaenge: number | null;
  lenkerbreite: number | null;
  spacer: number | null;
  reach: number | null;
  stack: number | null;
  radstand: number | null;
}