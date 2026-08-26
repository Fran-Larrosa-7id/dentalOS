import { Component, ElementRef, ViewChild, afterNextRender, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import AirDatepicker from 'air-datepicker';
import localeEs from 'air-datepicker/locale/es';
import { IconComponent } from './icon/icon.component';

@Component({
  selector: 'app-date-picker',
  imports: [IconComponent],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true },
  ],
  template: `<div class="relative">
    <input
      #input
      type="text"
      class="w-full px-3 pr-10"
      placeholder="Elegir fecha"
      autocomplete="off"
    /><app-icon
      name="calendar"
      class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
    />
  </div>`,
})
export class DatePickerComponent implements ControlValueAccessor {
  @ViewChild('input', { static: true }) input!: ElementRef<HTMLInputElement>;
  private picker?: AirDatepicker<HTMLInputElement>;
  private value = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  constructor() {
    afterNextRender(() => this.initialize());
  }
  writeValue(value: string | null) {
    this.value = value ?? '';
    if (this.picker && this.value)
      this.picker.selectDate(new Date(`${this.value}T12:00:00`), { silent: true });
    if (this.picker && !this.value) this.picker.clear({ silent: true });
  }
  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean) {
    if (this.input) this.input.nativeElement.disabled = disabled;
  }
  private initialize() {
    this.picker = new AirDatepicker(this.input.nativeElement, {
      locale: localeEs,
      dateFormat: 'dd/MM/yyyy',
      autoClose: true,
      buttons: ['clear', 'today'],
      selectedDates: this.value ? [new Date(`${this.value}T12:00:00`)] : [],
      onSelect: ({ date }) => {
        const chosen = Array.isArray(date) ? date[0] : date;
        const value = chosen ? this.iso(chosen) : '';
        this.value = value;
        this.onChange(value);
        this.onTouched();
      },
    });
  }
  private iso(date: Date) {
    const y = date.getFullYear(),
      m = String(date.getMonth() + 1).padStart(2, '0'),
      d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
