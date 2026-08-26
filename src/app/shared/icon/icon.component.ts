import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'arrow'
  | 'briefcase'
  | 'calculator'
  | 'calendar'
  | 'cart'
  | 'car'
  | 'check'
  | 'chevron'
  | 'clock'
  | 'copy'
  | 'document'
  | 'expand'
  | 'home'
  | 'info'
  | 'menu'
  | 'minus'
  | 'money'
  | 'moon'
  | 'paw'
  | 'receipt'
  | 'trash'
  | 'shield'
  | 'share'
  | 'shop'
  | 'spark'
  | 'sun'
  | 'wallet'
  | 'plus'
  | 'x';

@Component({
  selector: 'app-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @if (name() === 'paw') {
        <circle cx="11" cy="4" r="2" />
        <circle cx="18" cy="8" r="2" />
        <circle cx="20" cy="16" r="2" />
        <path
          d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"
        />
      } @else {
        <path [attr.d]="paths[name()]" />
      }
    </svg>
  `,
  host: { class: 'inline-block shrink-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly name = input.required<IconName>();

  protected readonly paths: Readonly<Record<IconName, string>> = {
    arrow: 'M5 12h14m-5-5 5 5-5 5',
    briefcase: 'M9 7V5h6v2m-11 3h16v9H4v-9Zm0 3c5 2 11 2 16 0',
    calculator: 'M6 3h12v18H6V3Zm3 4h6M9 12h.01M15 12h.01M9 16h.01M15 16h.01',
    calendar: 'M6 3v3m12-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z',
    cart: 'M3 5h2l2.4 10.2a2 2 0 0 0 2 1.5h7.4a2 2 0 0 0 1.9-1.4L20 9H7m3 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
    car: 'm5 16-1-3 2-5h12l2 5-1 3M6 16h12v3h-2v-2H8v2H6v-3Zm1-3h.01M17 13h.01',
    check: 'M20 6 9 17l-5-5',
    chevron: 'm9 18 6-6-6-6',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2',
    copy: 'M8 8h11v13H8V8Zm-3 8H3V3h11v2',
    document: 'M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6m-6 4h6',
    expand:
      'M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3',
    home: 'm3 11 9-8 9 8v10h-6v-6H9v6H3V11Z',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-11v6m0-10h.01',
    menu: 'M4 7h16M4 12h16M4 17h16',
    minus: 'M5 12h14',
    money: 'M4 6h16v12H4V6Zm8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM7 9h.01M17 15h.01',
    moon: 'M20.5 14.3A8 8 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z',
    paw: 'M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z',
    receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6m-6 4h4',
    trash: 'M4 7h16m-10 4v6m4-6v6M9 7V4h6v3m-9 0 1 14h10l1-14',
    shield: 'M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Zm-3-11 2 2 4-4',
    share: 'M12 15V3m0 0L8 7m4-4 4 4M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8',
    shop: 'M4 10v10h16V10M3 10l2-6h14l2 6M8 20v-6h4v6M3 10c1 2 3 2 4 0 1 2 3 2 5 0 1 2 3 2 5 0 1 2 3 2 4 0',
    spark:
      'm12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Zm6 12 .7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z',
    sun: 'M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m11.4 0 1.4 1.4M4.9 4.9l1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
    wallet:
      'M4 6h15a1 1 0 0 1 1 1v12H4a2 2 0 0 1-2-2V5m0 0a2 2 0 0 1 2-2h13v3H4a2 2 0 0 0-2 2m13 3h5v5h-5a2.5 2.5 0 0 1 0-5Z',
    plus: 'M12 5v14M5 12h14',
    x: 'M6 6l12 12M18 6 6 18',
  };
}
