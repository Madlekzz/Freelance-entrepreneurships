import {
  type Block,
  type KnownBlock,
  type WebAPIPlatformError,
  WebClient,
} from "@slack/web-api";

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export type SlackMessageContent = (Block | KnownBlock)[];

interface SlackWebhookResponse {
  success: boolean;
  error?: string;
}

/**
 * Sends a notification to a Slack channel via webhook URL.
 * Used for channel-wide notifications (e.g., IT team notifications).
 */
export const sendSlackWebhookNotification = async (
  webhookUrl: string,
  content: SlackMessageContent,
): Promise<SlackWebhookResponse> => {
  try {
    const payload = {
      blocks: content,
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[SlackService] Webhook error: ${response.status} - ${errorText}`,
      );
      return {
        success: false,
        error: `Webhook returned status ${response.status}: ${errorText}`,
      };
    }

    return { success: true };
  } catch (error: unknown) {
    const genericError = error as Error;
    console.error(
      `[SlackService] Fallo al enviar notificación via webhook:`,
      genericError.message,
    );
    return {
      success: false,
      error: genericError.message,
    };
  }
};

export interface SlackNotificationResponse {
  success: boolean;
  slackUserId: string | null;
  error?: string;
}

/**
 * Busca el ID de un usuario en Slack utilizando su correo electrónico.
 */
export const getSlackIdByEmail = async (
  email: string,
): Promise<string | null> => {
  try {
    const result = await slackClient.users.lookupByEmail({ email });
    return result.user?.id || null;
  } catch (error: unknown) {
    // Verificamos si es un error específico de la plataforma Slack
    const slackError = error as WebAPIPlatformError;

    console.error(
      `[SlackService] Error buscando email ${email}:`,
      slackError.data?.error || slackError.message,
    );
    return null;
  }
};

/**
 * Envía una notificación de Slack.
 * Retorna los datos necesarios para que el controlador realice el registro en DB.
 */
export const sendSlackNotification = async (
  email: string,
  content: SlackMessageContent,
): Promise<SlackNotificationResponse> => {
  const slackUserId = await getSlackIdByEmail(email);

  if (!slackUserId) {
    return {
      success: false,
      slackUserId: null,
      error: `No se encontró un usuario de Slack vinculado al correo: ${email}`,
    };
  }

  try {
    await slackClient.chat.postMessage({
      channel: slackUserId,
      text: "Actualización de pedido", // Fallback para notificaciones push
      blocks: content,
    });

    return {
      success: true,
      slackUserId,
    };
  } catch (error: unknown) {
    // Aquí capturamos cualquier error (de red o de Slack)
    const genericError = error as Error;

    console.error(
      `[SlackService] Fallo al enviar notificación a ${email}:`,
      genericError.message,
    );

    return {
      success: false,
      slackUserId,
      error: genericError.message,
    };
  }
};
