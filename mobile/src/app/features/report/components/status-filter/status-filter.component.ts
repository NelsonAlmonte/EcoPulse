import { Component, output } from '@angular/core';
import { IonRippleEffect } from '@ionic/angular/standalone';
import { Status } from '@shared/constants/system.constant';
import {
  Circle,
  CircleCheck,
  CircleDot,
  CircleEllipsis,
  CircleX,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.css'],
  standalone: true,
  imports: [IonRippleEffect, LucideAngularModule],
})
export class StatusFilterComponent {
  filterSelected = output<Status>();
  selectedFilter: Status = 'TODO';
  filters = [
    {
      value: 'TODO',
      label: 'Todos',
      icon: Circle,
    },
    {
      value: 'PENDIENTE',
      label: 'Pendientes',
      icon: CircleDot,
    },
    {
      value: 'EN_PROCESO',
      label: 'En proceso',
      icon: CircleEllipsis,
    },
    {
      value: 'RESUELTO',
      label: 'Resueltos',
      icon: CircleCheck,
    },
    {
      value: 'DESCARTADO',
      label: 'Descartados',
      icon: CircleX,
    },
  ] as const;

  selectFilter(filter: Status): void {
    this.selectedFilter = filter;
    this.filterSelected.emit(filter);
  }
}
