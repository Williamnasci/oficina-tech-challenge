import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ServiceOrderStatusChanged,
  StatusNotificationGateway,
} from '../../application/ports/status-notification.gateway';

@Injectable()
export class WebhookStatusNotificationGateway extends StatusNotificationGateway {
  private readonly logger = new Logger(WebhookStatusNotificationGateway.name);

  constructor(private readonly configService: ConfigService) {
    super();
  }

  async notifyStatusChanged(event: ServiceOrderStatusChanged): Promise<void> {
    const webhookUrl = this.configService.get<string>(
      'STATUS_NOTIFICATION_WEBHOOK_URL',
    );

    if (!webhookUrl) {
      this.logger.debug(
        `Status notification skipped for service order ${event.serviceOrderId}: webhook not configured.`,
      );
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(event),
        signal: AbortSignal.timeout(3_000),
      });

      if (!response.ok) {
        this.logger.warn(
          `Status notification returned HTTP ${response.status} for service order ${event.serviceOrderId}.`,
        );
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'unknown error';
      this.logger.warn(
        `Status notification failed for service order ${event.serviceOrderId}: ${reason}`,
      );
    }
  }
}
