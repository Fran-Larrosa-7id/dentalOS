export type Location = 'LAB' | 'DENTIST' | 'DELIVERY';
export type OperationalStatus = 'ACTIVE' | 'WAITING' | 'REWORK' | 'COMPLETED' | 'DELIVERED';
export type Priority = 'STANDARD' | 'URGENT';
export type EventType = 'CREATED' | 'STAGE_COMPLETED' | 'STAGE_CHANGED' | 'SENT_TO_DENTIST' | 'RETURNED_TO_LAB' | 'REWORK_REQUESTED' | 'PHOTO_ADDED' | 'NOTE_ADDED' | 'COMPLETED';

export interface Dentist { id: string; name: string; }
export interface Technician { id: string; name: string; }
export interface WorkflowStage { id: string; name: string; order: number; }
export interface WorkflowGroup { id: string; name: string; order: number; stages: WorkflowStage[]; }
export interface Workflow { id: string; name: string; groups: WorkflowGroup[]; }
export interface WorkType { id: string; name: string; workflowId: string; }
export interface WorkOrderEvent { id: string; type: EventType; timestamp: string; stageId?: string; previousStageId?: string; note?: string; reworkReason?: string; }
export interface Attachment { id: string; name: string; type: 'PHOTO' | 'FILE'; createdAt: string; }
export interface WorkOrder {
  id: string; number: number; dentistId: string; patientReference: string; workTypeId: string;
  color?: string; patientAge?: number; workDescription?: string; priority: Priority; workflowId: string; currentStageId: string; location: Location;
  operationalStatus: OperationalStatus; technicianId?: string; createdAt: string; dueDate: string;
  lastMovementAt: string; qrToken: string; timeline: WorkOrderEvent[]; attachments: Attachment[];
}
