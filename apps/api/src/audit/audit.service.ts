export type AuditRecordInput = {
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
};

export type AuditRecord = AuditRecordInput & {
  id: string;
  createdAt: Date;
};

@Injectable()
export class AuditService {
  private readonly events: AuditRecord[] = [];

  record(input: AuditRecordInput): AuditRecord {
    const event: AuditRecord = {
      ...input,
      id: `audit-${this.events.length + 1}`,
      createdAt: new Date(),
    };
    this.events.push(event);
    return event;
  }

  list(): AuditRecord[] {
    return [...this.events];
  }
}
import { Injectable } from "@nestjs/common";
