import { WearPartCategory } from './wear-part-category';

export interface WearPart {
  id: number;
  radId: number;
  name: string;
  kategorie: WearPartCategory;
  position: string | null;
  einbauKilometerstand: number;
  ausbauKilometerstand: number | null;
  einbauDatum: Date;
  ausbauDatum: Date | null;
  einbauFahrstunden: number | null;
  ausbauFahrstunden: number | null;
  notizen: string | null;
  vorgaengerId: number | null;
  gruppeId: number | null;
  reifenBreiteMm?: number | null;
  reifenBreiteZoll?: number | null;
  reifenDruckBar?: number | null;
  reifenDruckPsi?: number | null;
}

export interface MoveWearPartRequest {
  zielRadId: number;
  ausbauKilometerstand: number;
  ausbauDatum: Date;
  einbauKilometerstand: number;
  einbauDatum: Date;
  ausbauFahrstunden?: number | null;
  einbauFahrstunden?: number | null;
}