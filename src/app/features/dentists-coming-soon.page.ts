import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <header><p class="page-kicker">Directorio</p></header>
    <section
      class="mt-7 grid items-center gap-12 xl:grid-cols-[minmax(0,.82fr)_minmax(0,1fr)] xl:gap-16"
    >
      <div class="max-w-xl">
        <p class="technical-id text-[11px] font-bold tracking-[.14em] text-blue-700">
          DIRECTORIO / 01
        </p>
        <h1
          class="mt-5 text-4xl font-bold leading-[1.08] tracking-[-.04em] text-slate-950 sm:text-5xl"
        >
          Preparando tu red de odontólogos.
        </h1>
        <p class="mt-6 max-w-md text-base leading-7 text-slate-600">
          Próximamente vas a poder gestionar profesionales asociados al laboratorio y entender su
          actividad de un vistazo.
        </p>
        <p class="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <span class="size-2 rounded-full bg-blue-600"></span>En preparación
        </p>
        <div class="mt-12 max-w-md border-t border-slate-200 pt-5">
          <p class="section-label">Próximamente</p>
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
              DENTALOS DIRECTORY
            </p>
            <h2 class="mt-1 font-bold">Odontólogos</h2>
          </div>
          <span
            class="border border-slate-200 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-500"
            >PREVIEW</span
          >
        </div>
        <div class="pointer-events-none select-none p-6 opacity-75">
          <div class="flex items-center justify-between border-b border-slate-200 pb-4">
            <p class="text-sm font-semibold">Profesionales asociados</p>
            <span class="text-xs text-slate-500">Buscar odontólogo</span>
          </div>
          <div class="divide-y divide-slate-200">
            @for (dentist of dentists; track dentist.initials) {
              <article class="grid grid-cols-[38px_1fr_auto] items-center gap-3 py-4">
                <span
                  class="grid size-9 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-700"
                  >{{ dentist.initials }}</span
                >
                <div>
                  <h3 class="text-sm font-bold">{{ dentist.name }}</h3>
                  <p class="mt-1 text-xs text-slate-600">
                    {{ dentist.active }} trabajos activos · {{ dentist.last }}
                  </p>
                </div>
                <span class="text-sm font-bold text-blue-700">→</span>
              </article>
            }
          </div>
          <div class="mt-6 grid grid-cols-2 gap-5 border-t border-slate-200 pt-5">
            <div>
              <p class="section-label">Activos</p>
              <p class="mt-2 text-xl font-bold">18 trabajos</p>
            </div>
            <div>
              <p class="section-label">Consultorio</p>
              <p class="mt-2 text-xl font-bold text-violet-700">4 esperando</p>
            </div>
          </div>
        </div>
        <div
          class="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-slate-200 bg-white/95 px-6 py-3"
        >
          <span class="text-xs font-medium text-slate-500">Vista de directorio</span
          ><span class="text-xs font-bold text-blue-700">Disponible próximamente</span>
        </div>
      </section>
    </section>
  `,
})
export class DentistsComingSoonPage {
  readonly capabilities = [
    { number: 1, label: 'Actividad por profesional' },
    { number: 2, label: 'Trabajos relacionados' },
    { number: 3, label: 'Búsqueda rápida' },
    { number: 4, label: 'Métricas operativas' },
  ];
  readonly dentists = [
    { initials: 'LG', name: 'Dra. Laura García', active: 3, last: 'último movimiento hoy' },
    { initials: 'ST', name: 'Dr. Sebastián Torres', active: 5, last: 'último movimiento ayer' },
    { initials: 'PL', name: 'Dra. Paula López', active: 2, last: '1 en consultorio' },
  ];
}
