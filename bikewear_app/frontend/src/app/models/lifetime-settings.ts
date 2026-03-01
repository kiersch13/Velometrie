import { WearPartCategory } from './wear-part-category';

export type LifetimeSettings = {
  [key in WearPartCategory]: number;
};

export const defaultLifetimeSettings: LifetimeSettings = {
  [WearPartCategory.Reifen]: 5000,
  [WearPartCategory.Kassette]: 15000,
  [WearPartCategory.Kettenblatt]: 25000,
  [WearPartCategory.Kette]: 3000,
  [WearPartCategory.Sonstiges]: 10000,
};
