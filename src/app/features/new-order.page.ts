import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkOrderStore } from '../core/work-order.store';
import { DatePickerComponent } from '../shared/date-picker';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, DatePickerComponent],
  template: `
    <header>
      <p class="page-kicker">Nueva orden</p>
      <h1 class="page-title">Crear ticket de producción</h1>
      <p class="page-subtitle">Identificá el trabajo, definí su entrega y envialo al flujo.</p>
    </header>
    <section class="mt-7 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <form [formGroup]="form" (ngSubmit)="submit()" class="border border-slate-200 bg-white p-6">
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <p class="technical-id text-[11px] font-bold text-blue-700">01</p>
            <p class="mt-1 text-sm font-bold">Identificación</p>
          </div>
          <label class="input-label sm:col-span-2"
            >Odontólogo<select formControlName="dentistId">
              <option value="">Seleccionar odontólogo</option>
              @for (d of store.dentists; track d.id) {
                <option [value]="d.id">{{ d.name }}</option>
              }
            </select></label
          >
          <label class="input-label sm:col-span-2"
            >Paciente / referencia<input formControlName="patientReference" placeholder="Ej. MG"
          /></label>
          <div class="sm:col-span-2 border-t border-slate-200 pt-5">
            <p class="technical-id text-[11px] font-bold text-blue-700">02</p>
            <p class="mt-1 text-sm font-bold">Trabajo</p>
          </div>
          <label class="input-label sm:col-span-2"
            >Tipo de trabajo<select formControlName="workTypeId">
              <option value="">Seleccionar tipo</option>
              @for (t of store.workTypes; track t.id) {
                <option [value]="t.id">{{ t.name }}</option>
              }
            </select></label
          >
          <label class="input-label">Color<input formControlName="color" placeholder="A2" /></label>
          <label class="input-label"
            >Fecha de entrega<app-date-picker class="mt-2 block" formControlName="dueDate"
          /></label>
          <div class="sm:col-span-2 border-t border-slate-200 pt-5">
            <p class="technical-id text-[11px] font-bold text-blue-700">03</p>
            <p class="mt-1 text-sm font-bold">Prioridad</p>
          </div>
          <label class="input-label sm:col-span-2"
            ><select formControlName="priority">
              <option value="STANDARD">Estándar</option>
              <option value="URGENT">Urgente</option>
            </select></label
          >
          <button
            type="button"
            (click)="more.set(!more())"
            class="justify-self-start text-sm font-bold text-blue-700"
          >
            {{ more() ? '− Menos información' : '+ Más información' }}
          </button>
          @if (more()) {
            <label class="input-label"
              >Edad<input formControlName="patientAge" type="number" min="1" max="120" /></label
            ><label class="input-label sm:col-span-2"
              >Trabajo a realizar / indicaciones<textarea
                formControlName="workDescription"
                rows="4"
                class="mt-2 w-full rounded-lg border border-slate-300 p-3"
              ></textarea>
            </label>
          }
          <button
            [disabled]="form.invalid"
            class="button-primary justify-self-start disabled:opacity-50"
          >
            Crear orden e imprimir etiqueta
          </button>
        </div>
      </form>
      <aside class="h-fit bg-slate-50 p-5">
        <p class="section-label">Smart Label · borrador</p>
        <section class="mt-4 border-2 border-slate-900 bg-white p-5 text-slate-950">
          <div class="flex justify-between">
            <div>
              <p class="text-[10px] font-black tracking-[.22em]">DENTALOS</p>
              <p class="technical-id mt-2 text-xl font-black">OT ——</p>
            </div>
            <p class="text-xs font-bold">DRAFT</p>
          </div>
          <div class="mt-5 border-y border-slate-300 py-3 text-sm">
            <p class="font-bold">{{ dentistName() }}</p>
            <p>{{ form.controls.patientReference.value || 'Referencia' }} · {{ typeName() }}</p>
            <p>Color {{ form.controls.color.value || '—' }}</p>
          </div>
          <div class="mt-5 flex items-end justify-between">
            <div>
              <p class="text-[10px] font-bold tracking-widest">ENTREGA</p>
              <p class="mt-1 text-lg font-black">{{ dueLabel() }}</p>
            </div>
            <div
              class="grid h-20 w-20 place-items-center border border-dashed border-slate-500 text-center text-[10px] font-bold text-slate-500"
            >
              QR<br />se genera al crear
            </div>
          </div>
        </section>
      </aside>
    </section>
    <section class="mt-8 border-t border-slate-200 pt-6">
      <p class="section-label">Flujo aplicado</p>
      @if (previewStages().length) {
        <div class="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3">
          @for (stage of previewStages(); track stage.id; let i = $index) {
            <span class="technical-id text-[11px] font-bold text-blue-700">0{{ i + 1 }}</span
            ><span class="text-sm font-semibold">{{ stage.name }}</span>
            @if (i < previewStages().length - 1) {
              <span class="mx-2 h-px w-5 bg-slate-300"></span>
            }
          }
        </div>
      } @else {
        <p class="mt-3 text-sm text-slate-500">
          Seleccioná un tipo de trabajo para ver las etapas aplicadas.
        </p>
      }
    </section>
  `,
})
export class ModernNewOrderPage {
  readonly store = inject(WorkOrderStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly more = signal(false);
  readonly form = this.fb.nonNullable.group({
    dentistId: ['', Validators.required],
    patientReference: ['', Validators.required],
    workTypeId: ['', Validators.required],
    color: [''],
    dueDate: [new Date(Date.now() + 604800000).toISOString().slice(0, 10), Validators.required],
    priority: ['STANDARD' as const],
    patientAge: ['', [Validators.min(1), Validators.max(120)]],
    workDescription: [''],
  });
  readonly previewStages = computed(() => {
    const type = this.store.workTypes.find((t) => t.id === this.form.value.workTypeId);
    return (
      this.store.workflows
        .find((w) => w.id === type?.workflowId)
        ?.groups.flatMap((g) => g.stages) ?? []
    );
  });
  dentistName = () =>
    this.store.dentists.find((d) => d.id === this.form.controls.dentistId.value)?.name ??
    'Odontólogo';
  typeName = () =>
    this.store.workTypes.find((t) => t.id === this.form.controls.workTypeId.value)?.name ??
    'Tipo de trabajo';
  dueLabel = () =>
    new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' })
      .format(new Date(this.form.controls.dueDate.value))
      .toUpperCase();
  submit() {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      const order = this.store.create({
        ...raw,
        patientAge: raw.patientAge ? Number(raw.patientAge) : undefined,
        workDescription: raw.workDescription.trim() || undefined,
      });
      this.router.navigate(['/orders', order.id]);
    }
  }
}
