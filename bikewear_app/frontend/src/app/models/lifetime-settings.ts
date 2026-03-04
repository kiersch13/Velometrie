import { WearPartCategory } from './wear-part-category';
import { BikeCategory } from './bike-category';

/**
 * Km-Schwellwerte pro Verschleißteil-Kategorie, spezifisch für eine Fahrradkategorie.
 * Federung nutzt Stunden (separat in FederungServiceSettings).
 */
export type CategoryLifetimeKm = {
  [key in WearPartCategory]: number;
};

/**
 * Service-Intervalle in Stunden für Federung (Federgabel/Dämpfer).
 */
export interface FederungServiceSettings {
  kleinerService: number;  // Stunden (default 50)
  grosserService: number;  // Stunden (default 200)
}

/**
 * Gesamte Lebensdauer-Einstellungen:
 * - km-Schwellwerte pro BikeCategory × WearPartCategory
 * - Federung-Service-Intervalle in Stunden
 */
export interface LifetimeSettings {
  km: {
    [key in BikeCategory]: CategoryLifetimeKm;
  };
  federungService: FederungServiceSettings;
}

const defaultKmRennrad: CategoryLifetimeKm = {
  [WearPartCategory.Reifen]: 6000,
  [WearPartCategory.Kassette]: 15000,
  [WearPartCategory.Kettenblatt]: 30000,
  [WearPartCategory.Kette]: 4000,
  [WearPartCategory.Sonstiges]: 10000,
  [WearPartCategory.Federung]: 0,  // not used for Rennrad
};

const defaultKmGravel: CategoryLifetimeKm = {
  [WearPartCategory.Reifen]: 4000,
  [WearPartCategory.Kassette]: 12000,
  [WearPartCategory.Kettenblatt]: 25000,
  [WearPartCategory.Kette]: 3000,
  [WearPartCategory.Sonstiges]: 10000,
  [WearPartCategory.Federung]: 0,  // tracked in hours via federungService
};

const defaultKmMountainbike: CategoryLifetimeKm = {
  [WearPartCategory.Reifen]: 3000,
  [WearPartCategory.Kassette]: 10000,
  [WearPartCategory.Kettenblatt]: 20000,
  [WearPartCategory.Kette]: 2500,
  [WearPartCategory.Sonstiges]: 10000,
  [WearPartCategory.Federung]: 0,  // tracked in hours via federungService
};

export const defaultLifetimeSettings: LifetimeSettings = {
  km: {
    [BikeCategory.Rennrad]: { ...defaultKmRennrad },
    [BikeCategory.Gravel]: { ...defaultKmGravel },
    [BikeCategory.Mountainbike]: { ...defaultKmMountainbike },
  },
  federungService: {
    kleinerService: 50,
    grosserService: 200,
  },
};
