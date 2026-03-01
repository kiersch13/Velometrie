import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WearPart } from '../../models/wear-part';
import { WearPartCategory } from '../../models/wear-part-category';
import { WearPartService } from '../../services/wear-part.service';
import { BikeService } from '../../services/bike.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-wear-part-form',
  templateUrl: './wear-part-form.component.html',
  styleUrls: ['./wear-part-form.component.css']
})
export class WearPartFormComponent implements OnInit {
  @Input() radId!: number;
  @Input() currentKilometerstand: number = 0;
  @Input() existingPart?: WearPart;
  @Input() editMode: boolean = false;
  @Output() saved = new EventEmitter<void>();

  categories = Object.values(WearPartCategory);
  error = '';
  saving = false;
  loadingOdometer = false;

  part: Partial<WearPart> = {};

  ngOnInit(): void {
    if (this.editMode && this.existingPart) {
      this.part = { ...this.existingPart };
    } else {
      this.part = {
        radId: this.radId,
        name: '',
        kategorie: WearPartCategory.Sonstiges,
        einbauKilometerstand: this.currentKilometerstand,
        ausbauKilometerstand: 0,
        einbauDatum: new Date(),
        ausbauDatum: undefined as any
      };
    }
  }

  get einbauDatumStr(): string {
    if (!this.part.einbauDatum) return '';
    const d = new Date(this.part.einbauDatum);
    return d.toISOString().substring(0, 10);
  }

  set einbauDatumStr(val: string) {
    this.part.einbauDatum = val ? new Date(val) : undefined as any;
    const user = this.authService.currentUser;
    if (val && this.radId && user) {
      this.loadingOdometer = true;
      this.bikeService.getOdometerAt(this.radId, val, user.id).subscribe({
        next: (km) => {
          this.part.einbauKilometerstand = km;
          this.loadingOdometer = false;
        },
        error: () => {
          this.loadingOdometer = false;
        }
      });
    }
  }

  get ausbauDatumStr(): string {
    if (!this.part.ausbauDatum) return '';
    const d = new Date(this.part.ausbauDatum);
    return d.toISOString().substring(0, 10);
  }

  set ausbauDatumStr(val: string) {
    this.part.ausbauDatum = val ? new Date(val) : undefined as any;
  }

  save(): void {
    if (!this.part.name?.trim()) {
      this.error = 'Bitte einen Namen angeben.';
      return;
    }
    this.saving = true;
    const request$ = this.editMode && this.part.id
      ? this.wearPartService.updateWearPart(this.part.id, this.part as WearPart)
      : this.wearPartService.addWearPart(this.part as WearPart);
    request$.subscribe({
      next: () => {
        this.saving = false;
        this.saved.emit();
      },
      error: () => {
        this.error = 'Fehler beim Speichern des Verschleißteils.';
        this.saving = false;
      }
    });
  }

  constructor(
    private wearPartService: WearPartService,
    private bikeService: BikeService,
    private authService: AuthService
  ) {}
}
