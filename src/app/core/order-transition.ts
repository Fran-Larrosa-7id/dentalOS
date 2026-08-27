import { WorkOrder, WorkflowStage } from '../domain/models';

export type PrimaryOrderAction = 'ADVANCE' | 'SEND_TO_DENTIST' | 'RETURN_TO_LAB' | 'NONE';

export interface OrderTransition {
  currentStageLabel: string;
  nextLabel: string;
  primaryAction: PrimaryOrderAction;
  primaryLabel: string;
  secondaryActions: Array<'REWORK'>;
}

const hasReturnedFromDentist = (order: WorkOrder) =>
  order.timeline.some((event) => event.type === 'RETURNED_TO_LAB');

export const resolveOrderTransition = (
  order: WorkOrder,
  stages: WorkflowStage[],
): OrderTransition => {
  const current = stages.find((stage) => stage.id === order.currentStageId);
  const currentStageLabel = current?.name ?? 'Etapa actual';

  if (order.operationalStatus === 'COMPLETED') {
    return {
      currentStageLabel,
      nextLabel: 'Trabajo completado',
      primaryAction: 'NONE',
      primaryLabel: '✓ Trabajo finalizado',
      secondaryActions: [],
    };
  }
  if (order.location === 'DENTIST') {
    return {
      currentStageLabel,
      nextLabel: 'Registrar regreso al laboratorio',
      primaryAction: 'RETURN_TO_LAB',
      primaryLabel: 'Registrar regreso al laboratorio',
      secondaryActions: ['REWORK'],
    };
  }

  if (order.currentStageId === 'prueba' && !hasReturnedFromDentist(order)) {
    return {
      currentStageLabel,
      nextLabel: 'Enviar al consultorio',
      primaryAction: 'SEND_TO_DENTIST',
      primaryLabel: 'Enviar al consultorio',
      secondaryActions: ['REWORK'],
    };
  }

  const next = stages[stages.findIndex((stage) => stage.id === order.currentStageId) + 1];
  return {
    currentStageLabel,
    nextLabel: next?.name ?? 'Trabajo completado',
    primaryAction: 'ADVANCE',
    primaryLabel: next ? `Finalizar ${currentStageLabel} → ${next.name}` : 'Finalizar trabajo',
    secondaryActions: ['REWORK'],
  };
};
