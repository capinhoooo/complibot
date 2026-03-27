import type { FastifyReply } from 'fastify';
import { IS_DEV } from '../config/main-config.ts';

interface ErrorContext {
  [key: string]: unknown;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
    stack?: string;
  };
  data: null;
  timestamp?: string;
}

/**
 * Main error handler - logs to console and returns standardized error response.
 * ErrorLog DB model has been removed; errors are logged via structured console output.
 */
export const handleError = async (
  reply: FastifyReply,
  statusCode: number,
  message: string,
  errorCode: string,
  originalError: Error | null = null,
  context: ErrorContext | null = null
): Promise<FastifyReply> => {
  try {
    const request = reply.request;
    const userId = (request as { user?: { id: string } }).user?.id || null;

    // Extract request information
    const requestInfo = {
      method: request.method,
      path: request.url,
      userAgent: request.headers['user-agent'] || null,
      ip: request.ip || request.headers['x-forwarded-for'] || request.socket?.remoteAddress || null,
    };

    // Log to console with structured data
    console.error(`[${errorCode}] ${message}`, {
      statusCode,
      userId,
      path: requestInfo.path,
      method: requestInfo.method,
      context: context ? JSON.stringify(context) : null,
      originalError: originalError?.message,
      stack: originalError?.stack,
    });

    // Send standardized error response
    const response: ErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message,
        ...(IS_DEV &&
          originalError && {
            details: originalError.message,
            stack: originalError.stack,
          }),
      },
      data: null,
      timestamp: new Date().toISOString(),
    };

    return reply.code(statusCode).send(response);
  } catch (handlerError) {
    console.error('Error in error handler:', handlerError);

    // Fallback response if error handler fails
    return reply.code(statusCode).send({
      success: false,
      error: {
        code: errorCode,
        message,
      },
      data: null,
    });
  }
};

/**
 * Handle validation errors (missing/invalid fields)
 */
export const handleValidationError = (reply: FastifyReply, missingFields: string[]): Promise<FastifyReply> => {
  return handleError(reply, 400, `Missing required fields: ${missingFields.join(', ')}`, 'VALIDATION_ERROR', null, {
    missingFields,
  });
};

/**
 * Handle resource not found errors
 */
export const handleNotFoundError = (reply: FastifyReply, resource: string): Promise<FastifyReply> => {
  return handleError(reply, 404, `${resource} not found`, 'NOT_FOUND', null, { resource });
};

/**
 * Handle unauthorized errors (401)
 */
export const handleUnauthorizedError = (reply: FastifyReply, reason: string = 'Unauthorized'): Promise<FastifyReply> => {
  return handleError(reply, 401, reason, 'UNAUTHORIZED');
};

/**
 * Handle forbidden errors (403)
 */
export const handleForbiddenError = (reply: FastifyReply, reason: string = 'Forbidden'): Promise<FastifyReply> => {
  return handleError(reply, 403, reason, 'FORBIDDEN');
};

/**
 * Handle database errors
 */
export const handleDatabaseError = (
  reply: FastifyReply,
  operation: string,
  originalError: Error
): Promise<FastifyReply> => {
  return handleError(reply, 500, `Database error during ${operation}`, 'DATABASE_ERROR', originalError, { operation });
};

/**
 * Handle internal server errors
 */
export const handleServerError = (reply: FastifyReply, originalError: Error): Promise<FastifyReply> => {
  return handleError(reply, 500, 'Internal server error', 'INTERNAL_ERROR', originalError);
};
