import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <p class="page-kicker">Configuración</p>
    </header>
    <section
      class="mt-7 grid items-center gap-12 xl:grid-cols-[minmax(0,.82fr)_minmax(0,1fr)] xl:gap-16"
    >
      <div class="max-w-xl">
        <p class="technical-id text-[11px] font-bold tracking-[.14em] text-blue-700">CONFIG / 01</p>
        <h1
          class="mt-5 text-4xl font-bold leading-[1.08] tracking-[-.04em] text-slate-950 sm:text-5xl"
        >
          Preparando el centro de<br class="hidden sm:block" />
          control de tu laboratorio.
        </h1>
        <p class="mt-6 max-w-md text-base leading-7 text-slate-600">
          Próximamente vas a poder adaptar DentalOS a la forma real en la que trabaja tu equipo.
        </p>
        <p class="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <span class="size-2 rounded-full bg-blue-600"></span>En preparación
        </p>
        <div class="mt-12 max-w-md border-t border-slate-200 pt-5">
          <p class="section-label">Capacidades futuras</p>
          <ol class="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            @for (item of capabilities; track item.number) {
              <li class="flex gap-3 text-sm">
                <span class="technical-id text-xs font-bold text-blue-700">0{{ item.number }}</span
                ><span class="font-medium text-slate-700">{{ item.label }}</span>
              </li>
            }
          </ol>
        </div>
        <a routerLink="/today" class="button-secondary mt-10 inline-block">← Volver al inicio</a>
      </div>

      <section
        class="relative overflow-hidden border border-slate-300 bg-white shadow-[0_12px_30px_rgb(15_23_42_/_0.06)]"
      >
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p class="technical-id text-[10px] font-bold tracking-[.12em] text-slate-500">
              DENTALOS SYSTEM
            </p>
            <h2 class="mt-1 font-bold">Configuración</h2>
          </div>
          <span
            class="border border-slate-200 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-500"
            >PREVIEW</span
          >
        </div>
        <div class="pointer-events-none select-none p-6 opacity-75">
          <section>
            <p class="section-label">General</p>
            <dl class="mt-3 divide-y divide-slate-200 border-y border-slate-200">
              <div class="flex items-center justify-between gap-4 py-3">
                <dt class="text-sm text-slate-600">Laboratorio</dt>
                <dd class="text-sm font-semibold">Dental Lab</dd>
              </div>
              <div class="flex items-center justify-between gap-4 py-3">
                <dt class="text-sm text-slate-600">Zona horaria</dt>
                <dd class="text-sm font-semibold">Buenos Aires</dd>
              </div>
            </dl>
          </section>
          <section class="mt-7">
            <p class="section-label">Flujos</p>
            <div class="mt-3 divide-y divide-slate-200 border-y border-slate-200">
              @for (workflow of workflows; track workflow.name) {
                <div class="flex items-center justify-between gap-4 py-3">
                  <span class="text-sm font-semibold">{{ workflow.name }}</span
                  ><span class="technical-id text-xs text-slate-500">{{ workflow.detail }}</span>
                </div>
              }
            </div>
          </section>
          <section class="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <p class="section-label">Equipo</p>
              <p class="mt-3 text-sm font-semibold">8 técnicos activos</p>
            </div>
            <div>
              <p class="section-label">Alertas</p>
              <p class="mt-3 text-sm font-semibold">Consultorio · 5 días</p>
              <p class="mt-1 text-sm text-slate-600">Entrega próxima · 48 h</p>
            </div>
          </section>
        </div>
        <div
          class="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-slate-200 bg-white/95 px-6 py-3"
        >
          <span class="text-xs font-medium text-slate-500">Vista de configuración</span
          ><span class="text-xs font-bold text-blue-700">Disponible próximamente</span>
        </div>
      </section>
    </section>
  `,
})
export class SettingsComingSoonPage {
  readonly capabilities = [
    { number: 1, label: 'Flujos personalizados' },
    { number: 2, label: 'Técnicos y responsables' },
    { number: 3, label: 'Alertas operativas' },
    { number: 4, label: 'Smart Labels e impresión' },
  ];
  readonly workflows = [
    { name: 'Prótesis acrílica', detail: '7 etapas' },
    { name: 'Prótesis flexible', detail: '5 etapas' },
    { name: 'Compostura', detail: '2 etapas' },
  ];
}
