import { seedOrders, workflows } from '../data/seed';
import { WorkOrder } from '../domain/models';
import { resolveOrderTransition } from './order-transition';

describe('resolveOrderTransition', () => {
  const stages = workflows
    .find((workflow) => workflow.id === 'wf-acrilica')!
    .groups.flatMap((group) => group.stages);
  const beforeDentistVisit: WorkOrder = {
    ...seedOrders.find((order) => order.number === 1842)!,
    location: 'LAB',
    operationalStatus: 'ACTIVE',
    currentStageId: 'prueba',
    timeline: [],
  };

  it('requires a dentist visit before Prueba de dientes can advance', () => {
    const transition = resolveOrderTransition(beforeDentistVisit, stages);
    expect(transition.primaryAction).toBe('SEND_TO_DENTIST');
    expect(transition.nextLabel).toBe('Enviar al consultorio');
  });

  it('requires a return while the order is at the dentist', () => {
    const transition = resolveOrderTransition(
      { ...beforeDentistVisit, location: 'DENTIST', operationalStatus: 'WAITING' },
      stages,
    );
    expect(transition.primaryAction).toBe('RETURN_TO_LAB');
  });

  it('allows advancing to Acrilizado only after the return', () => {
    const transition = resolveOrderTransition(
      {
        ...beforeDentistVisit,
        timeline: [
          { id: 'returned', type: 'RETURNED_TO_LAB', timestamp: new Date().toISOString() },
        ],
      },
      stages,
    );
    expect(transition.primaryAction).toBe('ADVANCE');
    expect(transition.nextLabel).toBe('Acrilizado');
  });
});
