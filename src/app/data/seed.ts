import { Dentist, Technician, Workflow, WorkOrder, WorkType } from '../domain/models';

export const dentists: Dentist[] = [
  { id: 'd1', name: 'Dra. Laura García' }, { id: 'd2', name: 'Dra. Paula López' },
  { id: 'd3', name: 'Dr. Sebastián Torres' }, { id: 'd4', name: 'Dr. Martín Ruiz' }, { id: 'd5', name: 'Dra. Ana Gómez' }
];
export const technicians: Technician[] = [{ id: 't1', name: 'Matías' }, { id: 't2', name: 'Sofía' }, { id: 't3', name: 'Lucas' }];
export const workflows: Workflow[] = [
  { id: 'wf-acrilica', name: 'Prótesis acrílica', groups: [
    { id: 'prep', name: 'Preparación', order: 1, stages: [{ id: 'cubeta', name: 'Cubeta', order: 1 }, { id: 'modelo', name: 'Modelo', order: 2 }, { id: 'mordida', name: 'Mordida', order: 3 }] },
    { id: 'montaje', name: 'Montaje', order: 2, stages: [{ id: 'montaje-stage', name: 'Montaje', order: 4 }, { id: 'prueba', name: 'Prueba de dientes', order: 5 }] },
    { id: 'terminacion', name: 'Terminación', order: 3, stages: [{ id: 'acrilizado', name: 'Acrilizado', order: 6 }, { id: 'terminacion-stage', name: 'Terminación', order: 7 }] }
  ] },
  { id: 'wf-flexible', name: 'Prótesis flexible', groups: [{ id: 'flex-prep', name: 'Preparación', order: 1, stages: [{ id: 'flex-modelo', name: 'Modelo', order: 1 }, { id: 'flex-mordida', name: 'Mordida', order: 2 }] }, { id: 'flex-fin', name: 'Terminación', order: 2, stages: [{ id: 'flex-inyeccion', name: 'Inyección', order: 3 }, { id: 'flex-terminacion', name: 'Terminación', order: 4 }] }] },
  { id: 'wf-reparacion', name: 'Compostura', groups: [{ id: 'rep', name: 'Reparación', order: 1, stages: [{ id: 'reparacion', name: 'Reparación', order: 1 }, { id: 'pulido', name: 'Pulido', order: 2 }] }] }
];
export const workTypes: WorkType[] = workflows.map((workflow) => ({ id: `wt-${workflow.id}`, name: workflow.name, workflowId: workflow.id }));
const isoDay = (offset: number) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + offset); return d.toISOString(); };
const make = (number: number, dentistId: string, reference: string, workTypeId: string, stage: string, location: WorkOrder['location'], dueOffset: number, movedOffset: number, priority: WorkOrder['priority'] = 'STANDARD'): WorkOrder => {
  const type = workTypes.find((item) => item.id === workTypeId)!;
  const date = isoDay(movedOffset);
  return { id: `wo-${number}`, number, dentistId, patientReference: reference, workTypeId, color: number % 2 ? 'A2' : undefined, priority, workflowId: type.workflowId, currentStageId: stage, location, operationalStatus: location === 'DENTIST' ? 'WAITING' : 'ACTIVE', technicianId: 't1', createdAt: isoDay(-14), dueDate: isoDay(dueOffset), lastMovementAt: date, qrToken: `demo-${number}-a9f4`, timeline: [{ id: `e-${number}`, type: 'CREATED', timestamp: isoDay(-14), note: 'Trabajo recibido' }], attachments: [] };
};
export const seedOrders: WorkOrder[] = [
  make(1842, 'd1', 'MG', 'wt-wf-acrilica', 'prueba', 'DENTIST', 3, -9, 'URGENT'), make(1847, 'd2', 'JP', 'wt-wf-flexible', 'flex-mordida', 'LAB', 0, -1, 'URGENT'),
  make(1851, 'd3', 'CR', 'wt-wf-acrilica', 'modelo', 'LAB', 3, -1), make(1791, 'd4', 'AR', 'wt-wf-acrilica', 'mordida', 'DENTIST', 1, -9),
  make(1832, 'd5', 'LC', 'wt-wf-reparacion', 'reparacion', 'LAB', 0, -1), make(1838, 'd1', 'CV', 'wt-wf-acrilica', 'cubeta', 'LAB', 2, -1),
  make(1840, 'd2', 'ML', 'wt-wf-acrilica', 'montaje-stage', 'LAB', 4, -2), make(1844, 'd3', 'SG', 'wt-wf-acrilica', 'acrilizado', 'LAB', 1, -1),
  make(1848, 'd5', 'ND', 'wt-wf-flexible', 'flex-inyeccion', 'LAB', 5, -2), make(1853, 'd4', 'PM', 'wt-wf-reparacion', 'pulido', 'LAB', -1, -2),
  make(1855, 'd1', 'RT', 'wt-wf-acrilica', 'terminacion-stage', 'LAB', 0, -1), make(1857, 'd2', 'AM', 'wt-wf-acrilica', 'modelo', 'LAB', 7, -1)
];
