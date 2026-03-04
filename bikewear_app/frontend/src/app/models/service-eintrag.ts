export enum ServiceTyp {
  KleinerService = 'KleinerService',
  GrosserService = 'GrosserService'
}

export interface ServiceEintrag {
  id: number;
  wearPartId: number;
  serviceTyp: ServiceTyp;
  datum: Date;
  beiFahrstunden: number;
  notizen: string | null;
}
