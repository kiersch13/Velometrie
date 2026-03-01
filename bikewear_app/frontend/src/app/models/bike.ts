import { BikeCategory } from './bike-category';

export interface Bike {
  id: number;
  name: string;
  kategorie: BikeCategory;
  kilometerstand: number;
  stravaId: string;
  userId: number;
}