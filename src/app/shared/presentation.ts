import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import QRCode from 'qrcode';
import { WorkOrder } from '../domain/models';
import { WorkOrderStore } from '../core/work-order.store';
import { PublicUrlService } from '../core/public-url.service';
import { IconComponent } from './icon/icon.component';

export const dateShort = (value: string) =>
  new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' })
    .format(new Date(value))
    .replace('.', '')
    .toUpperCase();
export const relativeTime = (value: string) => {
  const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86400000));
  return days === 0 ? 'Hoy' : `Hace ${days} día${days === 1 ? '' : 's'}`;
};

@Component({
  selector: 'app-order-card',
  imports: [RouterLink],
  template: ` <a
    [routerLink]="['/orders', order.id]"
    class="block border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm"
    [class.border-l-red-500]="tone === 'urgent'"
    [class.border-l-orange-400]="tone === 'attention'"
    [class.border-l-blue-600]="tone === 'info'"
    [class.border-l-[3px]]="tone !== 'default'"
  >
    <div class="flex items-start justify-between gap-2">
      <span class="technical-id text-[11px] font-bold text-slate-500">OT #{{ order.number }}</span
      ><span class="text-[11px] font-bold" [class.text-red-700]="order.priority === 'URGENT'">{{
        order.priority === 'URGENT' ? 'URGENTE' : ''
      }}</span>
    </div>
    <p class="mt-2 font-bold text-slate-900">{{ store.type(order)?.name }}</p>
    <p class="text-sm text-slate-500">
      {{ store.dentist(order)?.name }} · {{ order.patientReference }}
    </p>
    <div class="mt-3 flex items-center justify-between text-xs">
      <span class="font-semibold text-slate-700">{{ store.stage(order)?.name }}</span
      ><span [class.text-red-600]="isDue(order)" class="font-semibold text-slate-500">{{
        dateShort(order.dueDate)
      }}</span>
    </div>
  </a>`,
})
export class OrderCardComponent {
  @Input({ required: true }) order!: WorkOrder;
  @Input() tone: 'default' | 'urgent' | 'attention' | 'info' = 'default';
  readonly store = inject(WorkOrderStore);
  readonly dateShort = dateShort;
  isDue(order: WorkOrder) {
    return new Date(order.dueDate) <= new Date(Date.now() + 86400000);
  }
}

@Component({
  selector: 'app-timeline',
  imports: [CommonModule, DatePipe, IconComponent],
  template: ` <ol class="ml-3 border-l border-slate-200 pl-5">
    @for (event of events.slice().reverse(); track event.id) {
      <li class="relative mb-6 last:mb-0">
        <span
          class="absolute -left-[27px] top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-blue-600 text-white"
          ><app-icon [name]="icon(event.type)" class="size-3"
        /></span>
        <div class="flex items-baseline justify-between gap-3">
          <p class="text-sm font-semibold text-slate-800">{{ label(event.type) }}</p>
          <time class="shrink-0 text-xs text-slate-400">{{
            event.timestamp | date: 'HH:mm' : '' : 'es-AR'
          }}</time>
        </div>
        @if (event.note) {
          <p class="mt-1 text-sm text-slate-500">{{ event.note }}</p>
        }
        @if (event.reworkReason) {
          <p class="mt-1 text-sm text-amber-700">{{ event.reworkReason }}</p>
        }
        <time class="mt-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">{{
          event.timestamp | date: 'd MMM' : '' : 'es-AR'
        }}</time>
      </li>
    }
  </ol>`,
})
export class TimelineComponent {
  @Input({ required: true }) events!: WorkOrder['timeline'];
  label(type: string) {
    return (
      (
        {
          CREATED: 'Trabajo recibido',
          STAGE_COMPLETED: 'Etapa completada',
          STAGE_CHANGED: 'Etapa actualizada',
          SENT_TO_DENTIST: 'Enviado al consultorio',
          RETURNED_TO_LAB: 'Regresó al laboratorio',
          REWORK_REQUESTED: 'Corrección registrada',
          PHOTO_ADDED: 'Foto agregada',
          NOTE_ADDED: 'Nota agregada',
          COMPLETED: 'Trabajo completado',
        } as Record<string, string>
      )[type] ?? type
    );
  }
  icon(type: string) {
    return (
      (
        {
          CREATED: 'document',
          STAGE_COMPLETED: 'check',
          STAGE_CHANGED: 'chevron',
          SENT_TO_DENTIST: 'share',
          RETURNED_TO_LAB: 'arrow',
          REWORK_REQUESTED: 'copy',
          PHOTO_ADDED: 'copy',
          NOTE_ADDED: 'document',
          COMPLETED: 'check',
        } as const
      )[type as keyof Record<string, string>] ?? 'document'
    );
  }
}

@Component({
  selector: 'app-smart-label',
  imports: [CommonModule],
  template: ` <section
      class="label-print mx-auto max-w-sm border-2 border-slate-900 bg-white p-5 text-slate-950"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs font-black tracking-[.24em]">DENTALOS</p>
          <h3 class="mt-2 text-2xl font-black">OT #{{ order.number }}</h3>
        </div>
        <p class="text-sm font-bold">{{ dateShort(order.dueDate) }}</p>
      </div>
      <div class="mt-5 border-y border-slate-300 py-3 text-sm">
        <p class="font-bold">{{ store.dentist(order)?.name }}</p>
        <p>{{ order.patientReference }} · {{ store.type(order)?.name }}</p>
        @if (order.color) {
          <p>Color {{ order.color }}</p>
        }
      </div>
      <div class="mt-5 flex items-end justify-between gap-4">
        <div>
          <p class="text-[10px] font-bold tracking-widest">ENTREGA</p>
          <p class="text-lg font-black">{{ dateShort(order.dueDate) }}</p>
        </div>
        @if (qrData()) {
          <img [src]="qrData()" class="h-28 w-28" alt="Código QR para abrir esta orden" />
        }
      </div>
    </section>
    <button
      class="mt-4 border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50 print:hidden"
      (click)="print()"
    >
      Imprimir etiqueta
    </button>`,
})
export class SmartLabelComponent {
  private _order!: WorkOrder;
  @Input({ required: true }) set order(value: WorkOrder) {
    this._order = value;
    void this.generate(value.qrToken);
  }
  get order() {
    return this._order;
  }
  readonly store = inject(WorkOrderStore);
  private readonly publicUrl = inject(PublicUrlService);
  readonly qrData = signal('');
  readonly dateShort = dateShort;
  async generate(token: string) {
    if (typeof window === 'undefined' || !token) return;
    this.qrData.set(
      await QRCode.toDataURL(this.publicUrl.qrUrl(token), {
        width: 256,
        margin: 1,
        errorCorrectionLevel: 'M',
      }),
    );
  }
  print() {
    window.print();
  }
}
