import { Component, computed, inject, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WorkOrderStore } from '../core/work-order.store';
import { WorkOrder } from '../domain/models';
import {
  SmartLabelComponent,
  TimelineComponent,
  dateShort,
  relativeTime,
} from '../shared/presentation';

@Component({
  standalone: true,
  imports: [RouterLink, SmartLabelComponent, TimelineComponent, UpperCasePipe],
  template: `@if (order(); as o) {
    <a routerLink="/orders" class="text-sm font-bold text-blue-700">← Órdenes</a>
    <header class="mt-5 flex flex-wrap items-start justify-between gap-5">
      <div>
        <p class="technical-id text-[11px] font-bold tracking-[.12em] text-slate-500">
          OT #{{ o.number }}
        </p>
        <h1 class="page-title">{{ store.type(o)?.name }}</h1>
        <p class="page-subtitle">{{ store.dentist(o)?.name }} · {{ o.patientReference }}</p>
        <div class="hidden">
          <span
            class="rounded-sm px-2 py-1 text-[11px] font-bold"
            [class.location-lab]="o.location === 'LAB'"
            [class.location-dentist]="o.location === 'DENTIST'"
            >{{ o.location === 'LAB' ? 'EN LABORATORIO' : 'EN CONSULTORIO' }}</span
          ><span class="rounded-sm bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">{{
            store.stage(o)?.name | uppercase
          }}</span>
        </div>
      </div>
      <div class="border-l border-slate-200 pl-5">
        <p class="section-label">Entrega</p>
        <p
          class="technical-id mt-1 text-2xl font-bold tracking-tight"
          [class.text-red-600]="isNear(o.dueDate)"
        >
          {{ dateShort(o.dueDate) }}
        </p>
      </div>
    </header>
    <section class="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div class="space-y-8">
        <section class="border-y border-slate-200 py-6">
          <p class="section-label">Estado actual</p>
          <div class="mt-4 grid gap-5 border-y border-slate-200 py-5 sm:grid-cols-3">
            <div>
              <p class="section-label">Ubicación actual</p>
              <p class="mt-2 text-lg font-bold" [class.text-violet-700]="o.location === 'DENTIST'">
                {{ o.location === 'LAB' ? 'En laboratorio' : 'En consultorio' }}
              </p>
            </div>
            <div>
              <p class="section-label">Etapa actual</p>
              <p class="mt-2 text-xl font-bold">{{ store.stage(o)?.name }}</p>
            </div>
            <div>
              <p class="section-label">Siguiente</p>
              <p class="mt-2 text-lg font-bold">{{ nextMovement(o) }}</p>
            </div>
          </div>
          <div class="hidden">
            <div>
              <p class="text-sm font-semibold text-slate-600">
                {{ o.location === 'LAB' ? 'En laboratorio' : 'En consultorio' }}
              </p>
              <p class="mt-1 text-3xl font-bold tracking-tight">{{ store.stage(o)?.name }}</p>
              <p class="mt-2 text-sm text-slate-500">
                Último movimiento · {{ relativeTime(o.lastMovementAt) }}
              </p>
            </div>
            <div class="sm:text-right">
              <p class="section-label">Entrega</p>
              <p
                class="technical-id mt-1 text-xl font-bold"
                [class.text-red-600]="isNear(o.dueDate)"
              >
                {{ dateShort(o.dueDate) }}
              </p>
            </div>
          </div>
          <div class="hidden">
            @if (o.location === 'LAB') {
              <button (click)="store.advance(o.id)" class="button-primary">
                ✓ Terminé mi etapa</button
              ><button (click)="store.sendToDentist(o.id)" class="button-secondary">
                Sale al consultorio
              </button>
            } @else {
              <button (click)="store.returnToLab(o.id)" class="button-primary">
                ✓ Regresó al laboratorio
              </button>
            }
            <button (click)="rework.set(!rework())" class="button-secondary">
              Registrar corrección
            </button>
          </div>
          <div class="mt-6 flex flex-wrap gap-2">
            <button
              (click)="performPrimary(o)"
              [disabled]="o.operationalStatus === 'COMPLETED'"
              class="button-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ primaryLabel(o) }}
            </button>
            <button (click)="rework.set(!rework())" class="button-secondary">
              Registrar corrección
            </button>
          </div>
          @if (rework()) {
            <div class="mt-4 flex gap-2">
              <input #reason class="flex-1 px-3" placeholder="Motivo de corrección" /><button
                (click)="store.rework(o.id, store.stages(o)[0].id, reason.value); rework.set(false)"
                class="button-secondary"
              >
                Guardar
              </button>
            </div>
          }
        </section>
        <section>
          <p class="section-label">Información del trabajo</p>
          <dl class="mt-4 grid gap-x-10 gap-y-6 border-y border-slate-200 py-5 sm:grid-cols-2">
            <div class="detail-field">
              <dt>Odontólogo</dt>
              <dd>{{ store.dentist(o)?.name }}</dd>
            </div>
            <div class="detail-field">
              <dt>Paciente / referencia</dt>
              <dd>{{ o.patientReference }}</dd>
            </div>
            <div class="detail-field">
              <dt>Tipo</dt>
              <dd>{{ store.type(o)?.name }}</dd>
            </div>
            <div class="detail-field">
              <dt>Color</dt>
              <dd>{{ o.color || '—' }}</dd>
            </div>
            <div class="detail-field">
              <dt>Ingreso</dt>
              <dd>{{ dateShort(o.createdAt) }}</dd>
            </div>
            <div class="detail-field detail-field--key">
              <dt>Entrega</dt>
              <dd [class.text-red-600]="isNear(o.dueDate)">{{ dateShort(o.dueDate) }}</dd>
            </div>
            <div class="detail-field">
              <dt>Prioridad</dt>
              <dd [class.text-red-600]="o.priority === 'URGENT'">
                {{ o.priority === 'URGENT' ? 'Urgente' : 'Normal' }}
              </dd>
            </div>
            @if (o.patientAge) {
              <div class="detail-field">
                <dt>Edad</dt>
                <dd>{{ o.patientAge }} años</dd>
              </div>
            }
          </dl>
          @if (o.workDescription) {
            <div class="mt-6 border-l-2 border-blue-500 bg-blue-50/60 px-5 py-4">
              <p class="section-label text-blue-700">Indicaciones</p>
              <p class="mt-2 whitespace-pre-line leading-6 text-slate-700">
                {{ o.workDescription }}
              </p>
            </div>
          }
        </section>
        <section>
          <p class="section-label">Actividad</p>
          <h2 class="mt-1 text-xl font-bold">Historia operacional</h2>
          <app-timeline class="mt-4 border border-slate-200" [events]="o.timeline" />
        </section>
      </div>
      <aside class="h-fit border border-slate-200 bg-slate-50 p-4">
        <p class="section-label">Smart Label</p>
        <app-smart-label class="mt-3 block" [order]="o" />
      </aside>
    </section>
  }`,
})
export class ModernOrderDetailPage {
  store = inject(WorkOrderStore);
  route = inject(ActivatedRoute);
  order = computed(() => this.store.order(this.route.snapshot.paramMap.get('id') ?? ''));
  rework = signal(false);
  dateShort = dateShort;
  relativeTime = relativeTime;
  nextMovement(order: WorkOrder) {
    return this.store.transition(order).nextLabel;
  }
  primaryLabel(order: WorkOrder) {
    return this.store.transition(order).primaryLabel;
  }
  performPrimary(order: WorkOrder) {
    return this.store.applyPrimaryTransition(order);
  }
  isNear(value: string) {
    return new Date(value).getTime() - Date.now() < 3 * 86400000;
  }
}
