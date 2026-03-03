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
  notizen: string | null;
}