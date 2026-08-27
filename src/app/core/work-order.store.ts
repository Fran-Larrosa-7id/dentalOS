import { Injectable, computed, signal } from '@angular/core';
import { dentists, seedOrders, technicians, workflows, workTypes } from '../data/seed';
import { EventType, Location, Priority, WorkOrder } from '../domain/models';

const STORAGE_KEY = 'dentalos.work-orders.v1';
@Injectable({ providedIn: 'root' })
export class WorkOrderStore {
  readonly dentists = dentists;
  readonly technicians = technicians;
  readonly workflows = workflows;
  readonly workTypes = workTypes;
  private readonly data = signal<WorkOrder[]>(this.read());
  readonly orders = this.data.asReadonly();
  readonly labOrders = computed(() => this.data().filter((order) => order.location === 'LAB'));
  readonly dentistOrders = computed(() =>
    this.data().filter((order) => order.location === 'DENTIST'),
  );
  readonly overdueOrders = computed(() =>
    this.data().filter(
      (order) => new Date(order.dueDate) < this.today() && order.operationalStatus !== 'DELIVERED',
    ),
  );
  readonly urgentOrders = computed(() =>
    this.data().filter((order) => order.priority === 'URGENT'),
  );
  private read(): WorkOrder[] {
    if (typeof localStorage === 'undefined') return seedOrders;
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '') as WorkOrder[];
      const storedIds = new Set(stored.map((order) => order.id));
      return [...seedOrders.filter((order) => !storedIds.has(order.id)), ...stored];
    } catch {
      return seedOrders;
    }
  }
  private persist(orders: WorkOrder[]) {
    this.data.set(orders);
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
  private today() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }
  order(id: string) {
    return this.data().find((order) => order.id === id);
  }
  byToken(token: string) {
    return this.data().find((order) => order.qrToken === token);
  }
  dentist(order: WorkOrder) {
    return this.dentists.find((item) => item.id === order.dentistId);
  }
  type(order: WorkOrder) {
    return this.workTypes.find((item) => item.id === order.workTypeId);
  }
  stage(order: WorkOrder) {
    return this.workflows
      .find((item) => item.id === order.workflowId)
      ?.groups.flatMap((group) => group.stages)
      .find((stage) => stage.id === order.currentStageId);
  }
  stages(order: WorkOrder) {
    return (
      this.workflows
        .find((item) => item.id === order.workflowId)
        ?.groups.flatMap((group) => group.stages)
        .sort((a, b) => a.order - b.order) ?? []
    );
  }
  create(input: {
    dentistId: string;
    patientReference: string;
    workTypeId: string;
    color?: string;
    patientAge?: number;
    workDescription?: string;
    dueDate: string;
    priority: Priority;
  }) {
    const workType = this.workTypes.find((item) => item.id === input.workTypeId)!;
    const workflow = this.workflows.find((item) => item.id === workType.workflowId)!;
    const now = new Date().toISOString();
    const number = Math.max(...this.data().map((item) => item.number), 1800) + 1;
    const order: WorkOrder = {
      id: crypto.randomUUID(),
      number,
      ...input,
      workflowId: workflow.id,
      currentStageId: workflow.groups[0].stages[0].id,
      location: 'LAB',
      operationalStatus: 'ACTIVE',
      createdAt: now,
      lastMovementAt: now,
      qrToken: crypto.randomUUID(),
      timeline: [
        { id: crypto.randomUUID(), type: 'CREATED', timestamp: now, note: 'Trabajo recibido' },
      ],
      attachments: [],
    };
    this.persist([order, ...this.data()]);
    return order;
  }
  private update(id: string, mutate: (order: WorkOrder) => WorkOrder) {
    this.persist(this.data().map((order) => (order.id === id ? mutate(order) : order)));
  }
  private event(
    order: WorkOrder,
    type: EventType,
    extras: Partial<WorkOrder['timeline'][number]> = {},
  ) {
    return { id: crypto.randomUUID(), type, timestamp: new Date().toISOString(), ...extras };
  }
  advance(id: string) {
    this.update(id, (order) => {
      const stages = this.stages(order);
      const next = stages[stages.findIndex((stage) => stage.id === order.currentStageId) + 1];
      const now = new Date().toISOString();
      if (!next)
        return {
          ...order,
          operationalStatus: 'COMPLETED',
          lastMovementAt: now,
          timeline: [...order.timeline, this.event(order, 'COMPLETED')],
        };
      return {
        ...order,
        currentStageId: next.id,
        lastMovementAt: now,
        timeline: [
          ...order.timeline,
          this.event(order, 'STAGE_COMPLETED', {
            stageId: next.id,
            previousStageId: order.currentStageId,
          }),
        ],
      };
    });
  }
  sendToDentist(id: string) {
    this.move(id, 'DENTIST', 'WAITING', 'SENT_TO_DENTIST');
  }
  returnToLab(id: string) {
    this.move(id, 'LAB', 'ACTIVE', 'RETURNED_TO_LAB');
  }
  private move(
    id: string,
    location: Location,
    operationalStatus: WorkOrder['operationalStatus'],
    type: EventType,
  ) {
    this.update(id, (order) => {
      const now = new Date().toISOString();
      return {
        ...order,
        location,
        operationalStatus,
        lastMovementAt: now,
        timeline: [...order.timeline, this.event(order, type)],
      };
    });
  }
  rework(id: string, stageId: string, reason: string) {
    this.update(id, (order) => ({
      ...order,
      currentStageId: stageId,
      location: 'LAB',
      operationalStatus: 'REWORK',
      lastMovementAt: new Date().toISOString(),
      timeline: [
        ...order.timeline,
        this.event(order, 'REWORK_REQUESTED', {
          stageId,
          previousStageId: order.currentStageId,
          reworkReason: reason,
        }),
      ],
    }));
  }
  addNote(id: string, note: string) {
    if (note.trim())
      this.update(id, (order) => ({
        ...order,
        timeline: [...order.timeline, this.event(order, 'NOTE_ADDED', { note })],
      }));
  }
  reset() {
    this.persist(seedOrders);
  }
}
