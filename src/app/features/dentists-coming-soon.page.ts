import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  styles: `
    @media (max-width: 639px) {
      .dentist-preview-row--mobile-hidden {
        display: none;
      }
    }
  `,
  template: `
    <header><p class="page-kicker">Odontólogos</p></header>
    <section
      class="mt-7 grid items-start gap-12 xl:grid-cols-[minmax(0,.72fr)_minmax(0,1fr)] xl:gap-16"
    >
      <div class="max-w-xl pt-2">
        <p class="technical-id text-[11px] font-bold tracking-[.14em] text-blue-700">
          DIRECTORIO / 01
        </p>
        <h1
          class="mt-5 text-4xl font-bold leading-[1.08] tracking-[-.04em] text-slate-950 sm:text-5xl"
        >
          Tu red profesional,<br class="hidden sm:block" />
          más clara y más ordenada.
        </h1>
        <p class="mt-6 max-w-md text-base leading-7 text-slate-600">
          Próximamente vas a poder visualizar a cada odontólogo, sus trabajos activos y su nivel de
          movimiento dentro del laboratorio.
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
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <p class="technical-id text-[10px] font-bold tracking-[.12em] text-slate-500">
              DENTALOS DIRECTORY
            </p>
            <h2 class="mt-1 font-bold">Odontólogos</h2>
            <p class="mt-1 text-xs text-slate-500">5 profesionales registrados</p>
          </div>
          <span
            class="border border-slate-200 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-500"
            >PREVIEW</span
          >
        </div>
        <div class="pointer-events-none select-none p-5 pb-16 opacity-80 sm:p-6 sm:pb-16">
          <div class="relative">
            <input
              disabled
              value="Buscar odontólogo..."
              class="h-10 w-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 disabled:cursor-default disabled:opacity-100"
            /><span class="absolute right-3 top-2.5 text-xs text-slate-400">⌕</span>
          </div>
          <div class="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            @for (dentist of dentists; track dentist.initials) {
              <article
                class="dentist-preview-row grid grid-cols-[38px_1fr_auto] items-center gap-3 py-3.5"
                [class.dentist-preview-row--mobile-hidden]="dentist.mobileHidden"
              >
                <span
                  class="grid size-9 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-700"
                  >{{ dentist.initials }}</span
                >
                <div>
                  <h3 class="text-sm font-bold">{{ dentist.name }}</h3>
                  <p class="mt-1 text-xs text-slate-600">
                    {{ dentist.active }}
                    {{ dentist.active === 1 ? 'trabajo activo' : 'trabajos activos' }} · Último
                    movimiento: {{ dentist.last }}
                  </p>
                </div>
                <span class="whitespace-nowrap text-xs font-bold text-blue-700"
                  >Ver trabajos →</span
                >
              </article>
            }
          </div>
          <div class="mt-5 grid grid-cols-3 gap-3">
            <div>
              <p class="section-label">Activos</p>
              <p class="mt-2 text-lg font-bold">12</p>
            </div>
            <div>
              <p class="section-label">Consultorio</p>
              <p class="mt-2 text-lg font-bold text-violet-700">3</p>
            </div>
            <div>
              <p class="section-label">Entrega hoy</p>
              <p class="mt-2 text-lg font-bold">2</p>
            </div>
          </div>
        </div>
        <div
          class="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-slate-200 bg-white/95 px-5 py-3 sm:px-6"
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
    { number: 1, label: 'Directorio profesional' },
    { number: 2, label: 'Trabajos activos por odontólogo' },
    { number: 3, label: 'Último movimiento' },
    { number: 4, label: 'Acceso rápido a órdenes relacionadas' },
  ];
  readonly dentists = [
    { initials: 'LG', name: 'Dra. Laura García', active: 3, last: 'Hoy', mobileHidden: false },
    { initials: 'PL', name: 'Dra. Paula López', active: 2, last: 'Hoy', mobileHidden: false },
    { initials: 'ST', name: 'Dr. Sebastián Torres', active: 4, last: 'Ayer', mobileHidden: false },
    { initials: 'MR', name: 'Dr. Martín Ruiz', active: 2, last: 'Hoy', mobileHidden: true },
    { initials: 'AG', name: 'Dra. Ana Gómez', active: 1, last: 'Hace 2 días', mobileHidden: true },
  ];
}
