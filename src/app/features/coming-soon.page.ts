import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="grid min-h-[62vh] place-items-center py-10">
      <div class="max-w-lg text-center">
        <p class="page-kicker">DentalOS · módulo en preparación</p>
        <div
          class="mx-auto mt-6 grid size-16 place-items-center rounded-lg border border-blue-200 bg-white text-2xl font-black text-blue-700"
        >
          +
        </div>
        <h1 class="page-title mt-6">{{ title() }}</h1>
        <p class="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">{{ description() }}</p>
        <div
          class="mt-8 inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
        >
          <span class="size-2 rounded-full bg-blue-600"></span>Próximamente
        </div>
        <div class="mt-8">
          <a routerLink="/today" class="button-secondary inline-block">Volver a Inicio</a>
        </div>
      </div>
    </section>
  `,
})
export class ComingSoonPage {
  private readonly route = inject(ActivatedRoute);
  readonly title = computed(() => this.route.snapshot.data['title'] ?? 'Próximamente');
  readonly description = computed(
    () =>
      this.route.snapshot.data['description'] ??
      'Este módulo está siendo preparado para la próxima etapa de DentalOS.',
  );
}
