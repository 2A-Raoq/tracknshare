import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { randomUUID } from 'crypto'
import type { Response } from 'express'

/**
 * Filtre d'exceptions global : normalise toutes les erreurs HTTP au format
 * du contrat API (docs/api-contract.md) :
 *
 * ```json
 * {
 *   "success": false,
 *   "error": { "code": "ERROR_CODE", "message": "Message lisible.", "requestId": "..." }
 * }
 * ```
 *
 * RÉTRO-COMPATIBILITÉ : les clients web/mobile existants lisent
 * `response.data.message` (comparé aux codes métier bruts, ex.
 * `'CONVERSATION_RECIPIENT_INVALID'`) et `response.data.statusCode`.
 * Ces champs top-level sont donc CONSERVÉS à l'identique du format NestJS
 * par défaut, en plus du bloc `error{}` normalisé.
 */

// Les services lancent le code métier comme message : `new NotFoundException('TEAM_NOT_FOUND')`.
const BUSINESS_CODE_PATTERN = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+$/

// Messages lisibles pour les codes métier connus (fallback générique sinon).
const CODE_MESSAGES: Record<string, string> = {
  AUTH_INVALID_CREDENTIALS: 'Identifiants invalides.',
  AUTH_UNAUTHORIZED: 'Authentification requise.',
  AUTH_FORBIDDEN: 'Accès refusé.',
  USER_EMAIL_ALREADY_EXISTS: 'Cet email est déjà utilisé.',
  USER_USERNAME_ALREADY_EXISTS: "Ce nom d'utilisateur est déjà utilisé.",
  USER_NOT_FOUND: 'Utilisateur introuvable.',
  VALIDATION_ERROR: 'Données invalides.',
  STATS_PROVIDER_FAILED: 'La synchronisation des statistiques a échoué.',
  STATS_SYNC_CONFLICT: 'Une synchronisation est déjà en cours, réessayez.',
  TEAM_NOT_FOUND: 'Équipe introuvable.',
  TEAM_NAME_ALREADY_EXISTS: "Ce nom d'équipe est déjà pris.",
  TEAM_ALREADY_MEMBER: 'Vous êtes déjà membre de cette équipe.',
  TEAM_INVALID_INVITE_CODE: "Code d'invitation invalide.",
  TEAM_MEMBER_REQUIRED: "Vous devez être membre de l'équipe.",
  TEAM_NOT_MEMBER: "Vous n'êtes pas membre de cette équipe.",
  CHAT_MESSAGE_EMPTY: 'Le message est vide.',
  CHAT_MESSAGE_TOO_LONG: 'Le message est trop long.',
  PRIVATE_MESSAGE_EMPTY: 'Le message est vide.',
  PRIVATE_MESSAGE_TOO_LONG: 'Le message est trop long.',
  CONVERSATION_NOT_FOUND: 'Conversation introuvable.',
  CONVERSATION_PARTICIPANT_REQUIRED: 'Vous ne participez pas à cette conversation.',
  CONVERSATION_RECIPIENT_INVALID: 'Destinataire invalide.',
  FRIENDSHIP_NOT_FOUND: 'Relation introuvable.',
  STEAM_ACCOUNT_ALREADY_LINKED: 'Ce compte Steam est déjà lié à un autre joueur.',
  STEAM_ACCOUNT_NOT_LINKED: 'Aucun compte Steam lié.',
  STEAM_NO_TRACKED_GAMES: 'Aucun jeu Steam suivi.',
  GAME_ACCOUNT_NOT_FOUND: 'Compte de jeu introuvable.',
  RATE_LIMITED: 'Trop de requêtes, réessayez plus tard.',
  INTERNAL_ERROR: 'Une erreur interne est survenue.',
}

// Code de repli par statut HTTP quand le message n'est pas un code métier.
const STATUS_CODES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'VALIDATION_ERROR',
  [HttpStatus.UNAUTHORIZED]: 'AUTH_UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'AUTH_FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_ERROR',
  [HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMITED',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_ERROR',
}

const STATUS_MESSAGES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Requête invalide.',
  [HttpStatus.UNAUTHORIZED]: 'Authentification requise.',
  [HttpStatus.FORBIDDEN]: 'Accès refusé.',
  [HttpStatus.NOT_FOUND]: 'Ressource introuvable.',
  [HttpStatus.CONFLICT]: 'Conflit avec une ressource existante.',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Données invalides.',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Trop de requêtes, réessayez plus tard.',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Une erreur interne est survenue.',
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    // Les gateways Socket.io gèrent leurs erreurs eux-mêmes (émission 'error').
    if (host.getType() !== 'http') {
      throw exception
    }

    const response = host.switchToHttp().getResponse<Response>()
    const requestId = randomUUID()

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    // `message` legacy : identique au format NestJS par défaut (les clients
    // web/mobile comparent ce champ aux codes métier). string | string[].
    let legacyMessage: string | string[] = 'Internal server error'
    if (exception instanceof HttpException) {
      const body = exception.getResponse()
      if (typeof body === 'string') {
        legacyMessage = body
      } else if (body && typeof body === 'object') {
        const raw = (body as { message?: string | string[] }).message
        legacyMessage = raw ?? exception.message
      } else {
        legacyMessage = exception.message
      }
    }

    const { code, readableMessage } = this.resolveError(status, legacyMessage)

    if (status >= 500) {
      // Log serveur complet (jamais renvoyé au client — pas de stack trace).
      const detail = exception instanceof Error ? exception.stack : String(exception)
      this.logger.error(`[${requestId}] ${detail}`)
    }

    response.status(status).json({
      success: false,
      // Champs legacy conservés pour rétro-compatibilité clients web/mobile.
      statusCode: status,
      message: legacyMessage,
      // Format normalisé du contrat API.
      error: {
        code,
        message: readableMessage,
        requestId,
      },
    })
  }

  private resolveError(
    status: number,
    message: string | string[],
  ): { code: string; readableMessage: string } {
    // Erreurs de validation (ValidationPipe) : message est un tableau.
    if (Array.isArray(message)) {
      return { code: 'VALIDATION_ERROR', readableMessage: message.join(' ; ') }
    }

    // Code métier SCREAMING_SNAKE lancé par les services.
    if (BUSINESS_CODE_PATTERN.test(message)) {
      return {
        code: message,
        readableMessage:
          CODE_MESSAGES[message] ?? STATUS_MESSAGES[status] ?? 'Une erreur est survenue.',
      }
    }

    return {
      code: STATUS_CODES[status] ?? 'INTERNAL_ERROR',
      readableMessage: STATUS_MESSAGES[status] ?? 'Une erreur est survenue.',
    }
  }
}
