
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model AuditSession
 * 
 */
export type AuditSession = $Result.DefaultSelection<Prisma.$AuditSessionPayload>
/**
 * Model ComplianceCertificate
 * 
 */
export type ComplianceCertificate = $Result.DefaultSelection<Prisma.$ComplianceCertificatePayload>
/**
 * Model ChatMessage
 * 
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>
/**
 * Model KnowledgeChunk
 * 
 */
export type KnowledgeChunk = $Result.DefaultSelection<Prisma.$KnowledgeChunkPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more AuditSessions
 * const auditSessions = await prisma.auditSession.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more AuditSessions
   * const auditSessions = await prisma.auditSession.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.auditSession`: Exposes CRUD operations for the **AuditSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditSessions
    * const auditSessions = await prisma.auditSession.findMany()
    * ```
    */
  get auditSession(): Prisma.AuditSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.complianceCertificate`: Exposes CRUD operations for the **ComplianceCertificate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ComplianceCertificates
    * const complianceCertificates = await prisma.complianceCertificate.findMany()
    * ```
    */
  get complianceCertificate(): Prisma.ComplianceCertificateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.knowledgeChunk`: Exposes CRUD operations for the **KnowledgeChunk** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KnowledgeChunks
    * const knowledgeChunks = await prisma.knowledgeChunk.findMany()
    * ```
    */
  get knowledgeChunk(): Prisma.KnowledgeChunkDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    AuditSession: 'AuditSession',
    ComplianceCertificate: 'ComplianceCertificate',
    ChatMessage: 'ChatMessage',
    KnowledgeChunk: 'KnowledgeChunk'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "auditSession" | "complianceCertificate" | "chatMessage" | "knowledgeChunk"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AuditSession: {
        payload: Prisma.$AuditSessionPayload<ExtArgs>
        fields: Prisma.AuditSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditSessionPayload>
          }
          findFirst: {
            args: Prisma.AuditSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditSessionPayload>
          }
          findMany: {
            args: Prisma.AuditSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditSessionPayload>[]
          }
          create: {
            args: Prisma.AuditSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditSessionPayload>
          }
          createMany: {
            args: Prisma.AuditSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditSessionPayload>[]
          }
          delete: {
            args: Prisma.AuditSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditSessionPayload>
          }
          update: {
            args: Prisma.AuditSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditSessionPayload>
          }
          deleteMany: {
            args: Prisma.AuditSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditSessionPayload>[]
          }
          upsert: {
            args: Prisma.AuditSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditSessionPayload>
          }
          aggregate: {
            args: Prisma.AuditSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditSession>
          }
          groupBy: {
            args: Prisma.AuditSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditSessionCountArgs<ExtArgs>
            result: $Utils.Optional<AuditSessionCountAggregateOutputType> | number
          }
        }
      }
      ComplianceCertificate: {
        payload: Prisma.$ComplianceCertificatePayload<ExtArgs>
        fields: Prisma.ComplianceCertificateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ComplianceCertificateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComplianceCertificatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ComplianceCertificateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComplianceCertificatePayload>
          }
          findFirst: {
            args: Prisma.ComplianceCertificateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComplianceCertificatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ComplianceCertificateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComplianceCertificatePayload>
          }
          findMany: {
            args: Prisma.ComplianceCertificateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComplianceCertificatePayload>[]
          }
          create: {
            args: Prisma.ComplianceCertificateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComplianceCertificatePayload>
          }
          createMany: {
            args: Prisma.ComplianceCertificateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ComplianceCertificateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComplianceCertificatePayload>[]
          }
          delete: {
            args: Prisma.ComplianceCertificateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComplianceCertificatePayload>
          }
          update: {
            args: Prisma.ComplianceCertificateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComplianceCertificatePayload>
          }
          deleteMany: {
            args: Prisma.ComplianceCertificateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ComplianceCertificateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ComplianceCertificateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComplianceCertificatePayload>[]
          }
          upsert: {
            args: Prisma.ComplianceCertificateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComplianceCertificatePayload>
          }
          aggregate: {
            args: Prisma.ComplianceCertificateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComplianceCertificate>
          }
          groupBy: {
            args: Prisma.ComplianceCertificateGroupByArgs<ExtArgs>
            result: $Utils.Optional<ComplianceCertificateGroupByOutputType>[]
          }
          count: {
            args: Prisma.ComplianceCertificateCountArgs<ExtArgs>
            result: $Utils.Optional<ComplianceCertificateCountAggregateOutputType> | number
          }
        }
      }
      ChatMessage: {
        payload: Prisma.$ChatMessagePayload<ExtArgs>
        fields: Prisma.ChatMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findFirst: {
            args: Prisma.ChatMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findMany: {
            args: Prisma.ChatMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          create: {
            args: Prisma.ChatMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          createMany: {
            args: Prisma.ChatMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          delete: {
            args: Prisma.ChatMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          update: {
            args: Prisma.ChatMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          deleteMany: {
            args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          upsert: {
            args: Prisma.ChatMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          aggregate: {
            args: Prisma.ChatMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMessage>
          }
          groupBy: {
            args: Prisma.ChatMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageCountAggregateOutputType> | number
          }
        }
      }
      KnowledgeChunk: {
        payload: Prisma.$KnowledgeChunkPayload<ExtArgs>
        fields: Prisma.KnowledgeChunkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KnowledgeChunkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KnowledgeChunkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>
          }
          findFirst: {
            args: Prisma.KnowledgeChunkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KnowledgeChunkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>
          }
          findMany: {
            args: Prisma.KnowledgeChunkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>[]
          }
          delete: {
            args: Prisma.KnowledgeChunkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>
          }
          update: {
            args: Prisma.KnowledgeChunkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>
          }
          deleteMany: {
            args: Prisma.KnowledgeChunkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KnowledgeChunkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KnowledgeChunkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChunkPayload>[]
          }
          aggregate: {
            args: Prisma.KnowledgeChunkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKnowledgeChunk>
          }
          groupBy: {
            args: Prisma.KnowledgeChunkGroupByArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeChunkGroupByOutputType>[]
          }
          count: {
            args: Prisma.KnowledgeChunkCountArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeChunkCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    auditSession?: AuditSessionOmit
    complianceCertificate?: ComplianceCertificateOmit
    chatMessage?: ChatMessageOmit
    knowledgeChunk?: KnowledgeChunkOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AuditSessionCountOutputType
   */

  export type AuditSessionCountOutputType = {
    messages: number
  }

  export type AuditSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | AuditSessionCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * AuditSessionCountOutputType without action
   */
  export type AuditSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSessionCountOutputType
     */
    select?: AuditSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AuditSessionCountOutputType without action
   */
  export type AuditSessionCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AuditSession
   */

  export type AggregateAuditSession = {
    _count: AuditSessionCountAggregateOutputType | null
    _avg: AuditSessionAvgAggregateOutputType | null
    _sum: AuditSessionSumAggregateOutputType | null
    _min: AuditSessionMinAggregateOutputType | null
    _max: AuditSessionMaxAggregateOutputType | null
  }

  export type AuditSessionAvgAggregateOutputType = {
    score: number | null
  }

  export type AuditSessionSumAggregateOutputType = {
    score: number | null
  }

  export type AuditSessionMinAggregateOutputType = {
    id: string | null
    walletAddress: string | null
    code: string | null
    contractName: string | null
    score: number | null
    verdict: string | null
    auditHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuditSessionMaxAggregateOutputType = {
    id: string | null
    walletAddress: string | null
    code: string | null
    contractName: string | null
    score: number | null
    verdict: string | null
    auditHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuditSessionCountAggregateOutputType = {
    id: number
    walletAddress: number
    code: number
    contractName: number
    findings: number
    score: number
    verdict: number
    auditHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuditSessionAvgAggregateInputType = {
    score?: true
  }

  export type AuditSessionSumAggregateInputType = {
    score?: true
  }

  export type AuditSessionMinAggregateInputType = {
    id?: true
    walletAddress?: true
    code?: true
    contractName?: true
    score?: true
    verdict?: true
    auditHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuditSessionMaxAggregateInputType = {
    id?: true
    walletAddress?: true
    code?: true
    contractName?: true
    score?: true
    verdict?: true
    auditHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuditSessionCountAggregateInputType = {
    id?: true
    walletAddress?: true
    code?: true
    contractName?: true
    findings?: true
    score?: true
    verdict?: true
    auditHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuditSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditSession to aggregate.
     */
    where?: AuditSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditSessions to fetch.
     */
    orderBy?: AuditSessionOrderByWithRelationInput | AuditSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditSessions
    **/
    _count?: true | AuditSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuditSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuditSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditSessionMaxAggregateInputType
  }

  export type GetAuditSessionAggregateType<T extends AuditSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditSession[P]>
      : GetScalarType<T[P], AggregateAuditSession[P]>
  }




  export type AuditSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditSessionWhereInput
    orderBy?: AuditSessionOrderByWithAggregationInput | AuditSessionOrderByWithAggregationInput[]
    by: AuditSessionScalarFieldEnum[] | AuditSessionScalarFieldEnum
    having?: AuditSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditSessionCountAggregateInputType | true
    _avg?: AuditSessionAvgAggregateInputType
    _sum?: AuditSessionSumAggregateInputType
    _min?: AuditSessionMinAggregateInputType
    _max?: AuditSessionMaxAggregateInputType
  }

  export type AuditSessionGroupByOutputType = {
    id: string
    walletAddress: string | null
    code: string
    contractName: string | null
    findings: JsonValue
    score: number
    verdict: string
    auditHash: string | null
    createdAt: Date
    updatedAt: Date
    _count: AuditSessionCountAggregateOutputType | null
    _avg: AuditSessionAvgAggregateOutputType | null
    _sum: AuditSessionSumAggregateOutputType | null
    _min: AuditSessionMinAggregateOutputType | null
    _max: AuditSessionMaxAggregateOutputType | null
  }

  type GetAuditSessionGroupByPayload<T extends AuditSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditSessionGroupByOutputType[P]>
            : GetScalarType<T[P], AuditSessionGroupByOutputType[P]>
        }
      >
    >


  export type AuditSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletAddress?: boolean
    code?: boolean
    contractName?: boolean
    findings?: boolean
    score?: boolean
    verdict?: boolean
    auditHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    certificate?: boolean | AuditSession$certificateArgs<ExtArgs>
    messages?: boolean | AuditSession$messagesArgs<ExtArgs>
    _count?: boolean | AuditSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditSession"]>

  export type AuditSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletAddress?: boolean
    code?: boolean
    contractName?: boolean
    findings?: boolean
    score?: boolean
    verdict?: boolean
    auditHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["auditSession"]>

  export type AuditSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletAddress?: boolean
    code?: boolean
    contractName?: boolean
    findings?: boolean
    score?: boolean
    verdict?: boolean
    auditHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["auditSession"]>

  export type AuditSessionSelectScalar = {
    id?: boolean
    walletAddress?: boolean
    code?: boolean
    contractName?: boolean
    findings?: boolean
    score?: boolean
    verdict?: boolean
    auditHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuditSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletAddress" | "code" | "contractName" | "findings" | "score" | "verdict" | "auditHash" | "createdAt" | "updatedAt", ExtArgs["result"]["auditSession"]>
  export type AuditSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    certificate?: boolean | AuditSession$certificateArgs<ExtArgs>
    messages?: boolean | AuditSession$messagesArgs<ExtArgs>
    _count?: boolean | AuditSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AuditSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AuditSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AuditSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditSession"
    objects: {
      certificate: Prisma.$ComplianceCertificatePayload<ExtArgs> | null
      messages: Prisma.$ChatMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      walletAddress: string | null
      code: string
      contractName: string | null
      findings: Prisma.JsonValue
      score: number
      verdict: string
      auditHash: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["auditSession"]>
    composites: {}
  }

  type AuditSessionGetPayload<S extends boolean | null | undefined | AuditSessionDefaultArgs> = $Result.GetResult<Prisma.$AuditSessionPayload, S>

  type AuditSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditSessionCountAggregateInputType | true
    }

  export interface AuditSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditSession'], meta: { name: 'AuditSession' } }
    /**
     * Find zero or one AuditSession that matches the filter.
     * @param {AuditSessionFindUniqueArgs} args - Arguments to find a AuditSession
     * @example
     * // Get one AuditSession
     * const auditSession = await prisma.auditSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditSessionFindUniqueArgs>(args: SelectSubset<T, AuditSessionFindUniqueArgs<ExtArgs>>): Prisma__AuditSessionClient<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditSessionFindUniqueOrThrowArgs} args - Arguments to find a AuditSession
     * @example
     * // Get one AuditSession
     * const auditSession = await prisma.auditSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditSessionClient<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditSessionFindFirstArgs} args - Arguments to find a AuditSession
     * @example
     * // Get one AuditSession
     * const auditSession = await prisma.auditSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditSessionFindFirstArgs>(args?: SelectSubset<T, AuditSessionFindFirstArgs<ExtArgs>>): Prisma__AuditSessionClient<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditSessionFindFirstOrThrowArgs} args - Arguments to find a AuditSession
     * @example
     * // Get one AuditSession
     * const auditSession = await prisma.auditSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditSessionClient<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditSessions
     * const auditSessions = await prisma.auditSession.findMany()
     * 
     * // Get first 10 AuditSessions
     * const auditSessions = await prisma.auditSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditSessionWithIdOnly = await prisma.auditSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditSessionFindManyArgs>(args?: SelectSubset<T, AuditSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditSession.
     * @param {AuditSessionCreateArgs} args - Arguments to create a AuditSession.
     * @example
     * // Create one AuditSession
     * const AuditSession = await prisma.auditSession.create({
     *   data: {
     *     // ... data to create a AuditSession
     *   }
     * })
     * 
     */
    create<T extends AuditSessionCreateArgs>(args: SelectSubset<T, AuditSessionCreateArgs<ExtArgs>>): Prisma__AuditSessionClient<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditSessions.
     * @param {AuditSessionCreateManyArgs} args - Arguments to create many AuditSessions.
     * @example
     * // Create many AuditSessions
     * const auditSession = await prisma.auditSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditSessionCreateManyArgs>(args?: SelectSubset<T, AuditSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditSessions and returns the data saved in the database.
     * @param {AuditSessionCreateManyAndReturnArgs} args - Arguments to create many AuditSessions.
     * @example
     * // Create many AuditSessions
     * const auditSession = await prisma.auditSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditSessions and only return the `id`
     * const auditSessionWithIdOnly = await prisma.auditSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditSession.
     * @param {AuditSessionDeleteArgs} args - Arguments to delete one AuditSession.
     * @example
     * // Delete one AuditSession
     * const AuditSession = await prisma.auditSession.delete({
     *   where: {
     *     // ... filter to delete one AuditSession
     *   }
     * })
     * 
     */
    delete<T extends AuditSessionDeleteArgs>(args: SelectSubset<T, AuditSessionDeleteArgs<ExtArgs>>): Prisma__AuditSessionClient<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditSession.
     * @param {AuditSessionUpdateArgs} args - Arguments to update one AuditSession.
     * @example
     * // Update one AuditSession
     * const auditSession = await prisma.auditSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditSessionUpdateArgs>(args: SelectSubset<T, AuditSessionUpdateArgs<ExtArgs>>): Prisma__AuditSessionClient<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditSessions.
     * @param {AuditSessionDeleteManyArgs} args - Arguments to filter AuditSessions to delete.
     * @example
     * // Delete a few AuditSessions
     * const { count } = await prisma.auditSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditSessionDeleteManyArgs>(args?: SelectSubset<T, AuditSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditSessions
     * const auditSession = await prisma.auditSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditSessionUpdateManyArgs>(args: SelectSubset<T, AuditSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditSessions and returns the data updated in the database.
     * @param {AuditSessionUpdateManyAndReturnArgs} args - Arguments to update many AuditSessions.
     * @example
     * // Update many AuditSessions
     * const auditSession = await prisma.auditSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditSessions and only return the `id`
     * const auditSessionWithIdOnly = await prisma.auditSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditSession.
     * @param {AuditSessionUpsertArgs} args - Arguments to update or create a AuditSession.
     * @example
     * // Update or create a AuditSession
     * const auditSession = await prisma.auditSession.upsert({
     *   create: {
     *     // ... data to create a AuditSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditSession we want to update
     *   }
     * })
     */
    upsert<T extends AuditSessionUpsertArgs>(args: SelectSubset<T, AuditSessionUpsertArgs<ExtArgs>>): Prisma__AuditSessionClient<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditSessionCountArgs} args - Arguments to filter AuditSessions to count.
     * @example
     * // Count the number of AuditSessions
     * const count = await prisma.auditSession.count({
     *   where: {
     *     // ... the filter for the AuditSessions we want to count
     *   }
     * })
    **/
    count<T extends AuditSessionCountArgs>(
      args?: Subset<T, AuditSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditSessionAggregateArgs>(args: Subset<T, AuditSessionAggregateArgs>): Prisma.PrismaPromise<GetAuditSessionAggregateType<T>>

    /**
     * Group by AuditSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditSessionGroupByArgs['orderBy'] }
        : { orderBy?: AuditSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditSession model
   */
  readonly fields: AuditSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    certificate<T extends AuditSession$certificateArgs<ExtArgs> = {}>(args?: Subset<T, AuditSession$certificateArgs<ExtArgs>>): Prisma__ComplianceCertificateClient<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    messages<T extends AuditSession$messagesArgs<ExtArgs> = {}>(args?: Subset<T, AuditSession$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditSession model
   */
  interface AuditSessionFieldRefs {
    readonly id: FieldRef<"AuditSession", 'String'>
    readonly walletAddress: FieldRef<"AuditSession", 'String'>
    readonly code: FieldRef<"AuditSession", 'String'>
    readonly contractName: FieldRef<"AuditSession", 'String'>
    readonly findings: FieldRef<"AuditSession", 'Json'>
    readonly score: FieldRef<"AuditSession", 'Int'>
    readonly verdict: FieldRef<"AuditSession", 'String'>
    readonly auditHash: FieldRef<"AuditSession", 'String'>
    readonly createdAt: FieldRef<"AuditSession", 'DateTime'>
    readonly updatedAt: FieldRef<"AuditSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditSession findUnique
   */
  export type AuditSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuditSession to fetch.
     */
    where: AuditSessionWhereUniqueInput
  }

  /**
   * AuditSession findUniqueOrThrow
   */
  export type AuditSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuditSession to fetch.
     */
    where: AuditSessionWhereUniqueInput
  }

  /**
   * AuditSession findFirst
   */
  export type AuditSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuditSession to fetch.
     */
    where?: AuditSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditSessions to fetch.
     */
    orderBy?: AuditSessionOrderByWithRelationInput | AuditSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditSessions.
     */
    cursor?: AuditSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditSessions.
     */
    distinct?: AuditSessionScalarFieldEnum | AuditSessionScalarFieldEnum[]
  }

  /**
   * AuditSession findFirstOrThrow
   */
  export type AuditSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuditSession to fetch.
     */
    where?: AuditSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditSessions to fetch.
     */
    orderBy?: AuditSessionOrderByWithRelationInput | AuditSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditSessions.
     */
    cursor?: AuditSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditSessions.
     */
    distinct?: AuditSessionScalarFieldEnum | AuditSessionScalarFieldEnum[]
  }

  /**
   * AuditSession findMany
   */
  export type AuditSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuditSessions to fetch.
     */
    where?: AuditSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditSessions to fetch.
     */
    orderBy?: AuditSessionOrderByWithRelationInput | AuditSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditSessions.
     */
    cursor?: AuditSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditSessions.
     */
    skip?: number
    distinct?: AuditSessionScalarFieldEnum | AuditSessionScalarFieldEnum[]
  }

  /**
   * AuditSession create
   */
  export type AuditSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditSession.
     */
    data: XOR<AuditSessionCreateInput, AuditSessionUncheckedCreateInput>
  }

  /**
   * AuditSession createMany
   */
  export type AuditSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditSessions.
     */
    data: AuditSessionCreateManyInput | AuditSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditSession createManyAndReturn
   */
  export type AuditSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * The data used to create many AuditSessions.
     */
    data: AuditSessionCreateManyInput | AuditSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditSession update
   */
  export type AuditSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditSession.
     */
    data: XOR<AuditSessionUpdateInput, AuditSessionUncheckedUpdateInput>
    /**
     * Choose, which AuditSession to update.
     */
    where: AuditSessionWhereUniqueInput
  }

  /**
   * AuditSession updateMany
   */
  export type AuditSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditSessions.
     */
    data: XOR<AuditSessionUpdateManyMutationInput, AuditSessionUncheckedUpdateManyInput>
    /**
     * Filter which AuditSessions to update
     */
    where?: AuditSessionWhereInput
    /**
     * Limit how many AuditSessions to update.
     */
    limit?: number
  }

  /**
   * AuditSession updateManyAndReturn
   */
  export type AuditSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * The data used to update AuditSessions.
     */
    data: XOR<AuditSessionUpdateManyMutationInput, AuditSessionUncheckedUpdateManyInput>
    /**
     * Filter which AuditSessions to update
     */
    where?: AuditSessionWhereInput
    /**
     * Limit how many AuditSessions to update.
     */
    limit?: number
  }

  /**
   * AuditSession upsert
   */
  export type AuditSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditSession to update in case it exists.
     */
    where: AuditSessionWhereUniqueInput
    /**
     * In case the AuditSession found by the `where` argument doesn't exist, create a new AuditSession with this data.
     */
    create: XOR<AuditSessionCreateInput, AuditSessionUncheckedCreateInput>
    /**
     * In case the AuditSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditSessionUpdateInput, AuditSessionUncheckedUpdateInput>
  }

  /**
   * AuditSession delete
   */
  export type AuditSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditSessionInclude<ExtArgs> | null
    /**
     * Filter which AuditSession to delete.
     */
    where: AuditSessionWhereUniqueInput
  }

  /**
   * AuditSession deleteMany
   */
  export type AuditSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditSessions to delete
     */
    where?: AuditSessionWhereInput
    /**
     * Limit how many AuditSessions to delete.
     */
    limit?: number
  }

  /**
   * AuditSession.certificate
   */
  export type AuditSession$certificateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateInclude<ExtArgs> | null
    where?: ComplianceCertificateWhereInput
  }

  /**
   * AuditSession.messages
   */
  export type AuditSession$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * AuditSession without action
   */
  export type AuditSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditSessionInclude<ExtArgs> | null
  }


  /**
   * Model ComplianceCertificate
   */

  export type AggregateComplianceCertificate = {
    _count: ComplianceCertificateCountAggregateOutputType | null
    _avg: ComplianceCertificateAvgAggregateOutputType | null
    _sum: ComplianceCertificateSumAggregateOutputType | null
    _min: ComplianceCertificateMinAggregateOutputType | null
    _max: ComplianceCertificateMaxAggregateOutputType | null
  }

  export type ComplianceCertificateAvgAggregateOutputType = {
    score: number | null
  }

  export type ComplianceCertificateSumAggregateOutputType = {
    score: number | null
  }

  export type ComplianceCertificateMinAggregateOutputType = {
    id: string | null
    attestationUid: string | null
    txHash: string | null
    schemaUid: string | null
    contractAddress: string | null
    developerAddress: string | null
    score: number | null
    explorerUrl: string | null
    createdAt: Date | null
    auditSessionId: string | null
  }

  export type ComplianceCertificateMaxAggregateOutputType = {
    id: string | null
    attestationUid: string | null
    txHash: string | null
    schemaUid: string | null
    contractAddress: string | null
    developerAddress: string | null
    score: number | null
    explorerUrl: string | null
    createdAt: Date | null
    auditSessionId: string | null
  }

  export type ComplianceCertificateCountAggregateOutputType = {
    id: number
    attestationUid: number
    txHash: number
    schemaUid: number
    contractAddress: number
    developerAddress: number
    score: number
    findings: number
    explorerUrl: number
    createdAt: number
    auditSessionId: number
    _all: number
  }


  export type ComplianceCertificateAvgAggregateInputType = {
    score?: true
  }

  export type ComplianceCertificateSumAggregateInputType = {
    score?: true
  }

  export type ComplianceCertificateMinAggregateInputType = {
    id?: true
    attestationUid?: true
    txHash?: true
    schemaUid?: true
    contractAddress?: true
    developerAddress?: true
    score?: true
    explorerUrl?: true
    createdAt?: true
    auditSessionId?: true
  }

  export type ComplianceCertificateMaxAggregateInputType = {
    id?: true
    attestationUid?: true
    txHash?: true
    schemaUid?: true
    contractAddress?: true
    developerAddress?: true
    score?: true
    explorerUrl?: true
    createdAt?: true
    auditSessionId?: true
  }

  export type ComplianceCertificateCountAggregateInputType = {
    id?: true
    attestationUid?: true
    txHash?: true
    schemaUid?: true
    contractAddress?: true
    developerAddress?: true
    score?: true
    findings?: true
    explorerUrl?: true
    createdAt?: true
    auditSessionId?: true
    _all?: true
  }

  export type ComplianceCertificateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ComplianceCertificate to aggregate.
     */
    where?: ComplianceCertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ComplianceCertificates to fetch.
     */
    orderBy?: ComplianceCertificateOrderByWithRelationInput | ComplianceCertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ComplianceCertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ComplianceCertificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ComplianceCertificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ComplianceCertificates
    **/
    _count?: true | ComplianceCertificateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ComplianceCertificateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ComplianceCertificateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ComplianceCertificateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ComplianceCertificateMaxAggregateInputType
  }

  export type GetComplianceCertificateAggregateType<T extends ComplianceCertificateAggregateArgs> = {
        [P in keyof T & keyof AggregateComplianceCertificate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComplianceCertificate[P]>
      : GetScalarType<T[P], AggregateComplianceCertificate[P]>
  }




  export type ComplianceCertificateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ComplianceCertificateWhereInput
    orderBy?: ComplianceCertificateOrderByWithAggregationInput | ComplianceCertificateOrderByWithAggregationInput[]
    by: ComplianceCertificateScalarFieldEnum[] | ComplianceCertificateScalarFieldEnum
    having?: ComplianceCertificateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ComplianceCertificateCountAggregateInputType | true
    _avg?: ComplianceCertificateAvgAggregateInputType
    _sum?: ComplianceCertificateSumAggregateInputType
    _min?: ComplianceCertificateMinAggregateInputType
    _max?: ComplianceCertificateMaxAggregateInputType
  }

  export type ComplianceCertificateGroupByOutputType = {
    id: string
    attestationUid: string
    txHash: string
    schemaUid: string
    contractAddress: string
    developerAddress: string
    score: number
    findings: JsonValue
    explorerUrl: string
    createdAt: Date
    auditSessionId: string
    _count: ComplianceCertificateCountAggregateOutputType | null
    _avg: ComplianceCertificateAvgAggregateOutputType | null
    _sum: ComplianceCertificateSumAggregateOutputType | null
    _min: ComplianceCertificateMinAggregateOutputType | null
    _max: ComplianceCertificateMaxAggregateOutputType | null
  }

  type GetComplianceCertificateGroupByPayload<T extends ComplianceCertificateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ComplianceCertificateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ComplianceCertificateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ComplianceCertificateGroupByOutputType[P]>
            : GetScalarType<T[P], ComplianceCertificateGroupByOutputType[P]>
        }
      >
    >


  export type ComplianceCertificateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    attestationUid?: boolean
    txHash?: boolean
    schemaUid?: boolean
    contractAddress?: boolean
    developerAddress?: boolean
    score?: boolean
    findings?: boolean
    explorerUrl?: boolean
    createdAt?: boolean
    auditSessionId?: boolean
    auditSession?: boolean | AuditSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["complianceCertificate"]>

  export type ComplianceCertificateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    attestationUid?: boolean
    txHash?: boolean
    schemaUid?: boolean
    contractAddress?: boolean
    developerAddress?: boolean
    score?: boolean
    findings?: boolean
    explorerUrl?: boolean
    createdAt?: boolean
    auditSessionId?: boolean
    auditSession?: boolean | AuditSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["complianceCertificate"]>

  export type ComplianceCertificateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    attestationUid?: boolean
    txHash?: boolean
    schemaUid?: boolean
    contractAddress?: boolean
    developerAddress?: boolean
    score?: boolean
    findings?: boolean
    explorerUrl?: boolean
    createdAt?: boolean
    auditSessionId?: boolean
    auditSession?: boolean | AuditSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["complianceCertificate"]>

  export type ComplianceCertificateSelectScalar = {
    id?: boolean
    attestationUid?: boolean
    txHash?: boolean
    schemaUid?: boolean
    contractAddress?: boolean
    developerAddress?: boolean
    score?: boolean
    findings?: boolean
    explorerUrl?: boolean
    createdAt?: boolean
    auditSessionId?: boolean
  }

  export type ComplianceCertificateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "attestationUid" | "txHash" | "schemaUid" | "contractAddress" | "developerAddress" | "score" | "findings" | "explorerUrl" | "createdAt" | "auditSessionId", ExtArgs["result"]["complianceCertificate"]>
  export type ComplianceCertificateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditSession?: boolean | AuditSessionDefaultArgs<ExtArgs>
  }
  export type ComplianceCertificateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditSession?: boolean | AuditSessionDefaultArgs<ExtArgs>
  }
  export type ComplianceCertificateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditSession?: boolean | AuditSessionDefaultArgs<ExtArgs>
  }

  export type $ComplianceCertificatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ComplianceCertificate"
    objects: {
      auditSession: Prisma.$AuditSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      attestationUid: string
      txHash: string
      schemaUid: string
      contractAddress: string
      developerAddress: string
      score: number
      findings: Prisma.JsonValue
      explorerUrl: string
      createdAt: Date
      auditSessionId: string
    }, ExtArgs["result"]["complianceCertificate"]>
    composites: {}
  }

  type ComplianceCertificateGetPayload<S extends boolean | null | undefined | ComplianceCertificateDefaultArgs> = $Result.GetResult<Prisma.$ComplianceCertificatePayload, S>

  type ComplianceCertificateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ComplianceCertificateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ComplianceCertificateCountAggregateInputType | true
    }

  export interface ComplianceCertificateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ComplianceCertificate'], meta: { name: 'ComplianceCertificate' } }
    /**
     * Find zero or one ComplianceCertificate that matches the filter.
     * @param {ComplianceCertificateFindUniqueArgs} args - Arguments to find a ComplianceCertificate
     * @example
     * // Get one ComplianceCertificate
     * const complianceCertificate = await prisma.complianceCertificate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ComplianceCertificateFindUniqueArgs>(args: SelectSubset<T, ComplianceCertificateFindUniqueArgs<ExtArgs>>): Prisma__ComplianceCertificateClient<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ComplianceCertificate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ComplianceCertificateFindUniqueOrThrowArgs} args - Arguments to find a ComplianceCertificate
     * @example
     * // Get one ComplianceCertificate
     * const complianceCertificate = await prisma.complianceCertificate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ComplianceCertificateFindUniqueOrThrowArgs>(args: SelectSubset<T, ComplianceCertificateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ComplianceCertificateClient<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ComplianceCertificate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplianceCertificateFindFirstArgs} args - Arguments to find a ComplianceCertificate
     * @example
     * // Get one ComplianceCertificate
     * const complianceCertificate = await prisma.complianceCertificate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ComplianceCertificateFindFirstArgs>(args?: SelectSubset<T, ComplianceCertificateFindFirstArgs<ExtArgs>>): Prisma__ComplianceCertificateClient<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ComplianceCertificate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplianceCertificateFindFirstOrThrowArgs} args - Arguments to find a ComplianceCertificate
     * @example
     * // Get one ComplianceCertificate
     * const complianceCertificate = await prisma.complianceCertificate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ComplianceCertificateFindFirstOrThrowArgs>(args?: SelectSubset<T, ComplianceCertificateFindFirstOrThrowArgs<ExtArgs>>): Prisma__ComplianceCertificateClient<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ComplianceCertificates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplianceCertificateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ComplianceCertificates
     * const complianceCertificates = await prisma.complianceCertificate.findMany()
     * 
     * // Get first 10 ComplianceCertificates
     * const complianceCertificates = await prisma.complianceCertificate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const complianceCertificateWithIdOnly = await prisma.complianceCertificate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ComplianceCertificateFindManyArgs>(args?: SelectSubset<T, ComplianceCertificateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ComplianceCertificate.
     * @param {ComplianceCertificateCreateArgs} args - Arguments to create a ComplianceCertificate.
     * @example
     * // Create one ComplianceCertificate
     * const ComplianceCertificate = await prisma.complianceCertificate.create({
     *   data: {
     *     // ... data to create a ComplianceCertificate
     *   }
     * })
     * 
     */
    create<T extends ComplianceCertificateCreateArgs>(args: SelectSubset<T, ComplianceCertificateCreateArgs<ExtArgs>>): Prisma__ComplianceCertificateClient<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ComplianceCertificates.
     * @param {ComplianceCertificateCreateManyArgs} args - Arguments to create many ComplianceCertificates.
     * @example
     * // Create many ComplianceCertificates
     * const complianceCertificate = await prisma.complianceCertificate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ComplianceCertificateCreateManyArgs>(args?: SelectSubset<T, ComplianceCertificateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ComplianceCertificates and returns the data saved in the database.
     * @param {ComplianceCertificateCreateManyAndReturnArgs} args - Arguments to create many ComplianceCertificates.
     * @example
     * // Create many ComplianceCertificates
     * const complianceCertificate = await prisma.complianceCertificate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ComplianceCertificates and only return the `id`
     * const complianceCertificateWithIdOnly = await prisma.complianceCertificate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ComplianceCertificateCreateManyAndReturnArgs>(args?: SelectSubset<T, ComplianceCertificateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ComplianceCertificate.
     * @param {ComplianceCertificateDeleteArgs} args - Arguments to delete one ComplianceCertificate.
     * @example
     * // Delete one ComplianceCertificate
     * const ComplianceCertificate = await prisma.complianceCertificate.delete({
     *   where: {
     *     // ... filter to delete one ComplianceCertificate
     *   }
     * })
     * 
     */
    delete<T extends ComplianceCertificateDeleteArgs>(args: SelectSubset<T, ComplianceCertificateDeleteArgs<ExtArgs>>): Prisma__ComplianceCertificateClient<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ComplianceCertificate.
     * @param {ComplianceCertificateUpdateArgs} args - Arguments to update one ComplianceCertificate.
     * @example
     * // Update one ComplianceCertificate
     * const complianceCertificate = await prisma.complianceCertificate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ComplianceCertificateUpdateArgs>(args: SelectSubset<T, ComplianceCertificateUpdateArgs<ExtArgs>>): Prisma__ComplianceCertificateClient<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ComplianceCertificates.
     * @param {ComplianceCertificateDeleteManyArgs} args - Arguments to filter ComplianceCertificates to delete.
     * @example
     * // Delete a few ComplianceCertificates
     * const { count } = await prisma.complianceCertificate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ComplianceCertificateDeleteManyArgs>(args?: SelectSubset<T, ComplianceCertificateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ComplianceCertificates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplianceCertificateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ComplianceCertificates
     * const complianceCertificate = await prisma.complianceCertificate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ComplianceCertificateUpdateManyArgs>(args: SelectSubset<T, ComplianceCertificateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ComplianceCertificates and returns the data updated in the database.
     * @param {ComplianceCertificateUpdateManyAndReturnArgs} args - Arguments to update many ComplianceCertificates.
     * @example
     * // Update many ComplianceCertificates
     * const complianceCertificate = await prisma.complianceCertificate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ComplianceCertificates and only return the `id`
     * const complianceCertificateWithIdOnly = await prisma.complianceCertificate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ComplianceCertificateUpdateManyAndReturnArgs>(args: SelectSubset<T, ComplianceCertificateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ComplianceCertificate.
     * @param {ComplianceCertificateUpsertArgs} args - Arguments to update or create a ComplianceCertificate.
     * @example
     * // Update or create a ComplianceCertificate
     * const complianceCertificate = await prisma.complianceCertificate.upsert({
     *   create: {
     *     // ... data to create a ComplianceCertificate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ComplianceCertificate we want to update
     *   }
     * })
     */
    upsert<T extends ComplianceCertificateUpsertArgs>(args: SelectSubset<T, ComplianceCertificateUpsertArgs<ExtArgs>>): Prisma__ComplianceCertificateClient<$Result.GetResult<Prisma.$ComplianceCertificatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ComplianceCertificates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplianceCertificateCountArgs} args - Arguments to filter ComplianceCertificates to count.
     * @example
     * // Count the number of ComplianceCertificates
     * const count = await prisma.complianceCertificate.count({
     *   where: {
     *     // ... the filter for the ComplianceCertificates we want to count
     *   }
     * })
    **/
    count<T extends ComplianceCertificateCountArgs>(
      args?: Subset<T, ComplianceCertificateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ComplianceCertificateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ComplianceCertificate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplianceCertificateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ComplianceCertificateAggregateArgs>(args: Subset<T, ComplianceCertificateAggregateArgs>): Prisma.PrismaPromise<GetComplianceCertificateAggregateType<T>>

    /**
     * Group by ComplianceCertificate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComplianceCertificateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ComplianceCertificateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ComplianceCertificateGroupByArgs['orderBy'] }
        : { orderBy?: ComplianceCertificateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ComplianceCertificateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetComplianceCertificateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ComplianceCertificate model
   */
  readonly fields: ComplianceCertificateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ComplianceCertificate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ComplianceCertificateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auditSession<T extends AuditSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuditSessionDefaultArgs<ExtArgs>>): Prisma__AuditSessionClient<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ComplianceCertificate model
   */
  interface ComplianceCertificateFieldRefs {
    readonly id: FieldRef<"ComplianceCertificate", 'String'>
    readonly attestationUid: FieldRef<"ComplianceCertificate", 'String'>
    readonly txHash: FieldRef<"ComplianceCertificate", 'String'>
    readonly schemaUid: FieldRef<"ComplianceCertificate", 'String'>
    readonly contractAddress: FieldRef<"ComplianceCertificate", 'String'>
    readonly developerAddress: FieldRef<"ComplianceCertificate", 'String'>
    readonly score: FieldRef<"ComplianceCertificate", 'Int'>
    readonly findings: FieldRef<"ComplianceCertificate", 'Json'>
    readonly explorerUrl: FieldRef<"ComplianceCertificate", 'String'>
    readonly createdAt: FieldRef<"ComplianceCertificate", 'DateTime'>
    readonly auditSessionId: FieldRef<"ComplianceCertificate", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ComplianceCertificate findUnique
   */
  export type ComplianceCertificateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateInclude<ExtArgs> | null
    /**
     * Filter, which ComplianceCertificate to fetch.
     */
    where: ComplianceCertificateWhereUniqueInput
  }

  /**
   * ComplianceCertificate findUniqueOrThrow
   */
  export type ComplianceCertificateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateInclude<ExtArgs> | null
    /**
     * Filter, which ComplianceCertificate to fetch.
     */
    where: ComplianceCertificateWhereUniqueInput
  }

  /**
   * ComplianceCertificate findFirst
   */
  export type ComplianceCertificateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateInclude<ExtArgs> | null
    /**
     * Filter, which ComplianceCertificate to fetch.
     */
    where?: ComplianceCertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ComplianceCertificates to fetch.
     */
    orderBy?: ComplianceCertificateOrderByWithRelationInput | ComplianceCertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ComplianceCertificates.
     */
    cursor?: ComplianceCertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ComplianceCertificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ComplianceCertificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ComplianceCertificates.
     */
    distinct?: ComplianceCertificateScalarFieldEnum | ComplianceCertificateScalarFieldEnum[]
  }

  /**
   * ComplianceCertificate findFirstOrThrow
   */
  export type ComplianceCertificateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateInclude<ExtArgs> | null
    /**
     * Filter, which ComplianceCertificate to fetch.
     */
    where?: ComplianceCertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ComplianceCertificates to fetch.
     */
    orderBy?: ComplianceCertificateOrderByWithRelationInput | ComplianceCertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ComplianceCertificates.
     */
    cursor?: ComplianceCertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ComplianceCertificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ComplianceCertificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ComplianceCertificates.
     */
    distinct?: ComplianceCertificateScalarFieldEnum | ComplianceCertificateScalarFieldEnum[]
  }

  /**
   * ComplianceCertificate findMany
   */
  export type ComplianceCertificateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateInclude<ExtArgs> | null
    /**
     * Filter, which ComplianceCertificates to fetch.
     */
    where?: ComplianceCertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ComplianceCertificates to fetch.
     */
    orderBy?: ComplianceCertificateOrderByWithRelationInput | ComplianceCertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ComplianceCertificates.
     */
    cursor?: ComplianceCertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ComplianceCertificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ComplianceCertificates.
     */
    skip?: number
    distinct?: ComplianceCertificateScalarFieldEnum | ComplianceCertificateScalarFieldEnum[]
  }

  /**
   * ComplianceCertificate create
   */
  export type ComplianceCertificateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateInclude<ExtArgs> | null
    /**
     * The data needed to create a ComplianceCertificate.
     */
    data: XOR<ComplianceCertificateCreateInput, ComplianceCertificateUncheckedCreateInput>
  }

  /**
   * ComplianceCertificate createMany
   */
  export type ComplianceCertificateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ComplianceCertificates.
     */
    data: ComplianceCertificateCreateManyInput | ComplianceCertificateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ComplianceCertificate createManyAndReturn
   */
  export type ComplianceCertificateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * The data used to create many ComplianceCertificates.
     */
    data: ComplianceCertificateCreateManyInput | ComplianceCertificateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ComplianceCertificate update
   */
  export type ComplianceCertificateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateInclude<ExtArgs> | null
    /**
     * The data needed to update a ComplianceCertificate.
     */
    data: XOR<ComplianceCertificateUpdateInput, ComplianceCertificateUncheckedUpdateInput>
    /**
     * Choose, which ComplianceCertificate to update.
     */
    where: ComplianceCertificateWhereUniqueInput
  }

  /**
   * ComplianceCertificate updateMany
   */
  export type ComplianceCertificateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ComplianceCertificates.
     */
    data: XOR<ComplianceCertificateUpdateManyMutationInput, ComplianceCertificateUncheckedUpdateManyInput>
    /**
     * Filter which ComplianceCertificates to update
     */
    where?: ComplianceCertificateWhereInput
    /**
     * Limit how many ComplianceCertificates to update.
     */
    limit?: number
  }

  /**
   * ComplianceCertificate updateManyAndReturn
   */
  export type ComplianceCertificateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * The data used to update ComplianceCertificates.
     */
    data: XOR<ComplianceCertificateUpdateManyMutationInput, ComplianceCertificateUncheckedUpdateManyInput>
    /**
     * Filter which ComplianceCertificates to update
     */
    where?: ComplianceCertificateWhereInput
    /**
     * Limit how many ComplianceCertificates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ComplianceCertificate upsert
   */
  export type ComplianceCertificateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateInclude<ExtArgs> | null
    /**
     * The filter to search for the ComplianceCertificate to update in case it exists.
     */
    where: ComplianceCertificateWhereUniqueInput
    /**
     * In case the ComplianceCertificate found by the `where` argument doesn't exist, create a new ComplianceCertificate with this data.
     */
    create: XOR<ComplianceCertificateCreateInput, ComplianceCertificateUncheckedCreateInput>
    /**
     * In case the ComplianceCertificate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ComplianceCertificateUpdateInput, ComplianceCertificateUncheckedUpdateInput>
  }

  /**
   * ComplianceCertificate delete
   */
  export type ComplianceCertificateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateInclude<ExtArgs> | null
    /**
     * Filter which ComplianceCertificate to delete.
     */
    where: ComplianceCertificateWhereUniqueInput
  }

  /**
   * ComplianceCertificate deleteMany
   */
  export type ComplianceCertificateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ComplianceCertificates to delete
     */
    where?: ComplianceCertificateWhereInput
    /**
     * Limit how many ComplianceCertificates to delete.
     */
    limit?: number
  }

  /**
   * ComplianceCertificate without action
   */
  export type ComplianceCertificateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComplianceCertificate
     */
    select?: ComplianceCertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ComplianceCertificate
     */
    omit?: ComplianceCertificateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComplianceCertificateInclude<ExtArgs> | null
  }


  /**
   * Model ChatMessage
   */

  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    content: string | null
    createdAt: Date | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    content: string | null
    createdAt: Date | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    sessionId: number
    role: number
    content: number
    sources: number
    createdAt: number
    _all: number
  }


  export type ChatMessageMinAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    createdAt?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    createdAt?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    sources?: true
    createdAt?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithAggregationInput | ChatMessageOrderByWithAggregationInput[]
    by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }

  export type ChatMessageGroupByOutputType = {
    id: string
    sessionId: string
    role: string
    content: string
    sources: JsonValue | null
    createdAt: Date
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    sources?: boolean
    createdAt?: boolean
    auditSession?: boolean | ChatMessage$auditSessionArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    sources?: boolean
    createdAt?: boolean
    auditSession?: boolean | ChatMessage$auditSessionArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    sources?: boolean
    createdAt?: boolean
    auditSession?: boolean | ChatMessage$auditSessionArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectScalar = {
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    sources?: boolean
    createdAt?: boolean
  }

  export type ChatMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "role" | "content" | "sources" | "createdAt", ExtArgs["result"]["chatMessage"]>
  export type ChatMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditSession?: boolean | ChatMessage$auditSessionArgs<ExtArgs>
  }
  export type ChatMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditSession?: boolean | ChatMessage$auditSessionArgs<ExtArgs>
  }
  export type ChatMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditSession?: boolean | ChatMessage$auditSessionArgs<ExtArgs>
  }

  export type $ChatMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMessage"
    objects: {
      auditSession: Prisma.$AuditSessionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      role: string
      content: string
      sources: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["chatMessage"]>
    composites: {}
  }

  type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = $Result.GetResult<Prisma.$ChatMessagePayload, S>

  type ChatMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'], meta: { name: 'ChatMessage' } }
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
     */
    create<T extends ChatMessageCreateArgs>(args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatMessages and returns the data saved in the database.
     * @param {ChatMessageCreateManyAndReturnArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
     */
    delete<T extends ChatMessageDeleteArgs>(args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMessageUpdateArgs>(args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages and returns the data updated in the database.
     * @param {ChatMessageUpdateManyAndReturnArgs} args - Arguments to update many ChatMessages.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMessage model
   */
  readonly fields: ChatMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auditSession<T extends ChatMessage$auditSessionArgs<ExtArgs> = {}>(args?: Subset<T, ChatMessage$auditSessionArgs<ExtArgs>>): Prisma__AuditSessionClient<$Result.GetResult<Prisma.$AuditSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatMessage model
   */
  interface ChatMessageFieldRefs {
    readonly id: FieldRef<"ChatMessage", 'String'>
    readonly sessionId: FieldRef<"ChatMessage", 'String'>
    readonly role: FieldRef<"ChatMessage", 'String'>
    readonly content: FieldRef<"ChatMessage", 'String'>
    readonly sources: FieldRef<"ChatMessage", 'Json'>
    readonly createdAt: FieldRef<"ChatMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatMessage findUnique
   */
  export type ChatMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findFirst
   */
  export type ChatMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }

  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatMessage createManyAndReturn
   */
  export type ChatMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
  }

  /**
   * ChatMessage updateManyAndReturn
   */
  export type ChatMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }

  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to delete.
     */
    limit?: number
  }

  /**
   * ChatMessage.auditSession
   */
  export type ChatMessage$auditSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditSession
     */
    select?: AuditSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditSession
     */
    omit?: AuditSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditSessionInclude<ExtArgs> | null
    where?: AuditSessionWhereInput
  }

  /**
   * ChatMessage without action
   */
  export type ChatMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
  }


  /**
   * Model KnowledgeChunk
   */

  export type AggregateKnowledgeChunk = {
    _count: KnowledgeChunkCountAggregateOutputType | null
    _min: KnowledgeChunkMinAggregateOutputType | null
    _max: KnowledgeChunkMaxAggregateOutputType | null
  }

  export type KnowledgeChunkMinAggregateOutputType = {
    id: string | null
    content: string | null
    source: string | null
    category: string | null
    createdAt: Date | null
  }

  export type KnowledgeChunkMaxAggregateOutputType = {
    id: string | null
    content: string | null
    source: string | null
    category: string | null
    createdAt: Date | null
  }

  export type KnowledgeChunkCountAggregateOutputType = {
    id: number
    content: number
    source: number
    category: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type KnowledgeChunkMinAggregateInputType = {
    id?: true
    content?: true
    source?: true
    category?: true
    createdAt?: true
  }

  export type KnowledgeChunkMaxAggregateInputType = {
    id?: true
    content?: true
    source?: true
    category?: true
    createdAt?: true
  }

  export type KnowledgeChunkCountAggregateInputType = {
    id?: true
    content?: true
    source?: true
    category?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type KnowledgeChunkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeChunk to aggregate.
     */
    where?: KnowledgeChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChunks to fetch.
     */
    orderBy?: KnowledgeChunkOrderByWithRelationInput | KnowledgeChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KnowledgeChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KnowledgeChunks
    **/
    _count?: true | KnowledgeChunkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KnowledgeChunkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KnowledgeChunkMaxAggregateInputType
  }

  export type GetKnowledgeChunkAggregateType<T extends KnowledgeChunkAggregateArgs> = {
        [P in keyof T & keyof AggregateKnowledgeChunk]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKnowledgeChunk[P]>
      : GetScalarType<T[P], AggregateKnowledgeChunk[P]>
  }




  export type KnowledgeChunkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KnowledgeChunkWhereInput
    orderBy?: KnowledgeChunkOrderByWithAggregationInput | KnowledgeChunkOrderByWithAggregationInput[]
    by: KnowledgeChunkScalarFieldEnum[] | KnowledgeChunkScalarFieldEnum
    having?: KnowledgeChunkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KnowledgeChunkCountAggregateInputType | true
    _min?: KnowledgeChunkMinAggregateInputType
    _max?: KnowledgeChunkMaxAggregateInputType
  }

  export type KnowledgeChunkGroupByOutputType = {
    id: string
    content: string
    source: string
    category: string
    metadata: JsonValue | null
    createdAt: Date
    _count: KnowledgeChunkCountAggregateOutputType | null
    _min: KnowledgeChunkMinAggregateOutputType | null
    _max: KnowledgeChunkMaxAggregateOutputType | null
  }

  type GetKnowledgeChunkGroupByPayload<T extends KnowledgeChunkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KnowledgeChunkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KnowledgeChunkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KnowledgeChunkGroupByOutputType[P]>
            : GetScalarType<T[P], KnowledgeChunkGroupByOutputType[P]>
        }
      >
    >


  export type KnowledgeChunkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    source?: boolean
    category?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["knowledgeChunk"]>


  export type KnowledgeChunkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    source?: boolean
    category?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["knowledgeChunk"]>

  export type KnowledgeChunkSelectScalar = {
    id?: boolean
    content?: boolean
    source?: boolean
    category?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type KnowledgeChunkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "source" | "category" | "metadata" | "createdAt", ExtArgs["result"]["knowledgeChunk"]>

  export type $KnowledgeChunkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KnowledgeChunk"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      source: string
      category: string
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["knowledgeChunk"]>
    composites: {}
  }

  type KnowledgeChunkGetPayload<S extends boolean | null | undefined | KnowledgeChunkDefaultArgs> = $Result.GetResult<Prisma.$KnowledgeChunkPayload, S>

  type KnowledgeChunkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KnowledgeChunkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KnowledgeChunkCountAggregateInputType | true
    }

  export interface KnowledgeChunkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KnowledgeChunk'], meta: { name: 'KnowledgeChunk' } }
    /**
     * Find zero or one KnowledgeChunk that matches the filter.
     * @param {KnowledgeChunkFindUniqueArgs} args - Arguments to find a KnowledgeChunk
     * @example
     * // Get one KnowledgeChunk
     * const knowledgeChunk = await prisma.knowledgeChunk.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KnowledgeChunkFindUniqueArgs>(args: SelectSubset<T, KnowledgeChunkFindUniqueArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KnowledgeChunk that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KnowledgeChunkFindUniqueOrThrowArgs} args - Arguments to find a KnowledgeChunk
     * @example
     * // Get one KnowledgeChunk
     * const knowledgeChunk = await prisma.knowledgeChunk.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KnowledgeChunkFindUniqueOrThrowArgs>(args: SelectSubset<T, KnowledgeChunkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeChunk that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkFindFirstArgs} args - Arguments to find a KnowledgeChunk
     * @example
     * // Get one KnowledgeChunk
     * const knowledgeChunk = await prisma.knowledgeChunk.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KnowledgeChunkFindFirstArgs>(args?: SelectSubset<T, KnowledgeChunkFindFirstArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeChunk that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkFindFirstOrThrowArgs} args - Arguments to find a KnowledgeChunk
     * @example
     * // Get one KnowledgeChunk
     * const knowledgeChunk = await prisma.knowledgeChunk.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KnowledgeChunkFindFirstOrThrowArgs>(args?: SelectSubset<T, KnowledgeChunkFindFirstOrThrowArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KnowledgeChunks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KnowledgeChunks
     * const knowledgeChunks = await prisma.knowledgeChunk.findMany()
     * 
     * // Get first 10 KnowledgeChunks
     * const knowledgeChunks = await prisma.knowledgeChunk.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const knowledgeChunkWithIdOnly = await prisma.knowledgeChunk.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KnowledgeChunkFindManyArgs>(args?: SelectSubset<T, KnowledgeChunkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Delete a KnowledgeChunk.
     * @param {KnowledgeChunkDeleteArgs} args - Arguments to delete one KnowledgeChunk.
     * @example
     * // Delete one KnowledgeChunk
     * const KnowledgeChunk = await prisma.knowledgeChunk.delete({
     *   where: {
     *     // ... filter to delete one KnowledgeChunk
     *   }
     * })
     * 
     */
    delete<T extends KnowledgeChunkDeleteArgs>(args: SelectSubset<T, KnowledgeChunkDeleteArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KnowledgeChunk.
     * @param {KnowledgeChunkUpdateArgs} args - Arguments to update one KnowledgeChunk.
     * @example
     * // Update one KnowledgeChunk
     * const knowledgeChunk = await prisma.knowledgeChunk.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KnowledgeChunkUpdateArgs>(args: SelectSubset<T, KnowledgeChunkUpdateArgs<ExtArgs>>): Prisma__KnowledgeChunkClient<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KnowledgeChunks.
     * @param {KnowledgeChunkDeleteManyArgs} args - Arguments to filter KnowledgeChunks to delete.
     * @example
     * // Delete a few KnowledgeChunks
     * const { count } = await prisma.knowledgeChunk.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KnowledgeChunkDeleteManyArgs>(args?: SelectSubset<T, KnowledgeChunkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KnowledgeChunks
     * const knowledgeChunk = await prisma.knowledgeChunk.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KnowledgeChunkUpdateManyArgs>(args: SelectSubset<T, KnowledgeChunkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeChunks and returns the data updated in the database.
     * @param {KnowledgeChunkUpdateManyAndReturnArgs} args - Arguments to update many KnowledgeChunks.
     * @example
     * // Update many KnowledgeChunks
     * const knowledgeChunk = await prisma.knowledgeChunk.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KnowledgeChunks and only return the `id`
     * const knowledgeChunkWithIdOnly = await prisma.knowledgeChunk.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KnowledgeChunkUpdateManyAndReturnArgs>(args: SelectSubset<T, KnowledgeChunkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeChunkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>


    /**
     * Count the number of KnowledgeChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkCountArgs} args - Arguments to filter KnowledgeChunks to count.
     * @example
     * // Count the number of KnowledgeChunks
     * const count = await prisma.knowledgeChunk.count({
     *   where: {
     *     // ... the filter for the KnowledgeChunks we want to count
     *   }
     * })
    **/
    count<T extends KnowledgeChunkCountArgs>(
      args?: Subset<T, KnowledgeChunkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KnowledgeChunkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KnowledgeChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KnowledgeChunkAggregateArgs>(args: Subset<T, KnowledgeChunkAggregateArgs>): Prisma.PrismaPromise<GetKnowledgeChunkAggregateType<T>>

    /**
     * Group by KnowledgeChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChunkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KnowledgeChunkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KnowledgeChunkGroupByArgs['orderBy'] }
        : { orderBy?: KnowledgeChunkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KnowledgeChunkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKnowledgeChunkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KnowledgeChunk model
   */
  readonly fields: KnowledgeChunkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KnowledgeChunk.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KnowledgeChunkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KnowledgeChunk model
   */
  interface KnowledgeChunkFieldRefs {
    readonly id: FieldRef<"KnowledgeChunk", 'String'>
    readonly content: FieldRef<"KnowledgeChunk", 'String'>
    readonly source: FieldRef<"KnowledgeChunk", 'String'>
    readonly category: FieldRef<"KnowledgeChunk", 'String'>
    readonly metadata: FieldRef<"KnowledgeChunk", 'Json'>
    readonly createdAt: FieldRef<"KnowledgeChunk", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KnowledgeChunk findUnique
   */
  export type KnowledgeChunkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeChunk to fetch.
     */
    where: KnowledgeChunkWhereUniqueInput
  }

  /**
   * KnowledgeChunk findUniqueOrThrow
   */
  export type KnowledgeChunkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeChunk to fetch.
     */
    where: KnowledgeChunkWhereUniqueInput
  }

  /**
   * KnowledgeChunk findFirst
   */
  export type KnowledgeChunkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeChunk to fetch.
     */
    where?: KnowledgeChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChunks to fetch.
     */
    orderBy?: KnowledgeChunkOrderByWithRelationInput | KnowledgeChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeChunks.
     */
    cursor?: KnowledgeChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeChunks.
     */
    distinct?: KnowledgeChunkScalarFieldEnum | KnowledgeChunkScalarFieldEnum[]
  }

  /**
   * KnowledgeChunk findFirstOrThrow
   */
  export type KnowledgeChunkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeChunk to fetch.
     */
    where?: KnowledgeChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChunks to fetch.
     */
    orderBy?: KnowledgeChunkOrderByWithRelationInput | KnowledgeChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeChunks.
     */
    cursor?: KnowledgeChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeChunks.
     */
    distinct?: KnowledgeChunkScalarFieldEnum | KnowledgeChunkScalarFieldEnum[]
  }

  /**
   * KnowledgeChunk findMany
   */
  export type KnowledgeChunkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeChunks to fetch.
     */
    where?: KnowledgeChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChunks to fetch.
     */
    orderBy?: KnowledgeChunkOrderByWithRelationInput | KnowledgeChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KnowledgeChunks.
     */
    cursor?: KnowledgeChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChunks.
     */
    skip?: number
    distinct?: KnowledgeChunkScalarFieldEnum | KnowledgeChunkScalarFieldEnum[]
  }

  /**
   * KnowledgeChunk update
   */
  export type KnowledgeChunkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * The data needed to update a KnowledgeChunk.
     */
    data: XOR<KnowledgeChunkUpdateInput, KnowledgeChunkUncheckedUpdateInput>
    /**
     * Choose, which KnowledgeChunk to update.
     */
    where: KnowledgeChunkWhereUniqueInput
  }

  /**
   * KnowledgeChunk updateMany
   */
  export type KnowledgeChunkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KnowledgeChunks.
     */
    data: XOR<KnowledgeChunkUpdateManyMutationInput, KnowledgeChunkUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeChunks to update
     */
    where?: KnowledgeChunkWhereInput
    /**
     * Limit how many KnowledgeChunks to update.
     */
    limit?: number
  }

  /**
   * KnowledgeChunk updateManyAndReturn
   */
  export type KnowledgeChunkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * The data used to update KnowledgeChunks.
     */
    data: XOR<KnowledgeChunkUpdateManyMutationInput, KnowledgeChunkUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeChunks to update
     */
    where?: KnowledgeChunkWhereInput
    /**
     * Limit how many KnowledgeChunks to update.
     */
    limit?: number
  }

  /**
   * KnowledgeChunk delete
   */
  export type KnowledgeChunkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
    /**
     * Filter which KnowledgeChunk to delete.
     */
    where: KnowledgeChunkWhereUniqueInput
  }

  /**
   * KnowledgeChunk deleteMany
   */
  export type KnowledgeChunkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeChunks to delete
     */
    where?: KnowledgeChunkWhereInput
    /**
     * Limit how many KnowledgeChunks to delete.
     */
    limit?: number
  }

  /**
   * KnowledgeChunk without action
   */
  export type KnowledgeChunkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChunk
     */
    select?: KnowledgeChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChunk
     */
    omit?: KnowledgeChunkOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AuditSessionScalarFieldEnum: {
    id: 'id',
    walletAddress: 'walletAddress',
    code: 'code',
    contractName: 'contractName',
    findings: 'findings',
    score: 'score',
    verdict: 'verdict',
    auditHash: 'auditHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuditSessionScalarFieldEnum = (typeof AuditSessionScalarFieldEnum)[keyof typeof AuditSessionScalarFieldEnum]


  export const ComplianceCertificateScalarFieldEnum: {
    id: 'id',
    attestationUid: 'attestationUid',
    txHash: 'txHash',
    schemaUid: 'schemaUid',
    contractAddress: 'contractAddress',
    developerAddress: 'developerAddress',
    score: 'score',
    findings: 'findings',
    explorerUrl: 'explorerUrl',
    createdAt: 'createdAt',
    auditSessionId: 'auditSessionId'
  };

  export type ComplianceCertificateScalarFieldEnum = (typeof ComplianceCertificateScalarFieldEnum)[keyof typeof ComplianceCertificateScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    role: 'role',
    content: 'content',
    sources: 'sources',
    createdAt: 'createdAt'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const KnowledgeChunkScalarFieldEnum: {
    id: 'id',
    content: 'content',
    source: 'source',
    category: 'category',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type KnowledgeChunkScalarFieldEnum = (typeof KnowledgeChunkScalarFieldEnum)[keyof typeof KnowledgeChunkScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AuditSessionWhereInput = {
    AND?: AuditSessionWhereInput | AuditSessionWhereInput[]
    OR?: AuditSessionWhereInput[]
    NOT?: AuditSessionWhereInput | AuditSessionWhereInput[]
    id?: StringFilter<"AuditSession"> | string
    walletAddress?: StringNullableFilter<"AuditSession"> | string | null
    code?: StringFilter<"AuditSession"> | string
    contractName?: StringNullableFilter<"AuditSession"> | string | null
    findings?: JsonFilter<"AuditSession">
    score?: IntFilter<"AuditSession"> | number
    verdict?: StringFilter<"AuditSession"> | string
    auditHash?: StringNullableFilter<"AuditSession"> | string | null
    createdAt?: DateTimeFilter<"AuditSession"> | Date | string
    updatedAt?: DateTimeFilter<"AuditSession"> | Date | string
    certificate?: XOR<ComplianceCertificateNullableScalarRelationFilter, ComplianceCertificateWhereInput> | null
    messages?: ChatMessageListRelationFilter
  }

  export type AuditSessionOrderByWithRelationInput = {
    id?: SortOrder
    walletAddress?: SortOrderInput | SortOrder
    code?: SortOrder
    contractName?: SortOrderInput | SortOrder
    findings?: SortOrder
    score?: SortOrder
    verdict?: SortOrder
    auditHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    certificate?: ComplianceCertificateOrderByWithRelationInput
    messages?: ChatMessageOrderByRelationAggregateInput
  }

  export type AuditSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditSessionWhereInput | AuditSessionWhereInput[]
    OR?: AuditSessionWhereInput[]
    NOT?: AuditSessionWhereInput | AuditSessionWhereInput[]
    walletAddress?: StringNullableFilter<"AuditSession"> | string | null
    code?: StringFilter<"AuditSession"> | string
    contractName?: StringNullableFilter<"AuditSession"> | string | null
    findings?: JsonFilter<"AuditSession">
    score?: IntFilter<"AuditSession"> | number
    verdict?: StringFilter<"AuditSession"> | string
    auditHash?: StringNullableFilter<"AuditSession"> | string | null
    createdAt?: DateTimeFilter<"AuditSession"> | Date | string
    updatedAt?: DateTimeFilter<"AuditSession"> | Date | string
    certificate?: XOR<ComplianceCertificateNullableScalarRelationFilter, ComplianceCertificateWhereInput> | null
    messages?: ChatMessageListRelationFilter
  }, "id">

  export type AuditSessionOrderByWithAggregationInput = {
    id?: SortOrder
    walletAddress?: SortOrderInput | SortOrder
    code?: SortOrder
    contractName?: SortOrderInput | SortOrder
    findings?: SortOrder
    score?: SortOrder
    verdict?: SortOrder
    auditHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuditSessionCountOrderByAggregateInput
    _avg?: AuditSessionAvgOrderByAggregateInput
    _max?: AuditSessionMaxOrderByAggregateInput
    _min?: AuditSessionMinOrderByAggregateInput
    _sum?: AuditSessionSumOrderByAggregateInput
  }

  export type AuditSessionScalarWhereWithAggregatesInput = {
    AND?: AuditSessionScalarWhereWithAggregatesInput | AuditSessionScalarWhereWithAggregatesInput[]
    OR?: AuditSessionScalarWhereWithAggregatesInput[]
    NOT?: AuditSessionScalarWhereWithAggregatesInput | AuditSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditSession"> | string
    walletAddress?: StringNullableWithAggregatesFilter<"AuditSession"> | string | null
    code?: StringWithAggregatesFilter<"AuditSession"> | string
    contractName?: StringNullableWithAggregatesFilter<"AuditSession"> | string | null
    findings?: JsonWithAggregatesFilter<"AuditSession">
    score?: IntWithAggregatesFilter<"AuditSession"> | number
    verdict?: StringWithAggregatesFilter<"AuditSession"> | string
    auditHash?: StringNullableWithAggregatesFilter<"AuditSession"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AuditSession"> | Date | string
  }

  export type ComplianceCertificateWhereInput = {
    AND?: ComplianceCertificateWhereInput | ComplianceCertificateWhereInput[]
    OR?: ComplianceCertificateWhereInput[]
    NOT?: ComplianceCertificateWhereInput | ComplianceCertificateWhereInput[]
    id?: StringFilter<"ComplianceCertificate"> | string
    attestationUid?: StringFilter<"ComplianceCertificate"> | string
    txHash?: StringFilter<"ComplianceCertificate"> | string
    schemaUid?: StringFilter<"ComplianceCertificate"> | string
    contractAddress?: StringFilter<"ComplianceCertificate"> | string
    developerAddress?: StringFilter<"ComplianceCertificate"> | string
    score?: IntFilter<"ComplianceCertificate"> | number
    findings?: JsonFilter<"ComplianceCertificate">
    explorerUrl?: StringFilter<"ComplianceCertificate"> | string
    createdAt?: DateTimeFilter<"ComplianceCertificate"> | Date | string
    auditSessionId?: StringFilter<"ComplianceCertificate"> | string
    auditSession?: XOR<AuditSessionScalarRelationFilter, AuditSessionWhereInput>
  }

  export type ComplianceCertificateOrderByWithRelationInput = {
    id?: SortOrder
    attestationUid?: SortOrder
    txHash?: SortOrder
    schemaUid?: SortOrder
    contractAddress?: SortOrder
    developerAddress?: SortOrder
    score?: SortOrder
    findings?: SortOrder
    explorerUrl?: SortOrder
    createdAt?: SortOrder
    auditSessionId?: SortOrder
    auditSession?: AuditSessionOrderByWithRelationInput
  }

  export type ComplianceCertificateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    attestationUid?: string
    auditSessionId?: string
    AND?: ComplianceCertificateWhereInput | ComplianceCertificateWhereInput[]
    OR?: ComplianceCertificateWhereInput[]
    NOT?: ComplianceCertificateWhereInput | ComplianceCertificateWhereInput[]
    txHash?: StringFilter<"ComplianceCertificate"> | string
    schemaUid?: StringFilter<"ComplianceCertificate"> | string
    contractAddress?: StringFilter<"ComplianceCertificate"> | string
    developerAddress?: StringFilter<"ComplianceCertificate"> | string
    score?: IntFilter<"ComplianceCertificate"> | number
    findings?: JsonFilter<"ComplianceCertificate">
    explorerUrl?: StringFilter<"ComplianceCertificate"> | string
    createdAt?: DateTimeFilter<"ComplianceCertificate"> | Date | string
    auditSession?: XOR<AuditSessionScalarRelationFilter, AuditSessionWhereInput>
  }, "id" | "attestationUid" | "auditSessionId">

  export type ComplianceCertificateOrderByWithAggregationInput = {
    id?: SortOrder
    attestationUid?: SortOrder
    txHash?: SortOrder
    schemaUid?: SortOrder
    contractAddress?: SortOrder
    developerAddress?: SortOrder
    score?: SortOrder
    findings?: SortOrder
    explorerUrl?: SortOrder
    createdAt?: SortOrder
    auditSessionId?: SortOrder
    _count?: ComplianceCertificateCountOrderByAggregateInput
    _avg?: ComplianceCertificateAvgOrderByAggregateInput
    _max?: ComplianceCertificateMaxOrderByAggregateInput
    _min?: ComplianceCertificateMinOrderByAggregateInput
    _sum?: ComplianceCertificateSumOrderByAggregateInput
  }

  export type ComplianceCertificateScalarWhereWithAggregatesInput = {
    AND?: ComplianceCertificateScalarWhereWithAggregatesInput | ComplianceCertificateScalarWhereWithAggregatesInput[]
    OR?: ComplianceCertificateScalarWhereWithAggregatesInput[]
    NOT?: ComplianceCertificateScalarWhereWithAggregatesInput | ComplianceCertificateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ComplianceCertificate"> | string
    attestationUid?: StringWithAggregatesFilter<"ComplianceCertificate"> | string
    txHash?: StringWithAggregatesFilter<"ComplianceCertificate"> | string
    schemaUid?: StringWithAggregatesFilter<"ComplianceCertificate"> | string
    contractAddress?: StringWithAggregatesFilter<"ComplianceCertificate"> | string
    developerAddress?: StringWithAggregatesFilter<"ComplianceCertificate"> | string
    score?: IntWithAggregatesFilter<"ComplianceCertificate"> | number
    findings?: JsonWithAggregatesFilter<"ComplianceCertificate">
    explorerUrl?: StringWithAggregatesFilter<"ComplianceCertificate"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ComplianceCertificate"> | Date | string
    auditSessionId?: StringWithAggregatesFilter<"ComplianceCertificate"> | string
  }

  export type ChatMessageWhereInput = {
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringFilter<"ChatMessage"> | string
    sources?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    auditSession?: XOR<AuditSessionNullableScalarRelationFilter, AuditSessionWhereInput> | null
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    sources?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    auditSession?: AuditSessionOrderByWithRelationInput
  }

  export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringFilter<"ChatMessage"> | string
    sources?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    auditSession?: XOR<AuditSessionNullableScalarRelationFilter, AuditSessionWhereInput> | null
  }, "id">

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    sources?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    OR?: ChatMessageScalarWhereWithAggregatesInput[]
    NOT?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatMessage"> | string
    sessionId?: StringWithAggregatesFilter<"ChatMessage"> | string
    role?: StringWithAggregatesFilter<"ChatMessage"> | string
    content?: StringWithAggregatesFilter<"ChatMessage"> | string
    sources?: JsonNullableWithAggregatesFilter<"ChatMessage">
    createdAt?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string
  }

  export type KnowledgeChunkWhereInput = {
    AND?: KnowledgeChunkWhereInput | KnowledgeChunkWhereInput[]
    OR?: KnowledgeChunkWhereInput[]
    NOT?: KnowledgeChunkWhereInput | KnowledgeChunkWhereInput[]
    id?: StringFilter<"KnowledgeChunk"> | string
    content?: StringFilter<"KnowledgeChunk"> | string
    source?: StringFilter<"KnowledgeChunk"> | string
    category?: StringFilter<"KnowledgeChunk"> | string
    metadata?: JsonNullableFilter<"KnowledgeChunk">
    createdAt?: DateTimeFilter<"KnowledgeChunk"> | Date | string
  }

  export type KnowledgeChunkOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrder
    category?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type KnowledgeChunkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: KnowledgeChunkWhereInput | KnowledgeChunkWhereInput[]
    OR?: KnowledgeChunkWhereInput[]
    NOT?: KnowledgeChunkWhereInput | KnowledgeChunkWhereInput[]
    content?: StringFilter<"KnowledgeChunk"> | string
    source?: StringFilter<"KnowledgeChunk"> | string
    category?: StringFilter<"KnowledgeChunk"> | string
    metadata?: JsonNullableFilter<"KnowledgeChunk">
    createdAt?: DateTimeFilter<"KnowledgeChunk"> | Date | string
  }, "id">

  export type KnowledgeChunkOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrder
    category?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: KnowledgeChunkCountOrderByAggregateInput
    _max?: KnowledgeChunkMaxOrderByAggregateInput
    _min?: KnowledgeChunkMinOrderByAggregateInput
  }

  export type KnowledgeChunkScalarWhereWithAggregatesInput = {
    AND?: KnowledgeChunkScalarWhereWithAggregatesInput | KnowledgeChunkScalarWhereWithAggregatesInput[]
    OR?: KnowledgeChunkScalarWhereWithAggregatesInput[]
    NOT?: KnowledgeChunkScalarWhereWithAggregatesInput | KnowledgeChunkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KnowledgeChunk"> | string
    content?: StringWithAggregatesFilter<"KnowledgeChunk"> | string
    source?: StringWithAggregatesFilter<"KnowledgeChunk"> | string
    category?: StringWithAggregatesFilter<"KnowledgeChunk"> | string
    metadata?: JsonNullableWithAggregatesFilter<"KnowledgeChunk">
    createdAt?: DateTimeWithAggregatesFilter<"KnowledgeChunk"> | Date | string
  }

  export type AuditSessionCreateInput = {
    id?: string
    walletAddress?: string | null
    code: string
    contractName?: string | null
    findings: JsonNullValueInput | InputJsonValue
    score: number
    verdict: string
    auditHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    certificate?: ComplianceCertificateCreateNestedOneWithoutAuditSessionInput
    messages?: ChatMessageCreateNestedManyWithoutAuditSessionInput
  }

  export type AuditSessionUncheckedCreateInput = {
    id?: string
    walletAddress?: string | null
    code: string
    contractName?: string | null
    findings: JsonNullValueInput | InputJsonValue
    score: number
    verdict: string
    auditHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    certificate?: ComplianceCertificateUncheckedCreateNestedOneWithoutAuditSessionInput
    messages?: ChatMessageUncheckedCreateNestedManyWithoutAuditSessionInput
  }

  export type AuditSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    contractName?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: JsonNullValueInput | InputJsonValue
    score?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    auditHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificate?: ComplianceCertificateUpdateOneWithoutAuditSessionNestedInput
    messages?: ChatMessageUpdateManyWithoutAuditSessionNestedInput
  }

  export type AuditSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    contractName?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: JsonNullValueInput | InputJsonValue
    score?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    auditHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificate?: ComplianceCertificateUncheckedUpdateOneWithoutAuditSessionNestedInput
    messages?: ChatMessageUncheckedUpdateManyWithoutAuditSessionNestedInput
  }

  export type AuditSessionCreateManyInput = {
    id?: string
    walletAddress?: string | null
    code: string
    contractName?: string | null
    findings: JsonNullValueInput | InputJsonValue
    score: number
    verdict: string
    auditHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    contractName?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: JsonNullValueInput | InputJsonValue
    score?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    auditHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    contractName?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: JsonNullValueInput | InputJsonValue
    score?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    auditHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ComplianceCertificateCreateInput = {
    id?: string
    attestationUid: string
    txHash: string
    schemaUid: string
    contractAddress: string
    developerAddress: string
    score: number
    findings: JsonNullValueInput | InputJsonValue
    explorerUrl: string
    createdAt?: Date | string
    auditSession: AuditSessionCreateNestedOneWithoutCertificateInput
  }

  export type ComplianceCertificateUncheckedCreateInput = {
    id?: string
    attestationUid: string
    txHash: string
    schemaUid: string
    contractAddress: string
    developerAddress: string
    score: number
    findings: JsonNullValueInput | InputJsonValue
    explorerUrl: string
    createdAt?: Date | string
    auditSessionId: string
  }

  export type ComplianceCertificateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    attestationUid?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    schemaUid?: StringFieldUpdateOperationsInput | string
    contractAddress?: StringFieldUpdateOperationsInput | string
    developerAddress?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    findings?: JsonNullValueInput | InputJsonValue
    explorerUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditSession?: AuditSessionUpdateOneRequiredWithoutCertificateNestedInput
  }

  export type ComplianceCertificateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    attestationUid?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    schemaUid?: StringFieldUpdateOperationsInput | string
    contractAddress?: StringFieldUpdateOperationsInput | string
    developerAddress?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    findings?: JsonNullValueInput | InputJsonValue
    explorerUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditSessionId?: StringFieldUpdateOperationsInput | string
  }

  export type ComplianceCertificateCreateManyInput = {
    id?: string
    attestationUid: string
    txHash: string
    schemaUid: string
    contractAddress: string
    developerAddress: string
    score: number
    findings: JsonNullValueInput | InputJsonValue
    explorerUrl: string
    createdAt?: Date | string
    auditSessionId: string
  }

  export type ComplianceCertificateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    attestationUid?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    schemaUid?: StringFieldUpdateOperationsInput | string
    contractAddress?: StringFieldUpdateOperationsInput | string
    developerAddress?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    findings?: JsonNullValueInput | InputJsonValue
    explorerUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ComplianceCertificateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    attestationUid?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    schemaUid?: StringFieldUpdateOperationsInput | string
    contractAddress?: StringFieldUpdateOperationsInput | string
    developerAddress?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    findings?: JsonNullValueInput | InputJsonValue
    explorerUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditSessionId?: StringFieldUpdateOperationsInput | string
  }

  export type ChatMessageCreateInput = {
    id?: string
    role: string
    content: string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    auditSession?: AuditSessionCreateNestedOneWithoutMessagesInput
  }

  export type ChatMessageUncheckedCreateInput = {
    id?: string
    sessionId: string
    role: string
    content: string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditSession?: AuditSessionUpdateOneWithoutMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManyInput = {
    id?: string
    sessionId: string
    role: string
    content: string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeChunkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeChunkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeChunkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeChunkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ComplianceCertificateNullableScalarRelationFilter = {
    is?: ComplianceCertificateWhereInput | null
    isNot?: ComplianceCertificateWhereInput | null
  }

  export type ChatMessageListRelationFilter = {
    every?: ChatMessageWhereInput
    some?: ChatMessageWhereInput
    none?: ChatMessageWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ChatMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditSessionCountOrderByAggregateInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    code?: SortOrder
    contractName?: SortOrder
    findings?: SortOrder
    score?: SortOrder
    verdict?: SortOrder
    auditHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuditSessionAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type AuditSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    code?: SortOrder
    contractName?: SortOrder
    score?: SortOrder
    verdict?: SortOrder
    auditHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuditSessionMinOrderByAggregateInput = {
    id?: SortOrder
    walletAddress?: SortOrder
    code?: SortOrder
    contractName?: SortOrder
    score?: SortOrder
    verdict?: SortOrder
    auditHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuditSessionSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type AuditSessionScalarRelationFilter = {
    is?: AuditSessionWhereInput
    isNot?: AuditSessionWhereInput
  }

  export type ComplianceCertificateCountOrderByAggregateInput = {
    id?: SortOrder
    attestationUid?: SortOrder
    txHash?: SortOrder
    schemaUid?: SortOrder
    contractAddress?: SortOrder
    developerAddress?: SortOrder
    score?: SortOrder
    findings?: SortOrder
    explorerUrl?: SortOrder
    createdAt?: SortOrder
    auditSessionId?: SortOrder
  }

  export type ComplianceCertificateAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type ComplianceCertificateMaxOrderByAggregateInput = {
    id?: SortOrder
    attestationUid?: SortOrder
    txHash?: SortOrder
    schemaUid?: SortOrder
    contractAddress?: SortOrder
    developerAddress?: SortOrder
    score?: SortOrder
    explorerUrl?: SortOrder
    createdAt?: SortOrder
    auditSessionId?: SortOrder
  }

  export type ComplianceCertificateMinOrderByAggregateInput = {
    id?: SortOrder
    attestationUid?: SortOrder
    txHash?: SortOrder
    schemaUid?: SortOrder
    contractAddress?: SortOrder
    developerAddress?: SortOrder
    score?: SortOrder
    explorerUrl?: SortOrder
    createdAt?: SortOrder
    auditSessionId?: SortOrder
  }

  export type ComplianceCertificateSumOrderByAggregateInput = {
    score?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuditSessionNullableScalarRelationFilter = {
    is?: AuditSessionWhereInput | null
    isNot?: AuditSessionWhereInput | null
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    sources?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type KnowledgeChunkCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrder
    category?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type KnowledgeChunkMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
  }

  export type KnowledgeChunkMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    source?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
  }

  export type ComplianceCertificateCreateNestedOneWithoutAuditSessionInput = {
    create?: XOR<ComplianceCertificateCreateWithoutAuditSessionInput, ComplianceCertificateUncheckedCreateWithoutAuditSessionInput>
    connectOrCreate?: ComplianceCertificateCreateOrConnectWithoutAuditSessionInput
    connect?: ComplianceCertificateWhereUniqueInput
  }

  export type ChatMessageCreateNestedManyWithoutAuditSessionInput = {
    create?: XOR<ChatMessageCreateWithoutAuditSessionInput, ChatMessageUncheckedCreateWithoutAuditSessionInput> | ChatMessageCreateWithoutAuditSessionInput[] | ChatMessageUncheckedCreateWithoutAuditSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutAuditSessionInput | ChatMessageCreateOrConnectWithoutAuditSessionInput[]
    createMany?: ChatMessageCreateManyAuditSessionInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type ComplianceCertificateUncheckedCreateNestedOneWithoutAuditSessionInput = {
    create?: XOR<ComplianceCertificateCreateWithoutAuditSessionInput, ComplianceCertificateUncheckedCreateWithoutAuditSessionInput>
    connectOrCreate?: ComplianceCertificateCreateOrConnectWithoutAuditSessionInput
    connect?: ComplianceCertificateWhereUniqueInput
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutAuditSessionInput = {
    create?: XOR<ChatMessageCreateWithoutAuditSessionInput, ChatMessageUncheckedCreateWithoutAuditSessionInput> | ChatMessageCreateWithoutAuditSessionInput[] | ChatMessageUncheckedCreateWithoutAuditSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutAuditSessionInput | ChatMessageCreateOrConnectWithoutAuditSessionInput[]
    createMany?: ChatMessageCreateManyAuditSessionInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ComplianceCertificateUpdateOneWithoutAuditSessionNestedInput = {
    create?: XOR<ComplianceCertificateCreateWithoutAuditSessionInput, ComplianceCertificateUncheckedCreateWithoutAuditSessionInput>
    connectOrCreate?: ComplianceCertificateCreateOrConnectWithoutAuditSessionInput
    upsert?: ComplianceCertificateUpsertWithoutAuditSessionInput
    disconnect?: ComplianceCertificateWhereInput | boolean
    delete?: ComplianceCertificateWhereInput | boolean
    connect?: ComplianceCertificateWhereUniqueInput
    update?: XOR<XOR<ComplianceCertificateUpdateToOneWithWhereWithoutAuditSessionInput, ComplianceCertificateUpdateWithoutAuditSessionInput>, ComplianceCertificateUncheckedUpdateWithoutAuditSessionInput>
  }

  export type ChatMessageUpdateManyWithoutAuditSessionNestedInput = {
    create?: XOR<ChatMessageCreateWithoutAuditSessionInput, ChatMessageUncheckedCreateWithoutAuditSessionInput> | ChatMessageCreateWithoutAuditSessionInput[] | ChatMessageUncheckedCreateWithoutAuditSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutAuditSessionInput | ChatMessageCreateOrConnectWithoutAuditSessionInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutAuditSessionInput | ChatMessageUpsertWithWhereUniqueWithoutAuditSessionInput[]
    createMany?: ChatMessageCreateManyAuditSessionInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutAuditSessionInput | ChatMessageUpdateWithWhereUniqueWithoutAuditSessionInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutAuditSessionInput | ChatMessageUpdateManyWithWhereWithoutAuditSessionInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type ComplianceCertificateUncheckedUpdateOneWithoutAuditSessionNestedInput = {
    create?: XOR<ComplianceCertificateCreateWithoutAuditSessionInput, ComplianceCertificateUncheckedCreateWithoutAuditSessionInput>
    connectOrCreate?: ComplianceCertificateCreateOrConnectWithoutAuditSessionInput
    upsert?: ComplianceCertificateUpsertWithoutAuditSessionInput
    disconnect?: ComplianceCertificateWhereInput | boolean
    delete?: ComplianceCertificateWhereInput | boolean
    connect?: ComplianceCertificateWhereUniqueInput
    update?: XOR<XOR<ComplianceCertificateUpdateToOneWithWhereWithoutAuditSessionInput, ComplianceCertificateUpdateWithoutAuditSessionInput>, ComplianceCertificateUncheckedUpdateWithoutAuditSessionInput>
  }

  export type ChatMessageUncheckedUpdateManyWithoutAuditSessionNestedInput = {
    create?: XOR<ChatMessageCreateWithoutAuditSessionInput, ChatMessageUncheckedCreateWithoutAuditSessionInput> | ChatMessageCreateWithoutAuditSessionInput[] | ChatMessageUncheckedCreateWithoutAuditSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutAuditSessionInput | ChatMessageCreateOrConnectWithoutAuditSessionInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutAuditSessionInput | ChatMessageUpsertWithWhereUniqueWithoutAuditSessionInput[]
    createMany?: ChatMessageCreateManyAuditSessionInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutAuditSessionInput | ChatMessageUpdateWithWhereUniqueWithoutAuditSessionInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutAuditSessionInput | ChatMessageUpdateManyWithWhereWithoutAuditSessionInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type AuditSessionCreateNestedOneWithoutCertificateInput = {
    create?: XOR<AuditSessionCreateWithoutCertificateInput, AuditSessionUncheckedCreateWithoutCertificateInput>
    connectOrCreate?: AuditSessionCreateOrConnectWithoutCertificateInput
    connect?: AuditSessionWhereUniqueInput
  }

  export type AuditSessionUpdateOneRequiredWithoutCertificateNestedInput = {
    create?: XOR<AuditSessionCreateWithoutCertificateInput, AuditSessionUncheckedCreateWithoutCertificateInput>
    connectOrCreate?: AuditSessionCreateOrConnectWithoutCertificateInput
    upsert?: AuditSessionUpsertWithoutCertificateInput
    connect?: AuditSessionWhereUniqueInput
    update?: XOR<XOR<AuditSessionUpdateToOneWithWhereWithoutCertificateInput, AuditSessionUpdateWithoutCertificateInput>, AuditSessionUncheckedUpdateWithoutCertificateInput>
  }

  export type AuditSessionCreateNestedOneWithoutMessagesInput = {
    create?: XOR<AuditSessionCreateWithoutMessagesInput, AuditSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: AuditSessionCreateOrConnectWithoutMessagesInput
    connect?: AuditSessionWhereUniqueInput
  }

  export type AuditSessionUpdateOneWithoutMessagesNestedInput = {
    create?: XOR<AuditSessionCreateWithoutMessagesInput, AuditSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: AuditSessionCreateOrConnectWithoutMessagesInput
    upsert?: AuditSessionUpsertWithoutMessagesInput
    disconnect?: AuditSessionWhereInput | boolean
    delete?: AuditSessionWhereInput | boolean
    connect?: AuditSessionWhereUniqueInput
    update?: XOR<XOR<AuditSessionUpdateToOneWithWhereWithoutMessagesInput, AuditSessionUpdateWithoutMessagesInput>, AuditSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ComplianceCertificateCreateWithoutAuditSessionInput = {
    id?: string
    attestationUid: string
    txHash: string
    schemaUid: string
    contractAddress: string
    developerAddress: string
    score: number
    findings: JsonNullValueInput | InputJsonValue
    explorerUrl: string
    createdAt?: Date | string
  }

  export type ComplianceCertificateUncheckedCreateWithoutAuditSessionInput = {
    id?: string
    attestationUid: string
    txHash: string
    schemaUid: string
    contractAddress: string
    developerAddress: string
    score: number
    findings: JsonNullValueInput | InputJsonValue
    explorerUrl: string
    createdAt?: Date | string
  }

  export type ComplianceCertificateCreateOrConnectWithoutAuditSessionInput = {
    where: ComplianceCertificateWhereUniqueInput
    create: XOR<ComplianceCertificateCreateWithoutAuditSessionInput, ComplianceCertificateUncheckedCreateWithoutAuditSessionInput>
  }

  export type ChatMessageCreateWithoutAuditSessionInput = {
    id?: string
    role: string
    content: string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUncheckedCreateWithoutAuditSessionInput = {
    id?: string
    role: string
    content: string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageCreateOrConnectWithoutAuditSessionInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutAuditSessionInput, ChatMessageUncheckedCreateWithoutAuditSessionInput>
  }

  export type ChatMessageCreateManyAuditSessionInputEnvelope = {
    data: ChatMessageCreateManyAuditSessionInput | ChatMessageCreateManyAuditSessionInput[]
    skipDuplicates?: boolean
  }

  export type ComplianceCertificateUpsertWithoutAuditSessionInput = {
    update: XOR<ComplianceCertificateUpdateWithoutAuditSessionInput, ComplianceCertificateUncheckedUpdateWithoutAuditSessionInput>
    create: XOR<ComplianceCertificateCreateWithoutAuditSessionInput, ComplianceCertificateUncheckedCreateWithoutAuditSessionInput>
    where?: ComplianceCertificateWhereInput
  }

  export type ComplianceCertificateUpdateToOneWithWhereWithoutAuditSessionInput = {
    where?: ComplianceCertificateWhereInput
    data: XOR<ComplianceCertificateUpdateWithoutAuditSessionInput, ComplianceCertificateUncheckedUpdateWithoutAuditSessionInput>
  }

  export type ComplianceCertificateUpdateWithoutAuditSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    attestationUid?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    schemaUid?: StringFieldUpdateOperationsInput | string
    contractAddress?: StringFieldUpdateOperationsInput | string
    developerAddress?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    findings?: JsonNullValueInput | InputJsonValue
    explorerUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ComplianceCertificateUncheckedUpdateWithoutAuditSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    attestationUid?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    schemaUid?: StringFieldUpdateOperationsInput | string
    contractAddress?: StringFieldUpdateOperationsInput | string
    developerAddress?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    findings?: JsonNullValueInput | InputJsonValue
    explorerUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutAuditSessionInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutAuditSessionInput, ChatMessageUncheckedUpdateWithoutAuditSessionInput>
    create: XOR<ChatMessageCreateWithoutAuditSessionInput, ChatMessageUncheckedCreateWithoutAuditSessionInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutAuditSessionInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutAuditSessionInput, ChatMessageUncheckedUpdateWithoutAuditSessionInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutAuditSessionInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutAuditSessionInput>
  }

  export type ChatMessageScalarWhereInput = {
    AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    OR?: ChatMessageScalarWhereInput[]
    NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringFilter<"ChatMessage"> | string
    sources?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
  }

  export type AuditSessionCreateWithoutCertificateInput = {
    id?: string
    walletAddress?: string | null
    code: string
    contractName?: string | null
    findings: JsonNullValueInput | InputJsonValue
    score: number
    verdict: string
    auditHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageCreateNestedManyWithoutAuditSessionInput
  }

  export type AuditSessionUncheckedCreateWithoutCertificateInput = {
    id?: string
    walletAddress?: string | null
    code: string
    contractName?: string | null
    findings: JsonNullValueInput | InputJsonValue
    score: number
    verdict: string
    auditHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutAuditSessionInput
  }

  export type AuditSessionCreateOrConnectWithoutCertificateInput = {
    where: AuditSessionWhereUniqueInput
    create: XOR<AuditSessionCreateWithoutCertificateInput, AuditSessionUncheckedCreateWithoutCertificateInput>
  }

  export type AuditSessionUpsertWithoutCertificateInput = {
    update: XOR<AuditSessionUpdateWithoutCertificateInput, AuditSessionUncheckedUpdateWithoutCertificateInput>
    create: XOR<AuditSessionCreateWithoutCertificateInput, AuditSessionUncheckedCreateWithoutCertificateInput>
    where?: AuditSessionWhereInput
  }

  export type AuditSessionUpdateToOneWithWhereWithoutCertificateInput = {
    where?: AuditSessionWhereInput
    data: XOR<AuditSessionUpdateWithoutCertificateInput, AuditSessionUncheckedUpdateWithoutCertificateInput>
  }

  export type AuditSessionUpdateWithoutCertificateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    contractName?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: JsonNullValueInput | InputJsonValue
    score?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    auditHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUpdateManyWithoutAuditSessionNestedInput
  }

  export type AuditSessionUncheckedUpdateWithoutCertificateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    contractName?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: JsonNullValueInput | InputJsonValue
    score?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    auditHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutAuditSessionNestedInput
  }

  export type AuditSessionCreateWithoutMessagesInput = {
    id?: string
    walletAddress?: string | null
    code: string
    contractName?: string | null
    findings: JsonNullValueInput | InputJsonValue
    score: number
    verdict: string
    auditHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    certificate?: ComplianceCertificateCreateNestedOneWithoutAuditSessionInput
  }

  export type AuditSessionUncheckedCreateWithoutMessagesInput = {
    id?: string
    walletAddress?: string | null
    code: string
    contractName?: string | null
    findings: JsonNullValueInput | InputJsonValue
    score: number
    verdict: string
    auditHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    certificate?: ComplianceCertificateUncheckedCreateNestedOneWithoutAuditSessionInput
  }

  export type AuditSessionCreateOrConnectWithoutMessagesInput = {
    where: AuditSessionWhereUniqueInput
    create: XOR<AuditSessionCreateWithoutMessagesInput, AuditSessionUncheckedCreateWithoutMessagesInput>
  }

  export type AuditSessionUpsertWithoutMessagesInput = {
    update: XOR<AuditSessionUpdateWithoutMessagesInput, AuditSessionUncheckedUpdateWithoutMessagesInput>
    create: XOR<AuditSessionCreateWithoutMessagesInput, AuditSessionUncheckedCreateWithoutMessagesInput>
    where?: AuditSessionWhereInput
  }

  export type AuditSessionUpdateToOneWithWhereWithoutMessagesInput = {
    where?: AuditSessionWhereInput
    data: XOR<AuditSessionUpdateWithoutMessagesInput, AuditSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type AuditSessionUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    contractName?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: JsonNullValueInput | InputJsonValue
    score?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    auditHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificate?: ComplianceCertificateUpdateOneWithoutAuditSessionNestedInput
  }

  export type AuditSessionUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    contractName?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: JsonNullValueInput | InputJsonValue
    score?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    auditHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    certificate?: ComplianceCertificateUncheckedUpdateOneWithoutAuditSessionNestedInput
  }

  export type ChatMessageCreateManyAuditSessionInput = {
    id?: string
    role: string
    content: string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUpdateWithoutAuditSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateWithoutAuditSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutAuditSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sources?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}