import { Routes } from '@angular/router';
import { DentistsPage, FloorModePage, OrdersPage, ProductionPage } from './features/pages';
import { ModernNewOrderPage } from './features/new-order.page';
import { ModernOrderDetailPage } from './features/order-detail.page';
import { KanbanTodayPage } from './features/today-kanban.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'today' },
  { path: 'today', component: KanbanTodayPage, title: 'Hoy · DentalOS' },
  { path: 'production', component: ProductionPage, title: 'Producción · DentalOS' },
  { path: 'orders', component: OrdersPage, title: 'Órdenes · DentalOS' },
  { path: 'orders/new', component: ModernNewOrderPage, title: 'Nueva orden · DentalOS' },
  { path: 'orders/:id', component: ModernOrderDetailPage, title: 'Orden · DentalOS' },
  { path: 'q/:token', component: FloorModePage, title: 'Floor Mode · DentalOS' },
  { path: 'dentists', component: DentistsPage, title: 'Odontólogos · DentalOS' },
  { path: 'settings', component: DentistsPage, title: 'Configuración · DentalOS' },
  { path: '**', redirectTo: 'today' },
];
