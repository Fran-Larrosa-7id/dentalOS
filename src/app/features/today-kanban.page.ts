import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkOrderStore } from '../core/work-order.store';
import { WorkOrder } from '../domain/models';
import { OrderCardComponent } from '../shared/presentation';

@Component({
  standalone: true,
  imports: [RouterLink, OrderCardComponent],
  template: `
    <header class="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p class="page-kicker">Vista general · hoy</p>
        <h1 class="page-title">Buenos días</h1>
        <p class="page-subtitle">{{ today }}</p>
      </div>
      <a routerLink="/orders/new" class="button-primary">＋ Nueva orden</a>
    </header>
    <section
      class="mt-8 grid divide-y divide-slate-200 border-y border-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0"
    >
      <a routerLink="/production" class="stat-card"
        ><p class="section-label">Para hoy</p>
        <p class="mt-2 text-3xl font-bold">{{ dueToday().length }}</p>
        <p class="mt-1 text-sm text-slate-500">Trabajos con entrega hoy</p></a
      >
      <a routerLink="/production" class="stat-card"
        ><p class="section-label text-violet-700">En consultorio</p>
        <p class="mt-2 text-3xl font-bold text-violet-700">{{ store.dentistOrders().length }}</p>
        <p class="mt-1 text-sm text-slate-500">Esperando devolución</p></a
      >
      <a routerLink="/production" class="stat-card"
        ><p class="section-label text-red-600">Necesitan atención</p>
        <p class="mt-2 text-3xl font-bold text-red-600">{{ attention().length }}</p>
        <p class="mt-1 text-sm text-slate-500">Revisar ahora</p></a
      >
    </section>
    <section class="mt-10">
      <div class="flex items-end justify-between">
        <div>
          <p class="section-label">Prioridad operativa</p>
          <h2 class="mt-1 text-xl font-bold">Necesitan atención</h2>
        </div>
        <a routerLink="/production" class="text-sm font-bold text-blue-700">Ver producción →</a>
      </div>
      <div class="mt-5 grid gap-5 xl:grid-cols-3">
        <section class="min-h-[430px] border border-slate-200 bg-white p-4">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 class="text-sm font-bold uppercase tracking-wide text-red-600">Urgente</h3>
            <span
              class="grid h-6 min-w-6 place-items-center rounded-full bg-red-600 px-1 text-xs font-bold text-white"
              >{{ urgent().length }}</span
            >
          </div>
          <div class="space-y-2 pt-3">
            @for (order of urgent(); track order.id) {
              <div class="border-l-[3px] border-red-500"><app-order-card [order]="order" /></div>
            } @empty {
              <p class="py-12 text-center text-sm text-slate-400">Sin trabajos urgentes</p>
            }
          </div>
        </section>
        <section class="min-h-[430px] border border-slate-200 bg-white p-4">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 class="text-sm font-bold uppercase tracking-wide text-orange-500">Atención</h3>
            <span
              class="grid h-6 min-w-6 place-items-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white"
              >{{ needsAttention().length }}</span
            >
          </div>
          <div class="space-y-2 pt-3">
            @for (order of needsAttention(); track order.id) {
              <div class="border-l-[3px] border-orange-400"><app-order-card [order]="order" /></div>
            } @empty {
              <p class="py-12 text-center text-sm text-slate-400">Sin trabajos para revisar</p>
            }
          </div>
        </section>
        <section class="min-h-[430px] border border-slate-200 bg-white p-4">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 class="text-sm font-bold uppercase tracking-wide text-blue-600">Información</h3>
            <span
              class="grid h-6 min-w-6 place-items-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white"
              >{{ information().length }}</span
            >
          </div>
          <div class="space-y-2 pt-3">
            @for (order of information(); track order.id) {
              <div class="border-l-[3px] border-blue-600"><app-order-card [order]="order" /></div>
            } @empty {
              <div class="grid min-h-70 place-items-center text-center text-sm text-slate-400">
                <span class="text-2xl"
                  >⌑<span class="mt-3 block text-sm">Sin trabajos en este estado</span></span
                >
              </div>
            }
          </div>
        </section>
      </div>
    </section>
  `,
})
export class KanbanTodayPage {
  readonly store = inject(WorkOrderStore);
  readonly today = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  readonly dueToday = computed(() =>
    this.store
      .orders()
      .filter((o) => new Date(o.dueDate).toDateString() === new Date().toDateString()),
  );
  readonly overdue = (o: WorkOrder) => new Date(o.dueDate) < new Date();
  readonly dueSoon = (o: WorkOrder) =>
    new Date(o.dueDate).getTime() - Date.now() < 86400000 && o.operationalStatus !== 'COMPLETED';
  readonly urgent = computed(() =>
    this.store
      .orders()
      .filter((o) => o.priority === 'URGENT' || this.overdue(o))
      .slice(0, 5),
  );
  readonly attention = computed(() =>
    this.store
      .orders()
      .filter(
        (o) =>
          this.overdue(o) ||
          (o.location === 'DENTIST' &&
            Date.now() - new Date(o.lastMovementAt).getTime() > 604800000) ||
          this.dueSoon(o),
      ),
  );
  readonly needsAttention = computed(() =>
    this.attention()
      .filter((o) => !this.urgent().some((item) => item.id === o.id))
      .slice(0, 5),
  );
  readonly information = computed(() =>
    this.store
      .orders()
      .filter((o) => o.location === 'DENTIST' && !this.urgent().some((item) => item.id === o.id))
      .slice(0, 5),
  );
}
