import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WorkOrderStore } from '../core/work-order.store';
import {
  OrderCardComponent,
  SmartLabelComponent,
  TimelineComponent,
  dateShort,
  relativeTime,
} from '../shared/presentation';
import { DatePickerComponent } from '../shared/date-picker';
import { WorkOrder } from '../domain/models';

@Component({
  standalone: true,
  imports: [RouterLink, OrderCardComponent],
  template: ` <header class="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p class="page-kicker">Vista general · hoy</p>
        <h1 class="page-title">Buenos días</h1>
        <p class="page-subtitle">{{ today }}</p>
      </div>
      <a routerLink="/orders/new" class="button-primary">+ Nueva orden</a>
    </header>
    <section class="mt-8 grid gap-4 md:grid-cols-3">
      <a routerLink="/production" class="stat-card"
        ><p class="section-label">Para hoy</p>
        <p class="mt-2 text-3xl font-bold">{{ dueToday().length }}</p>
        <p class="mt-1 text-sm text-slate-500">Trabajos con entrega hoy</p></a
      ><a routerLink="/production" class="stat-card"
        ><p class="section-label">En consultorio</p>
        <p class="mt-2 text-3xl font-bold text-violet-700">{{ store.dentistOrders().length }}</p>
        <p class="mt-1 text-sm text-slate-500">Esperando devolución</p></a
      ><a routerLink="/production" class="stat-card"
        ><p class="section-label">Necesitan atención</p>
        <p class="mt-2 text-3xl font-bold text-red-600">{{ attention().length }}</p>
        <p class="mt-1 text-sm text-slate-500">Revisar ahora</p></a
      >
    </section>
    <section class="mt-10">
      <div class="flex items-center justify-between">
        <div>
          <p class="section-label">Prioridad operativa</p>
          <h2 class="mt-1 text-xl font-bold">Necesitan atención</h2>
        </div>
        <a routerLink="/production" class="text-sm font-bold text-blue-700">Ver producción →</a>
      </div>
      <div class="mt-5 grid gap-4 lg:grid-cols-3">
        @for (order of attention(); track order.id) {
          <app-order-card [order]="order" />
        } @empty {
          <p class="surface p-5 text-sm text-slate-500">
            No hay trabajos que requieran atención inmediata.
          </p>
        }
      </div>
    </section>`,
})
export class TodayPage {
  store = inject(WorkOrderStore);
  today = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  attention = computed(() =>
    this.store
      .orders()
      .filter(
        (o) =>
          this.overdue(o) ||
          (o.location === 'DENTIST' &&
            Date.now() - new Date(o.lastMovementAt).getTime() > 604800000) ||
          this.dueSoon(o),
      )
      .slice(0, 6),
  );
  dueToday = computed(() =>
    this.store
      .orders()
      .filter((o) => new Date(o.dueDate).toDateString() === new Date().toDateString()),
  );
  overdue = (o: WorkOrder) => new Date(o.dueDate) < new Date();
  dueSoon = (o: WorkOrder) =>
    new Date(o.dueDate).getTime() - Date.now() < 86400000 && o.operationalStatus !== 'COMPLETED';
}

@Component({
  standalone: true,
  imports: [FormsModule, OrderCardComponent],
  template: ` <header>
      <p class="page-kicker">Operación</p>
      <h1 class="page-title">Producción</h1>
      <p class="page-subtitle">Todo el trabajo físico, ordenado por etapa y ubicación.</p>
    </header>
    <section class="mt-7 surface p-4">
      <div class="flex flex-wrap gap-3">
        <input
          [(ngModel)]="query"
          class="min-w-60 flex-1 px-3"
          placeholder="Buscar OT, odontólogo o referencia..."
        /><button class="button-primary">Buscar</button>
      </div>
      <div class="mt-4 flex flex-wrap gap-x-6 gap-y-1">
        @for (tab of tabs; track tab.id) {
          <button class="tab" [class.active]="filter() === tab.id" (click)="filter.set(tab.id)">
            {{ tab.name }}
          </button>
        }
      </div>
      <div class="mt-3 flex gap-2">
        <button class="button-secondary text-xs">Técnico ▾</button
        ><button class="button-secondary text-xs">Odontólogo ▾</button
        ><button class="button-secondary text-xs">Tipo ▾</button
        ><button class="button-secondary text-xs">Entrega ▾</button>
      </div>
    </section>
    <section class="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div>
        <p class="section-label mb-3">En laboratorio</p>
        <div class="space-y-4">
          @for (group of groups(); track group.id) {
            <section class="surface overflow-hidden">
              <button
                class="flex w-full items-center justify-between bg-slate-50 px-5 py-4 text-left"
              >
                <span class="font-bold tracking-wide">{{ group.name.toUpperCase() }}</span
                ><span class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-sm">{{
                  group.orders.length
                }}</span>
              </button>
              <div class="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                @for (stage of group.stages; track stage.id) {
                  <div>
                    <p class="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                      {{ stage.name }}
                    </p>
                    <div class="space-y-2">
                      @for (order of stage.orders; track order.id) {
                        <app-order-card [order]="order" />
                      } @empty {
                        <p class="rounded-lg bg-slate-50 p-3 text-xs text-slate-400">
                          Sin trabajos en esta etapa.
                        </p>
                      }
                    </div>
                  </div>
                }
              </div>
            </section>
          }
        </div>
      </div>
      <aside class="rounded-xl border border-violet-200 bg-violet-50 p-5">
        <p class="section-label text-violet-700">En consultorio</p>
        <h2 class="mt-1 text-lg font-bold text-violet-950">Esperando devolución</h2>
        <div class="mt-4 space-y-3">
          @for (order of dentistOrders(); track order.id) {
            <app-order-card [order]="order" />
          } @empty {
            <p class="text-sm text-violet-700">No hay trabajos fuera del laboratorio.</p>
          }
        </div>
      </aside>
    </section>`,
})
export class ProductionPage {
  store = inject(WorkOrderStore);
  filter = signal('all');
  query = '';
  tabs = [
    { id: 'all', name: 'Todos' },
    { id: 'lab', name: 'Laboratorio' },
    { id: 'dentist', name: 'Consultorio' },
    { id: 'urgent', name: 'Urgentes' },
    { id: 'delay', name: 'Con demora' },
  ];
  orders() {
    let f = this.filter(),
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
  groups = computed(() =>
    this.store.workflows[0].groups.map((g) => ({
      ...g,
      stages: g.stages.map((s) => ({
        ...s,
        orders: this.orders().filter((o) => o.location === 'LAB' && o.currentStageId === s.id),
      })),
      orders: this.orders().filter(
        (o) => o.location === 'LAB' && g.stages.some((s) => s.id === o.currentStageId),
      ),
    })),
  );
  dentistOrders = computed(() => this.orders().filter((o) => o.location === 'DENTIST'));
}
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, SmartLabelComponent],
  template: `<header>
      <p class="page-kicker">Nueva orden</p>
      <h1 class="page-title">Registrá un nuevo trabajo en segundos</h1>
      <p class="page-subtitle">Lo esencial para identificarlo, producirlo y entregarlo.</p>
    </header>
    <section class="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <form [formGroup]="form" (ngSubmit)="submit()" class="surface grid gap-5 p-6 sm:grid-cols-2">
        <label class="input-label sm:col-span-2"
          >Odontólogo<select formControlName="dentistId">
            <option value="">Seleccionar odontólogo</option>
            @for (d of store.dentists; track d.id) {
              <option [value]="d.id">{{ d.name }}</option>
            }
          </select></label
        ><label class="input-label sm:col-span-2"
          >Paciente / referencia<input
            formControlName="patientReference"
            placeholder="Ej. MG" /></label
        ><label class="input-label sm:col-span-2"
          >Tipo de trabajo<select formControlName="workTypeId">
            <option value="">Seleccionar tipo</option>
            @for (t of store.workTypes; track t.id) {
              <option [value]="t.id">{{ t.name }}</option>
            }
          </select></label
        ><label class="input-label">Color<input formControlName="color" placeholder="A2" /></label
        ><label class="input-label"
          >Fecha de entrega<input formControlName="dueDate" type="date" /></label
        ><label class="input-label sm:col-span-2"
          >Prioridad<select formControlName="priority">
            <option value="STANDARD">Estándar</option>
            <option value="URGENT">Urgente</option>
          </select></label
        ><button
          [disabled]="form.invalid"
          class="button-primary justify-self-start disabled:opacity-50"
        >
          Crear orden e imprimir etiqueta
        </button>
      </form>
      <aside class="surface p-5">
        <p class="section-label">Previsualización de etiqueta</p>
        <p class="mt-3 text-sm text-slate-500">La etiqueta se genera al crear la orden.</p>
        <div class="mt-6 border border-dashed border-slate-300 p-5 text-sm text-slate-500">
          Seleccioná los datos del trabajo para continuar.
        </div>
      </aside>
    </section>
    <section class="surface mt-6 p-5">
      <p class="section-label">Flujo aplicado</p>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        @for (stage of previewStages(); track stage.id; let i = $index) {
          <span class="rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-800"
            >{{ i + 1 }} · {{ stage.name }}</span
          >
          @if (i < previewStages().length - 1) {
            <span class="text-slate-300">—</span>
          }
        }
      </div>
    </section>`,
})
export class NewOrderPage {
  store = inject(WorkOrderStore);
  fb = inject(FormBuilder);
  router = inject(Router);
  form = this.fb.nonNullable.group({
    dentistId: ['', Validators.required],
    patientReference: ['', Validators.required],
    workTypeId: ['', Validators.required],
    color: [''],
    dueDate: [new Date(Date.now() + 604800000).toISOString().slice(0, 10), Validators.required],
    priority: ['STANDARD' as const],
  });
  previewStages = computed(() => {
    let type = this.store.workTypes.find((t) => t.id === this.form.value.workTypeId);
    return (
      this.store.workflows
        .find((w) => w.id === type?.workflowId)
        ?.groups.flatMap((g) => g.stages) ?? []
    );
  });
  submit() {
    if (this.form.valid) {
      let order = this.store.create(this.form.getRawValue());
      this.router.navigate(['/orders', order.id]);
    }
  }
}
@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `<header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="page-kicker">Registro</p>
        <h1 class="page-title">Órdenes</h1>
        <p class="page-subtitle">{{ store.orders().length }} trabajos registrados</p>
      </div>
      <a routerLink="/orders/new" class="button-primary">+ Nueva orden</a>
    </header>
    <section class="surface mt-7 overflow-hidden">
      <div class="border-b p-4">
        <input
          [(ngModel)]="query"
          class="max-w-xl px-3"
          placeholder="Buscar OT, odontólogo o referencia..."
        />
        <div class="mt-3 flex gap-5">
          <button class="tab active">Todas</button><button class="tab">Activas</button
          ><button class="tab">Consultorio</button><button class="tab">Terminadas</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-210 text-left text-sm">
          <thead class="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-5 py-3">OT</th>
              <th>Trabajo</th>
              <th>Odontólogo</th>
              <th>Referencia</th>
              <th>Etapa</th>
              <th>Ubicación</th>
              <th>Entrega</th>
              <th>Prioridad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (o of filtered(); track o.id) {
              <tr
                [routerLink]="['/orders', o.id]"
                class="cursor-pointer border-t border-slate-100 hover:bg-blue-50"
              >
                <td class="px-5 py-4 font-bold">#{{ o.number }}</td>
                <td>{{ store.type(o)?.name }}</td>
                <td>{{ store.dentist(o)?.name }}</td>
                <td>{{ o.patientReference }}</td>
                <td>{{ store.stage(o)?.name }}</td>
                <td>
                  <span
                    class="rounded px-2 py-1 text-xs font-bold"
                    [class.location-lab]="o.location === 'LAB'"
                    [class.location-dentist]="o.location === 'DENTIST'"
                    >{{ o.location === 'LAB' ? 'Laboratorio' : 'Consultorio' }}</span
                  >
                </td>
                <td>{{ dateShort(o.dueDate) }}</td>
                <td>
                  <span class="text-xs font-bold" [class.text-red-600]="o.priority === 'URGENT'">{{
                    o.priority === 'URGENT' ? 'Urgente' : 'Normal'
                  }}</span>
                </td>
                <td>›</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>`,
})
export class OrdersPage {
  store = inject(WorkOrderStore);
  query = '';
  dateShort = dateShort;
  filtered() {
    let q = this.query.toLowerCase();
    return this.store
      .orders()
      .filter(
        (o) =>
          !q ||
          `${o.number} ${o.patientReference} ${this.store.dentist(o)?.name}`
            .toLowerCase()
            .includes(q),
      );
  }
}
@Component({
  standalone: true,
  imports: [RouterLink, TimelineComponent, SmartLabelComponent],
  template: `@if (order(); as o) {
    <a routerLink="/orders" class="text-sm font-bold text-blue-700">← Órdenes</a>
    <header class="mt-5 flex flex-wrap justify-between gap-4">
      <div>
        <p class="page-kicker">OT #{{ o.number }}</p>
        <h1 class="page-title">{{ store.type(o)?.name }}</h1>
        <p class="page-subtitle">
          {{ store.dentist(o)?.name }} · {{ o.patientReference }} · Entrega
          {{ dateShort(o.dueDate) }}
        </p>
      </div>
      <span
        class="rounded-md px-3 py-1.5 text-xs font-bold"
        [class.bg-red-50]="o.priority === 'URGENT'"
        [class.text-red-700]="o.priority === 'URGENT'"
        >{{ o.priority === 'URGENT' ? 'URGENTE' : 'PRIORIDAD NORMAL' }}</span
      >
    </header>
    <section class="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div class="space-y-6">
        <section class="surface p-6">
          <p class="section-label">Estado actual</p>
          <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span
                class="rounded px-2 py-1 text-xs font-bold"
                [class.location-lab]="o.location === 'LAB'"
                [class.location-dentist]="o.location === 'DENTIST'"
                >{{ o.location === 'LAB' ? 'EN LABORATORIO' : 'EN CONSULTORIO' }}</span
              >
              <p class="mt-3 text-2xl font-bold">{{ store.stage(o)?.name }}</p>
              <p class="mt-1 text-sm text-slate-500">
                Último movimiento: {{ relativeTime(o.lastMovementAt) }}
              </p>
            </div>
            <p class="text-sm text-slate-500">
              Entrega<br /><b class="text-slate-900">{{ dateShort(o.dueDate) }}</b>
            </p>
          </div>
          <div class="mt-6 flex flex-wrap gap-2">
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
          <p class="section-label">Actividad</p>
          <h2 class="mt-1 text-xl font-bold">Timeline del trabajo</h2>
          <app-timeline class="mt-4" [events]="o.timeline" />
        </section>
      </div>
      <aside class="surface h-fit p-5">
        <p class="section-label">Smart Label</p>
        <app-smart-label class="mt-4 block" [order]="o" />
      </aside>
    </section>
  }`,
})
export class OrderDetailPage {
  store = inject(WorkOrderStore);
  route = inject(ActivatedRoute);
  order = computed(() => this.store.order(this.route.snapshot.paramMap.get('id') ?? ''));
  rework = signal(false);
  dateShort = dateShort;
  relativeTime = relativeTime;
}
@Component({
  standalone: true,
  template: `<header>
      <p class="page-kicker">Directorio</p>
      <h1 class="page-title">Odontólogos</h1>
      <p class="page-subtitle">{{ store.dentists.length }} profesionales registrados</p>
    </header>
    <section class="surface mt-7 divide-y divide-slate-100">
      @for (d of store.dentists; track d.id) {
        <article class="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h2 class="font-bold">{{ d.name }}</h2>
            <p class="mt-1 text-sm text-slate-500">
              {{ active(d.id) }} trabajos activos · Último movimiento: {{ last(d.id) }}
            </p>
          </div>
          <button class="text-sm font-bold text-blue-700">Ver trabajos →</button>
        </article>
      }
    </section>`,
})
export class DentistsPage {
  store = inject(WorkOrderStore);
  active = (id: string) =>
    this.store.orders().filter((o) => o.dentistId === id && o.operationalStatus !== 'COMPLETED')
      .length;
  last = (id: string) => {
    let order = this.store
      .orders()
      .filter((o) => o.dentistId === id)
      .sort((a, b) => b.lastMovementAt.localeCompare(a.lastMovementAt))[0];
    return order ? relativeTime(order.lastMovementAt) : 'Sin movimientos';
  };
}
@Component({
  standalone: true,
  template: `@if (order(); as o) {
    <main class="mx-auto min-h-dvh max-w-md bg-[var(--bg-app)] p-5 pb-40">
      <header class="flex items-start justify-between">
        <div>
          <p class="text-xl font-black tracking-tight text-[var(--navy-950)]">DENTALOS</p>
          <p class="mt-1 text-sm font-bold text-slate-500">OT #{{ o.number }}</p>
        </div>
        <span class="rounded-lg border border-slate-300 px-3 py-2 text-xl">×</span>
      </header>
      <section class="surface mt-8 overflow-hidden">
        <div class="flex justify-between bg-indigo-50 px-5 py-3">
          <p class="section-label text-slate-700">Detalles de orden</p>
          @if (o.priority === 'URGENT') {
            <span class="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">URGENTE</span>
          }
        </div>
        <div class="p-5">
          <h1 class="text-2xl font-bold">{{ store.type(o)?.name }}</h1>
          <p class="mt-2 text-lg text-slate-600">
            {{ store.dentist(o)?.name }} · {{ o.patientReference }}
          </p>
          <p class="mt-6 border-t pt-4 text-lg font-bold">Entrega: {{ dateShort(o.dueDate) }}</p>
        </div>
      </section>
      <section class="surface mt-5 border-l-4 border-l-violet-700 p-5">
        <p class="text-sm font-bold text-violet-800">
          {{ o.location === 'LAB' ? 'EN LABORATORIO' : 'EN CONSULTORIO' }}
        </p>
        <p class="mt-3 text-xl">
          Etapa: <b>{{ store.stage(o)?.name }}</b>
        </p>
      </section>
      <div class="mt-7 grid grid-cols-3 gap-3">
        <button class="button-secondary min-h-20">Foto</button
        ><button
          (click)="store.rework(o.id, store.stages(o)[0].id, 'Corrección solicitada')"
          class="button-secondary min-h-20"
        >
          Corrección</button
        ><button (click)="note(o.id)" class="button-secondary min-h-20">Nota</button>
      </div>
      <div class="fixed inset-x-0 bottom-0 border-t bg-white p-4">
        @if (o.location === 'LAB') {
          <button (click)="store.advance(o.id)" class="button-primary min-h-14 w-full">
            ✓ TERMINÉ MI ETAPA</button
          ><button (click)="store.sendToDentist(o.id)" class="button-secondary mt-2 w-full">
            SALE AL CONSULTORIO
          </button>
        } @else {
          <button (click)="store.returnToLab(o.id)" class="button-primary min-h-14 w-full">
            ✓ REGRESÓ AL LABORATORIO
          </button>
        }
      </div>
    </main>
  }`,
})
export class FloorModePage {
  store = inject(WorkOrderStore);
  route = inject(ActivatedRoute);
  order = computed(() => this.store.byToken(this.route.snapshot.paramMap.get('token') ?? ''));
  dateShort = dateShort;
  note(id: string) {
    let text = window.prompt('Agregar nota');
    if (text) this.store.addNote(id, text);
  }
}
