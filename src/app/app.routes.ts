import { Routes } from '@angular/router';
import { DentistsPage, FloorModePage, NewOrderPage, OrderDetailPage, OrdersPage, ProductionPage, TodayPage } from './features/pages';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'today' },
  { path: 'today', component: TodayPage, title: 'Hoy · DentalOS' },
  { path: 'production', component: ProductionPage, title: 'Producción · DentalOS' },
  { path: 'orders', component: OrdersPage, title: 'Órdenes · DentalOS' },
  { path: 'orders/new', component: NewOrderPage, title: 'Nueva orden · DentalOS' },
  { path: 'orders/:id', component: OrderDetailPage, title: 'Orden · DentalOS' },
  { path: 'q/:token', component: FloorModePage, title: 'Floor Mode · DentalOS' },
  { path: 'dentists', component: DentistsPage, title: 'Odontólogos · DentalOS' },
  { path: 'settings', component: DentistsPage, title: 'Configuración · DentalOS' },
  { path: '**', redirectTo: 'today' }
];
