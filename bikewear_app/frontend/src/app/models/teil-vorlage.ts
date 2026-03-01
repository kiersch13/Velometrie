import { WearPartCategory } from './wear-part-category';

export interface TeilVorlage {
  id: number;
  name: string;
  hersteller: string;
  kategorie: WearPartCategory;
  gruppe: string | null;
  geschwindigkeiten: number | null;
  /** Kommagetrennte Fahrradkategorien, z. B. "Rennrad,Gravel" */
  fahrradKategorien: string;
  beschreibung: string | null;
}
