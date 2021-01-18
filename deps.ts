// Opine v1.0.2
export {
  Router,
  opine,
  json,
  urlencoded,
} from 'https://deno.land/x/opine@1.0.2/mod.ts';
export type {
  Request,
  Response,
  NextFunction,
  IRouter,
  Opine,
} from 'https://deno.land/x/opine@1.0.2/mod.ts';

// validasaur v0.15.0
export {
  isString,
  required,
  isNumber,
  isArray,
  validateArray,
  validateObject,
  firstMessages,
  flattenMessages,
  validate,
  minLength,
  maxLength,
  match,
  isEmail,
} from 'https://deno.land/x/validasaur@v0.15.0/mod.ts';
export type {
  ValidationRules,
  ValidationResult,
} from 'https://deno.land/x/validasaur@v0.15.0/mod.ts';

// di v0.1.1 (dependency injector)
import { ServiceCollection } from 'https://deno.land/x/di@v0.1.1/mod.ts';
export { Inject, Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
export type { IServiceCollection } from 'https://deno.land/x/di@v0.1.1/mod.ts';
export const serviceCollection = new ServiceCollection();

// dotenv v2.0.0
export { config } from 'https://deno.land/x/dotenv/mod.ts';

// deno_s3 @0.3.0
export { S3Bucket } from 'https://deno.land/x/s3@0.3.0/mod.ts';

// multiparser @v2.0.3
export { multiParser } from 'https://deno.land/x/multiparser@v2.0.3/mod.ts';
export type {
  Form,
  FormFile,
} from 'https://deno.land/x/multiparser@v2.0.3/mod.ts';

// djwt @v2.0
export * as jwt from 'https://deno.land/x/djwt@v2.0/mod.ts';
export type {
  AlgorithmInput,
  Algorithm,
} from 'https://deno.land/x/djwt@v2.0/algorithm.ts';

// cors @1.2.1
export { opineCors } from 'https://deno.land/x/cors@v1.2.1/mod.ts';

// http-errors @3.0.0
export { createError } from 'https://deno.land/x/http_errors@3.0.0/mod.ts';
export type { IError } from 'https://deno.land/x/http_errors@3.0.0/mod.ts';

// logger @0.83.0
export * as log from 'https://deno.land/std@0.83.0/log/mod.ts';

// event @0.2.1
export { EventEmitter } from 'https://deno.land/x/event@0.2.1/mod.ts';

// bcrypt v0.2.4
export * as bcrypt from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts';

// AWS SES client v0.01
export {
  SESv2Client as SES,
  SendEmailCommand,
} from 'https://deno.land/x/aws_sdk@v0.0.1/client-sesv2/mod.ts';
export type { SendEmailRequest } from 'https://deno.land/x/aws_sdk@v0.0.1/client-sesv2/mod.ts';

// uuid v0.83.0
export { v4, v5 } from 'https://deno.land/std@0.83.0/uuid/mod.ts';

// handlebars v0.6.0
export { Handlebars } from 'https://deno.land/x/handlebars@v0.6.0/mod.ts';
export type { HandlebarsConfig } from 'https://deno.land/x/handlebars@v0.6.0/mod.ts';

// media_types v2.7.0
export { extension } from 'https://deno.land/x/media_types@v2.7.0/mod.ts';

// Cotton v0.7.5
export {
  connect,
  Model,
  Column,
  Primary,
  HasMany,
  BelongsTo,
  DataType,
} from 'https://deno.land/x/cotton@v0.7.5/mod.ts';
export type { Manager } from 'https://deno.land/x/cotton@v0.7.5/mod.ts';
export type { PostgresAdapter } from 'https://deno.land/x/cotton@v0.7.5/src/adapters/postgres.ts';
export type { Adapter } from 'https://deno.land/x/cotton@v0.7.5/src/adapters/adapter.ts';
