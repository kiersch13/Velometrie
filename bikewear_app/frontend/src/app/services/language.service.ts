import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  code: string;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const LANG_STORAGE_KEY = 'velometrie_lang';
const DEFAULT_LANG = 'de';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly languages = SUPPORTED_LANGUAGES;

  constructor(private translate: TranslateService) {}

  init(): void {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    const lang = saved && this.isSupported(saved) ? saved : this.detectBrowserLang();
    this.translate.addLangs(SUPPORTED_LANGUAGES.map(l => l.code));
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.translate.use(lang);
    this.updateHtmlLang(lang);
  }

  get currentLang(): string {
    return this.translate.currentLang || DEFAULT_LANG;
  }

  use(lang: string): void {
    if (!this.isSupported(lang)) return;
    this.translate.use(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    this.updateHtmlLang(lang);
  }

  private isSupported(lang: string): boolean {
    return SUPPORTED_LANGUAGES.some(l => l.code === lang);
  }

  private detectBrowserLang(): string {
    const browserLang = navigator.language?.split('-')[0] ?? DEFAULT_LANG;
    return this.isSupported(browserLang) ? browserLang : DEFAULT_LANG;
  }

  private updateHtmlLang(lang: string): void {
    document.documentElement.setAttribute('lang', lang);
  }
}
