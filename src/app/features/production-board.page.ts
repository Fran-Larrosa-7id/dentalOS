import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WorkOrderStore } from '../core/work-order.store';
import { OrderCardComponent } from '../shared/presentation';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, OrderCardComponent, IconComponent],
  styles: `
    .production-tab {
      border: 1px solid #dfe5ee;
      border-radius: 6px;
      background: #fff;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 700;
    }
    .production-tab--all {
      color: #2554e8;
    }
    .production-tab--lab {
      color: #1e3a8a;
    }
    .production-tab--dentist {
      color: #6d28d9;
    }
    .production-tab--urgent {
      color: #dc2626;
    }
    .production-tab--delay {
      color: #d97706;
    }
    .production-tab--active {
      border-color: currentColor;
      box-shadow: inset 0 0 0 1px currentColor;
    }
    .production-tab:hover {
      border-color: currentColor;
      background: #f8fafc;
    }
  `,
  template: `
    <header class="grid gap-6 xl:grid-cols-[1fr_510px] xl:items-end">
      <div>
        <p class="page-kicker">Operación</p>
        <h1 class="page-title">Producción</h1>
        <p class="page-subtitle">Todo el trabajo físico, ordenado por etapa y ubicación.</p>
      </div>
      <label class="relative block"
        ><app-icon
          name="expand"
          class="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500"
        /><input
          [(ngModel)]="query"
          class="w-full pl-11 pr-12"
          placeholder="Buscar OT, odontólogo o referencia..."
        /><kbd
          class="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 px-1.5 py-0.5 text-xs text-slate-500"
          >/</kbd
        ></label
      >
    </header>
    <section class="mt-7 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap gap-1">
        @for (tab of tabs; track tab.id) {
          <button
            [class]="
              'production-tab production-tab--' +
              tab.id +
              (filter() === tab.id ? ' production-tab--active' : '')
            "
            (click)="filter.set(tab.id)"
          >
            {{ tab.name }}
          </button>
        }
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="button-secondary text-xs">Técnico⌄</button
        ><button class="button-secondary text-xs">Odontólogo⌄</button
        ><button class="button-secondary text-xs">Tipo⌄</button
        ><button class="button-secondary text-xs">Entrega⌄</button>
      </div>
    </section>
    <section class="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div>
        <p class="section-label mb-3">En laboratorio</p>
        <div class="space-y-7">
          @for (workflow of workflowBoards(); track workflow.id) {
            <section>
              <button
                (click)="toggleWorkflow(workflow.id)"
                class="flex w-full items-center justify-between border-b-2 border-slate-300 pb-3 text-left"
              >
                <span
                  ><span class="section-label text-blue-700">Workflow</span>
                  <h2 class="mt-1 text-xl font-bold uppercase tracking-tight">
                    {{ workflow.name }}
                    <span class="text-sm font-medium text-slate-500"
                      >· {{ workflow.orders.length }} trabajos</span
                    >
                  </h2></span
                >
                <app-icon
                  name="chevron"
                  class="size-4 transition"
                  [class.rotate-90]="!isCollapsed(workflow.id)"
                />
              </button>
              @if (!isCollapsed(workflow.id)) {
                <div class="mt-3 space-y-3">
                  @for (group of workflow.groups; track group.id) {
                    <section class="overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <header
                        class="flex items-center justify-between border-b border-slate-200 px-4 py-3"
                      >
                        <span class="flex items-center gap-4"
                          ><span class="technical-id text-xl font-bold text-blue-700"
                            >0{{ group.order }}</span
                          ><span class="font-bold uppercase tracking-wide">{{
                            group.name
                          }}</span></span
                        ><span class="text-sm text-slate-500"
                          >{{ group.orders.length }}
                          {{ group.orders.length === 1 ? 'trabajo' : 'trabajos' }}</span
                        >
                      </header>
                      <div
                        class="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3"
                      >
                        @for (stage of group.stages; track stage.id) {
                          <div class="min-w-0 p-4">
                            <div class="mb-3 flex items-center justify-between">
                              <p
                                class="text-[11px] font-bold uppercase tracking-wide text-slate-500"
                              >
                                {{ stage.name }}
                              </p>
                              <span class="text-slate-500">•••</span>
                            </div>
                            <div class="space-y-2">
                              @for (order of stage.orders; track order.id) {
                                <app-order-card [order]="order" />
                              } @empty {
                                <div
                                  class="grid min-h-28 place-items-center rounded border border-dashed border-slate-300 text-center text-xs text-slate-400"
                                >
                                  <span>⌑<span class="mt-2 block">Sin trabajos</span></span>
                                </div>
                              }
                            </div>
                          </div>
                        }
                      </div>
                    </section>
                  }
                </div>
              }
            </section>
          }
        </div>
      </div>
      <aside class="border-l border-slate-300 pl-4">
        <p class="section-label">Fuera del laboratorio</p>
        <section class="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <header class="border-b border-slate-200 px-4 py-3">
            <h2 class="text-xl font-bold text-violet-700">Esperando devolución</h2>
          </header>
          <div class="divide-y divide-slate-200">
            @for (order of dentistOrders(); track order.id) {
              <a
                [routerLink]="['/orders', order.id]"
                class="block cursor-pointer p-4 transition hover:bg-violet-50/50"
              >
                <div class="flex items-start justify-between">
                  <p class="technical-id text-xs font-bold text-slate-500">
                    OT #{{ order.number }}
                  </p>
                  @if (order.priority === 'URGENT') {
                    <span class="text-xs font-bold text-red-600">URGENTE</span>
                  }
                </div>
                <p class="mt-3 font-bold">{{ store.type(order)?.name }}</p>
                <p class="mt-1 text-sm text-slate-600">
                  {{ store.dentist(order)?.name }} · {{ order.patientReference }}
                </p>
                <p class="mt-3 flex items-center gap-2 text-sm text-violet-700">
                  <span class="size-1.5 rounded-full bg-violet-600"></span>En consultorio
                </p>
                <div class="mt-5 flex items-center justify-between text-sm">
                  <span class="font-medium">{{ store.stage(order)?.name }}</span
                  ><span class="technical-id font-semibold text-slate-600">{{
                    dateShort(order.dueDate)
                  }}</span>
                </div>
              </a>
            } @empty {
              <p class="p-5 text-sm text-slate-500">No hay trabajos fuera del laboratorio.</p>
            }
          </div>
          <a
            routerLink="/orders"
            class="block border-t border-slate-200 px-4 py-4 text-sm font-bold text-blue-700"
            >Ver todas ({{ dentistOrders().length }})　→</a
          >
        </section>
      </aside>
    </section>
  `,
})
export class ProductionBoardPage {
  readonly store = inject(WorkOrderStore);
  readonly filter = signal('all');
  query = '';
  readonly dateShort = (value: string) =>
    new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' })
      .format(new Date(value))
      .replace('.', '')
      .toUpperCase();
  readonly tabs = [
    { id: 'all', name: 'Todos' },
    { id: 'lab', name: 'Laboratorio' },
    { id: 'dentist', name: 'Consultorio' },
    { id: 'urgent', name: 'Urgentes' },
    { id: 'delay', name: 'Con demora' },
  ];
  orders() {
    const f = this.filter(),
      q = this.query.toLowerCase();
    return this.store
      .orders()
      .filter(
        (o) =>
          (!q ||
            `${o.number} ${o.patientReference} ${this.store.dentist(o)?.name}`
              .toLowerCase()
              .includes(q)) &&
          (f === 'all' ||
            (f === 'lab' && o.location === 'LAB') ||
            (f === 'dentist' && o.location === 'DENTIST') ||
            (f === 'urgent' && o.priority === 'URGENT') ||
            (f === 'delay' && new Date(o.dueDate) < new Date())),
      );
  }
  readonly collapsedWorkflows = signal<Set<string>>(new Set());
  readonly workflowBoards = computed(() =>
    this.store.workflows.map((workflow) => {
      const workflowOrders = this.orders().filter((o) => o.workflowId === workflow.id);
      return {
        id: workflow.id,
        name: workflow.name,
        orders: workflowOrders,
        groups: workflow.groups.map((group) => ({
          ...group,
          stages: group.stages.map((stage) => ({
            ...stage,
            orders: workflowOrders.filter(
              (order) => order.location === 'LAB' && order.currentStageId === stage.id,
            ),
          })),
          orders: workflowOrders.filter(
            (order) =>
              order.location === 'LAB' &&
              group.stages.some((stage) => stage.id === order.currentStageId),
          ),
        })),
      };
    }),
  );
  isCollapsed(id: string) {
    return this.collapsedWorkflows().has(id);
  }
  toggleWorkflow(id: string) {
    this.collapsedWorkflows.update((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  readonly dentistOrders = computed(() => this.orders().filter((o) => o.location === 'DENTIST'));
}
