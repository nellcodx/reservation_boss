
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model RestaurantTable
 * 
 */
export type RestaurantTable = $Result.DefaultSelection<Prisma.$RestaurantTablePayload>
/**
 * Model Reservation
 * 
 */
export type Reservation = $Result.DefaultSelection<Prisma.$ReservationPayload>
/**
 * Model WaitlistEntry
 * 
 */
export type WaitlistEntry = $Result.DefaultSelection<Prisma.$WaitlistEntryPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ReservationStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus]


export const TableStatus: {
  FREE: 'FREE',
  OCCUPIED: 'OCCUPIED'
};

export type TableStatus = (typeof TableStatus)[keyof typeof TableStatus]

}

export type ReservationStatus = $Enums.ReservationStatus

export const ReservationStatus: typeof $Enums.ReservationStatus

export type TableStatus = $Enums.TableStatus

export const TableStatus: typeof $Enums.TableStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more RestaurantTables
 * const restaurantTables = await prisma.restaurantTable.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * // Fetch zero or more RestaurantTables
   * const restaurantTables = await prisma.restaurantTable.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * `prisma.restaurantTable`: Exposes CRUD operations for the **RestaurantTable** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RestaurantTables
    * const restaurantTables = await prisma.restaurantTable.findMany()
    * ```
    */
  get restaurantTable(): Prisma.RestaurantTableDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reservation`: Exposes CRUD operations for the **Reservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reservations
    * const reservations = await prisma.reservation.findMany()
    * ```
    */
  get reservation(): Prisma.ReservationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.waitlistEntry`: Exposes CRUD operations for the **WaitlistEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WaitlistEntries
    * const waitlistEntries = await prisma.waitlistEntry.findMany()
    * ```
    */
  get waitlistEntry(): Prisma.WaitlistEntryDelegate<ExtArgs, ClientOptions>;
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
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

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
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
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
    RestaurantTable: 'RestaurantTable',
    Reservation: 'Reservation',
    WaitlistEntry: 'WaitlistEntry'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "restaurantTable" | "reservation" | "waitlistEntry"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      RestaurantTable: {
        payload: Prisma.$RestaurantTablePayload<ExtArgs>
        fields: Prisma.RestaurantTableFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RestaurantTableFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantTablePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RestaurantTableFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantTablePayload>
          }
          findFirst: {
            args: Prisma.RestaurantTableFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantTablePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RestaurantTableFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantTablePayload>
          }
          findMany: {
            args: Prisma.RestaurantTableFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantTablePayload>[]
          }
          create: {
            args: Prisma.RestaurantTableCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantTablePayload>
          }
          createMany: {
            args: Prisma.RestaurantTableCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RestaurantTableCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantTablePayload>[]
          }
          delete: {
            args: Prisma.RestaurantTableDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantTablePayload>
          }
          update: {
            args: Prisma.RestaurantTableUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantTablePayload>
          }
          deleteMany: {
            args: Prisma.RestaurantTableDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RestaurantTableUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RestaurantTableUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantTablePayload>[]
          }
          upsert: {
            args: Prisma.RestaurantTableUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantTablePayload>
          }
          aggregate: {
            args: Prisma.RestaurantTableAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRestaurantTable>
          }
          groupBy: {
            args: Prisma.RestaurantTableGroupByArgs<ExtArgs>
            result: $Utils.Optional<RestaurantTableGroupByOutputType>[]
          }
          count: {
            args: Prisma.RestaurantTableCountArgs<ExtArgs>
            result: $Utils.Optional<RestaurantTableCountAggregateOutputType> | number
          }
        }
      }
      Reservation: {
        payload: Prisma.$ReservationPayload<ExtArgs>
        fields: Prisma.ReservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          findFirst: {
            args: Prisma.ReservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          findMany: {
            args: Prisma.ReservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          create: {
            args: Prisma.ReservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          createMany: {
            args: Prisma.ReservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          delete: {
            args: Prisma.ReservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          update: {
            args: Prisma.ReservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          deleteMany: {
            args: Prisma.ReservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReservationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          upsert: {
            args: Prisma.ReservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          aggregate: {
            args: Prisma.ReservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReservation>
          }
          groupBy: {
            args: Prisma.ReservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReservationCountArgs<ExtArgs>
            result: $Utils.Optional<ReservationCountAggregateOutputType> | number
          }
        }
      }
      WaitlistEntry: {
        payload: Prisma.$WaitlistEntryPayload<ExtArgs>
        fields: Prisma.WaitlistEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WaitlistEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WaitlistEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>
          }
          findFirst: {
            args: Prisma.WaitlistEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WaitlistEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>
          }
          findMany: {
            args: Prisma.WaitlistEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>[]
          }
          create: {
            args: Prisma.WaitlistEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>
          }
          createMany: {
            args: Prisma.WaitlistEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WaitlistEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>[]
          }
          delete: {
            args: Prisma.WaitlistEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>
          }
          update: {
            args: Prisma.WaitlistEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>
          }
          deleteMany: {
            args: Prisma.WaitlistEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WaitlistEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WaitlistEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>[]
          }
          upsert: {
            args: Prisma.WaitlistEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>
          }
          aggregate: {
            args: Prisma.WaitlistEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWaitlistEntry>
          }
          groupBy: {
            args: Prisma.WaitlistEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<WaitlistEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.WaitlistEntryCountArgs<ExtArgs>
            result: $Utils.Optional<WaitlistEntryCountAggregateOutputType> | number
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
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
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
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
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
    adapter?: runtime.SqlDriverAdapterFactory | null
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
  }
  export type GlobalOmitConfig = {
    restaurantTable?: RestaurantTableOmit
    reservation?: ReservationOmit
    waitlistEntry?: WaitlistEntryOmit
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
   * Count Type RestaurantTableCountOutputType
   */

  export type RestaurantTableCountOutputType = {
    reservations: number
  }

  export type RestaurantTableCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservations?: boolean | RestaurantTableCountOutputTypeCountReservationsArgs
  }

  // Custom InputTypes
  /**
   * RestaurantTableCountOutputType without action
   */
  export type RestaurantTableCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTableCountOutputType
     */
    select?: RestaurantTableCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RestaurantTableCountOutputType without action
   */
  export type RestaurantTableCountOutputTypeCountReservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model RestaurantTable
   */

  export type AggregateRestaurantTable = {
    _count: RestaurantTableCountAggregateOutputType | null
    _avg: RestaurantTableAvgAggregateOutputType | null
    _sum: RestaurantTableSumAggregateOutputType | null
    _min: RestaurantTableMinAggregateOutputType | null
    _max: RestaurantTableMaxAggregateOutputType | null
  }

  export type RestaurantTableAvgAggregateOutputType = {
    capacity: number | null
    x: number | null
    y: number | null
  }

  export type RestaurantTableSumAggregateOutputType = {
    capacity: number | null
    x: number | null
    y: number | null
  }

  export type RestaurantTableMinAggregateOutputType = {
    id: string | null
    name: string | null
    capacity: number | null
    x: number | null
    y: number | null
    status: $Enums.TableStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RestaurantTableMaxAggregateOutputType = {
    id: string | null
    name: string | null
    capacity: number | null
    x: number | null
    y: number | null
    status: $Enums.TableStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RestaurantTableCountAggregateOutputType = {
    id: number
    name: number
    capacity: number
    x: number
    y: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RestaurantTableAvgAggregateInputType = {
    capacity?: true
    x?: true
    y?: true
  }

  export type RestaurantTableSumAggregateInputType = {
    capacity?: true
    x?: true
    y?: true
  }

  export type RestaurantTableMinAggregateInputType = {
    id?: true
    name?: true
    capacity?: true
    x?: true
    y?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RestaurantTableMaxAggregateInputType = {
    id?: true
    name?: true
    capacity?: true
    x?: true
    y?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RestaurantTableCountAggregateInputType = {
    id?: true
    name?: true
    capacity?: true
    x?: true
    y?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RestaurantTableAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RestaurantTable to aggregate.
     */
    where?: RestaurantTableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RestaurantTables to fetch.
     */
    orderBy?: RestaurantTableOrderByWithRelationInput | RestaurantTableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RestaurantTableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RestaurantTables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RestaurantTables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RestaurantTables
    **/
    _count?: true | RestaurantTableCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RestaurantTableAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RestaurantTableSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RestaurantTableMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RestaurantTableMaxAggregateInputType
  }

  export type GetRestaurantTableAggregateType<T extends RestaurantTableAggregateArgs> = {
        [P in keyof T & keyof AggregateRestaurantTable]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRestaurantTable[P]>
      : GetScalarType<T[P], AggregateRestaurantTable[P]>
  }




  export type RestaurantTableGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RestaurantTableWhereInput
    orderBy?: RestaurantTableOrderByWithAggregationInput | RestaurantTableOrderByWithAggregationInput[]
    by: RestaurantTableScalarFieldEnum[] | RestaurantTableScalarFieldEnum
    having?: RestaurantTableScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RestaurantTableCountAggregateInputType | true
    _avg?: RestaurantTableAvgAggregateInputType
    _sum?: RestaurantTableSumAggregateInputType
    _min?: RestaurantTableMinAggregateInputType
    _max?: RestaurantTableMaxAggregateInputType
  }

  export type RestaurantTableGroupByOutputType = {
    id: string
    name: string
    capacity: number
    x: number
    y: number
    status: $Enums.TableStatus
    createdAt: Date
    updatedAt: Date
    _count: RestaurantTableCountAggregateOutputType | null
    _avg: RestaurantTableAvgAggregateOutputType | null
    _sum: RestaurantTableSumAggregateOutputType | null
    _min: RestaurantTableMinAggregateOutputType | null
    _max: RestaurantTableMaxAggregateOutputType | null
  }

  type GetRestaurantTableGroupByPayload<T extends RestaurantTableGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RestaurantTableGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RestaurantTableGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RestaurantTableGroupByOutputType[P]>
            : GetScalarType<T[P], RestaurantTableGroupByOutputType[P]>
        }
      >
    >


  export type RestaurantTableSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    capacity?: boolean
    x?: boolean
    y?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reservations?: boolean | RestaurantTable$reservationsArgs<ExtArgs>
    _count?: boolean | RestaurantTableCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["restaurantTable"]>

  export type RestaurantTableSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    capacity?: boolean
    x?: boolean
    y?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["restaurantTable"]>

  export type RestaurantTableSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    capacity?: boolean
    x?: boolean
    y?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["restaurantTable"]>

  export type RestaurantTableSelectScalar = {
    id?: boolean
    name?: boolean
    capacity?: boolean
    x?: boolean
    y?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RestaurantTableOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "capacity" | "x" | "y" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["restaurantTable"]>
  export type RestaurantTableInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservations?: boolean | RestaurantTable$reservationsArgs<ExtArgs>
    _count?: boolean | RestaurantTableCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RestaurantTableIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RestaurantTableIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RestaurantTablePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RestaurantTable"
    objects: {
      reservations: Prisma.$ReservationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      capacity: number
      x: number
      y: number
      status: $Enums.TableStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["restaurantTable"]>
    composites: {}
  }

  type RestaurantTableGetPayload<S extends boolean | null | undefined | RestaurantTableDefaultArgs> = $Result.GetResult<Prisma.$RestaurantTablePayload, S>

  type RestaurantTableCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RestaurantTableFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RestaurantTableCountAggregateInputType | true
    }

  export interface RestaurantTableDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RestaurantTable'], meta: { name: 'RestaurantTable' } }
    /**
     * Find zero or one RestaurantTable that matches the filter.
     * @param {RestaurantTableFindUniqueArgs} args - Arguments to find a RestaurantTable
     * @example
     * // Get one RestaurantTable
     * const restaurantTable = await prisma.restaurantTable.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RestaurantTableFindUniqueArgs>(args: SelectSubset<T, RestaurantTableFindUniqueArgs<ExtArgs>>): Prisma__RestaurantTableClient<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RestaurantTable that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RestaurantTableFindUniqueOrThrowArgs} args - Arguments to find a RestaurantTable
     * @example
     * // Get one RestaurantTable
     * const restaurantTable = await prisma.restaurantTable.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RestaurantTableFindUniqueOrThrowArgs>(args: SelectSubset<T, RestaurantTableFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RestaurantTableClient<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RestaurantTable that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantTableFindFirstArgs} args - Arguments to find a RestaurantTable
     * @example
     * // Get one RestaurantTable
     * const restaurantTable = await prisma.restaurantTable.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RestaurantTableFindFirstArgs>(args?: SelectSubset<T, RestaurantTableFindFirstArgs<ExtArgs>>): Prisma__RestaurantTableClient<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RestaurantTable that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantTableFindFirstOrThrowArgs} args - Arguments to find a RestaurantTable
     * @example
     * // Get one RestaurantTable
     * const restaurantTable = await prisma.restaurantTable.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RestaurantTableFindFirstOrThrowArgs>(args?: SelectSubset<T, RestaurantTableFindFirstOrThrowArgs<ExtArgs>>): Prisma__RestaurantTableClient<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RestaurantTables that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantTableFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RestaurantTables
     * const restaurantTables = await prisma.restaurantTable.findMany()
     * 
     * // Get first 10 RestaurantTables
     * const restaurantTables = await prisma.restaurantTable.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const restaurantTableWithIdOnly = await prisma.restaurantTable.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RestaurantTableFindManyArgs>(args?: SelectSubset<T, RestaurantTableFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RestaurantTable.
     * @param {RestaurantTableCreateArgs} args - Arguments to create a RestaurantTable.
     * @example
     * // Create one RestaurantTable
     * const RestaurantTable = await prisma.restaurantTable.create({
     *   data: {
     *     // ... data to create a RestaurantTable
     *   }
     * })
     * 
     */
    create<T extends RestaurantTableCreateArgs>(args: SelectSubset<T, RestaurantTableCreateArgs<ExtArgs>>): Prisma__RestaurantTableClient<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RestaurantTables.
     * @param {RestaurantTableCreateManyArgs} args - Arguments to create many RestaurantTables.
     * @example
     * // Create many RestaurantTables
     * const restaurantTable = await prisma.restaurantTable.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RestaurantTableCreateManyArgs>(args?: SelectSubset<T, RestaurantTableCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RestaurantTables and returns the data saved in the database.
     * @param {RestaurantTableCreateManyAndReturnArgs} args - Arguments to create many RestaurantTables.
     * @example
     * // Create many RestaurantTables
     * const restaurantTable = await prisma.restaurantTable.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RestaurantTables and only return the `id`
     * const restaurantTableWithIdOnly = await prisma.restaurantTable.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RestaurantTableCreateManyAndReturnArgs>(args?: SelectSubset<T, RestaurantTableCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RestaurantTable.
     * @param {RestaurantTableDeleteArgs} args - Arguments to delete one RestaurantTable.
     * @example
     * // Delete one RestaurantTable
     * const RestaurantTable = await prisma.restaurantTable.delete({
     *   where: {
     *     // ... filter to delete one RestaurantTable
     *   }
     * })
     * 
     */
    delete<T extends RestaurantTableDeleteArgs>(args: SelectSubset<T, RestaurantTableDeleteArgs<ExtArgs>>): Prisma__RestaurantTableClient<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RestaurantTable.
     * @param {RestaurantTableUpdateArgs} args - Arguments to update one RestaurantTable.
     * @example
     * // Update one RestaurantTable
     * const restaurantTable = await prisma.restaurantTable.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RestaurantTableUpdateArgs>(args: SelectSubset<T, RestaurantTableUpdateArgs<ExtArgs>>): Prisma__RestaurantTableClient<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RestaurantTables.
     * @param {RestaurantTableDeleteManyArgs} args - Arguments to filter RestaurantTables to delete.
     * @example
     * // Delete a few RestaurantTables
     * const { count } = await prisma.restaurantTable.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RestaurantTableDeleteManyArgs>(args?: SelectSubset<T, RestaurantTableDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RestaurantTables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantTableUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RestaurantTables
     * const restaurantTable = await prisma.restaurantTable.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RestaurantTableUpdateManyArgs>(args: SelectSubset<T, RestaurantTableUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RestaurantTables and returns the data updated in the database.
     * @param {RestaurantTableUpdateManyAndReturnArgs} args - Arguments to update many RestaurantTables.
     * @example
     * // Update many RestaurantTables
     * const restaurantTable = await prisma.restaurantTable.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RestaurantTables and only return the `id`
     * const restaurantTableWithIdOnly = await prisma.restaurantTable.updateManyAndReturn({
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
    updateManyAndReturn<T extends RestaurantTableUpdateManyAndReturnArgs>(args: SelectSubset<T, RestaurantTableUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RestaurantTable.
     * @param {RestaurantTableUpsertArgs} args - Arguments to update or create a RestaurantTable.
     * @example
     * // Update or create a RestaurantTable
     * const restaurantTable = await prisma.restaurantTable.upsert({
     *   create: {
     *     // ... data to create a RestaurantTable
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RestaurantTable we want to update
     *   }
     * })
     */
    upsert<T extends RestaurantTableUpsertArgs>(args: SelectSubset<T, RestaurantTableUpsertArgs<ExtArgs>>): Prisma__RestaurantTableClient<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RestaurantTables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantTableCountArgs} args - Arguments to filter RestaurantTables to count.
     * @example
     * // Count the number of RestaurantTables
     * const count = await prisma.restaurantTable.count({
     *   where: {
     *     // ... the filter for the RestaurantTables we want to count
     *   }
     * })
    **/
    count<T extends RestaurantTableCountArgs>(
      args?: Subset<T, RestaurantTableCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RestaurantTableCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RestaurantTable.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantTableAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RestaurantTableAggregateArgs>(args: Subset<T, RestaurantTableAggregateArgs>): Prisma.PrismaPromise<GetRestaurantTableAggregateType<T>>

    /**
     * Group by RestaurantTable.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantTableGroupByArgs} args - Group by arguments.
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
      T extends RestaurantTableGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RestaurantTableGroupByArgs['orderBy'] }
        : { orderBy?: RestaurantTableGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RestaurantTableGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRestaurantTableGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RestaurantTable model
   */
  readonly fields: RestaurantTableFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RestaurantTable.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RestaurantTableClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reservations<T extends RestaurantTable$reservationsArgs<ExtArgs> = {}>(args?: Subset<T, RestaurantTable$reservationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the RestaurantTable model
   */
  interface RestaurantTableFieldRefs {
    readonly id: FieldRef<"RestaurantTable", 'String'>
    readonly name: FieldRef<"RestaurantTable", 'String'>
    readonly capacity: FieldRef<"RestaurantTable", 'Int'>
    readonly x: FieldRef<"RestaurantTable", 'Int'>
    readonly y: FieldRef<"RestaurantTable", 'Int'>
    readonly status: FieldRef<"RestaurantTable", 'TableStatus'>
    readonly createdAt: FieldRef<"RestaurantTable", 'DateTime'>
    readonly updatedAt: FieldRef<"RestaurantTable", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RestaurantTable findUnique
   */
  export type RestaurantTableFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantTableInclude<ExtArgs> | null
    /**
     * Filter, which RestaurantTable to fetch.
     */
    where: RestaurantTableWhereUniqueInput
  }

  /**
   * RestaurantTable findUniqueOrThrow
   */
  export type RestaurantTableFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantTableInclude<ExtArgs> | null
    /**
     * Filter, which RestaurantTable to fetch.
     */
    where: RestaurantTableWhereUniqueInput
  }

  /**
   * RestaurantTable findFirst
   */
  export type RestaurantTableFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantTableInclude<ExtArgs> | null
    /**
     * Filter, which RestaurantTable to fetch.
     */
    where?: RestaurantTableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RestaurantTables to fetch.
     */
    orderBy?: RestaurantTableOrderByWithRelationInput | RestaurantTableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RestaurantTables.
     */
    cursor?: RestaurantTableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RestaurantTables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RestaurantTables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RestaurantTables.
     */
    distinct?: RestaurantTableScalarFieldEnum | RestaurantTableScalarFieldEnum[]
  }

  /**
   * RestaurantTable findFirstOrThrow
   */
  export type RestaurantTableFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantTableInclude<ExtArgs> | null
    /**
     * Filter, which RestaurantTable to fetch.
     */
    where?: RestaurantTableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RestaurantTables to fetch.
     */
    orderBy?: RestaurantTableOrderByWithRelationInput | RestaurantTableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RestaurantTables.
     */
    cursor?: RestaurantTableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RestaurantTables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RestaurantTables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RestaurantTables.
     */
    distinct?: RestaurantTableScalarFieldEnum | RestaurantTableScalarFieldEnum[]
  }

  /**
   * RestaurantTable findMany
   */
  export type RestaurantTableFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantTableInclude<ExtArgs> | null
    /**
     * Filter, which RestaurantTables to fetch.
     */
    where?: RestaurantTableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RestaurantTables to fetch.
     */
    orderBy?: RestaurantTableOrderByWithRelationInput | RestaurantTableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RestaurantTables.
     */
    cursor?: RestaurantTableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RestaurantTables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RestaurantTables.
     */
    skip?: number
    distinct?: RestaurantTableScalarFieldEnum | RestaurantTableScalarFieldEnum[]
  }

  /**
   * RestaurantTable create
   */
  export type RestaurantTableCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantTableInclude<ExtArgs> | null
    /**
     * The data needed to create a RestaurantTable.
     */
    data: XOR<RestaurantTableCreateInput, RestaurantTableUncheckedCreateInput>
  }

  /**
   * RestaurantTable createMany
   */
  export type RestaurantTableCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RestaurantTables.
     */
    data: RestaurantTableCreateManyInput | RestaurantTableCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RestaurantTable createManyAndReturn
   */
  export type RestaurantTableCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * The data used to create many RestaurantTables.
     */
    data: RestaurantTableCreateManyInput | RestaurantTableCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RestaurantTable update
   */
  export type RestaurantTableUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantTableInclude<ExtArgs> | null
    /**
     * The data needed to update a RestaurantTable.
     */
    data: XOR<RestaurantTableUpdateInput, RestaurantTableUncheckedUpdateInput>
    /**
     * Choose, which RestaurantTable to update.
     */
    where: RestaurantTableWhereUniqueInput
  }

  /**
   * RestaurantTable updateMany
   */
  export type RestaurantTableUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RestaurantTables.
     */
    data: XOR<RestaurantTableUpdateManyMutationInput, RestaurantTableUncheckedUpdateManyInput>
    /**
     * Filter which RestaurantTables to update
     */
    where?: RestaurantTableWhereInput
    /**
     * Limit how many RestaurantTables to update.
     */
    limit?: number
  }

  /**
   * RestaurantTable updateManyAndReturn
   */
  export type RestaurantTableUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * The data used to update RestaurantTables.
     */
    data: XOR<RestaurantTableUpdateManyMutationInput, RestaurantTableUncheckedUpdateManyInput>
    /**
     * Filter which RestaurantTables to update
     */
    where?: RestaurantTableWhereInput
    /**
     * Limit how many RestaurantTables to update.
     */
    limit?: number
  }

  /**
   * RestaurantTable upsert
   */
  export type RestaurantTableUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantTableInclude<ExtArgs> | null
    /**
     * The filter to search for the RestaurantTable to update in case it exists.
     */
    where: RestaurantTableWhereUniqueInput
    /**
     * In case the RestaurantTable found by the `where` argument doesn't exist, create a new RestaurantTable with this data.
     */
    create: XOR<RestaurantTableCreateInput, RestaurantTableUncheckedCreateInput>
    /**
     * In case the RestaurantTable was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RestaurantTableUpdateInput, RestaurantTableUncheckedUpdateInput>
  }

  /**
   * RestaurantTable delete
   */
  export type RestaurantTableDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantTableInclude<ExtArgs> | null
    /**
     * Filter which RestaurantTable to delete.
     */
    where: RestaurantTableWhereUniqueInput
  }

  /**
   * RestaurantTable deleteMany
   */
  export type RestaurantTableDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RestaurantTables to delete
     */
    where?: RestaurantTableWhereInput
    /**
     * Limit how many RestaurantTables to delete.
     */
    limit?: number
  }

  /**
   * RestaurantTable.reservations
   */
  export type RestaurantTable$reservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    where?: ReservationWhereInput
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    cursor?: ReservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * RestaurantTable without action
   */
  export type RestaurantTableDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantTable
     */
    select?: RestaurantTableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantTable
     */
    omit?: RestaurantTableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantTableInclude<ExtArgs> | null
  }


  /**
   * Model Reservation
   */

  export type AggregateReservation = {
    _count: ReservationCountAggregateOutputType | null
    _avg: ReservationAvgAggregateOutputType | null
    _sum: ReservationSumAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  export type ReservationAvgAggregateOutputType = {
    partySize: number | null
  }

  export type ReservationSumAggregateOutputType = {
    partySize: number | null
  }

  export type ReservationMinAggregateOutputType = {
    id: string | null
    startAt: Date | null
    endAt: Date | null
    partySize: number | null
    status: $Enums.ReservationStatus | null
    guestName: string | null
    guestPhone: string | null
    notes: string | null
    source: string | null
    createdAt: Date | null
    updatedAt: Date | null
    tableId: string | null
    smsConfirmationSentAt: Date | null
    smsReminderSentAt: Date | null
  }

  export type ReservationMaxAggregateOutputType = {
    id: string | null
    startAt: Date | null
    endAt: Date | null
    partySize: number | null
    status: $Enums.ReservationStatus | null
    guestName: string | null
    guestPhone: string | null
    notes: string | null
    source: string | null
    createdAt: Date | null
    updatedAt: Date | null
    tableId: string | null
    smsConfirmationSentAt: Date | null
    smsReminderSentAt: Date | null
  }

  export type ReservationCountAggregateOutputType = {
    id: number
    startAt: number
    endAt: number
    partySize: number
    status: number
    guestName: number
    guestPhone: number
    notes: number
    source: number
    createdAt: number
    updatedAt: number
    tableId: number
    smsConfirmationSentAt: number
    smsReminderSentAt: number
    _all: number
  }


  export type ReservationAvgAggregateInputType = {
    partySize?: true
  }

  export type ReservationSumAggregateInputType = {
    partySize?: true
  }

  export type ReservationMinAggregateInputType = {
    id?: true
    startAt?: true
    endAt?: true
    partySize?: true
    status?: true
    guestName?: true
    guestPhone?: true
    notes?: true
    source?: true
    createdAt?: true
    updatedAt?: true
    tableId?: true
    smsConfirmationSentAt?: true
    smsReminderSentAt?: true
  }

  export type ReservationMaxAggregateInputType = {
    id?: true
    startAt?: true
    endAt?: true
    partySize?: true
    status?: true
    guestName?: true
    guestPhone?: true
    notes?: true
    source?: true
    createdAt?: true
    updatedAt?: true
    tableId?: true
    smsConfirmationSentAt?: true
    smsReminderSentAt?: true
  }

  export type ReservationCountAggregateInputType = {
    id?: true
    startAt?: true
    endAt?: true
    partySize?: true
    status?: true
    guestName?: true
    guestPhone?: true
    notes?: true
    source?: true
    createdAt?: true
    updatedAt?: true
    tableId?: true
    smsConfirmationSentAt?: true
    smsReminderSentAt?: true
    _all?: true
  }

  export type ReservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservation to aggregate.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reservations
    **/
    _count?: true | ReservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReservationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReservationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservationMaxAggregateInputType
  }

  export type GetReservationAggregateType<T extends ReservationAggregateArgs> = {
        [P in keyof T & keyof AggregateReservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReservation[P]>
      : GetScalarType<T[P], AggregateReservation[P]>
  }




  export type ReservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationWhereInput
    orderBy?: ReservationOrderByWithAggregationInput | ReservationOrderByWithAggregationInput[]
    by: ReservationScalarFieldEnum[] | ReservationScalarFieldEnum
    having?: ReservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservationCountAggregateInputType | true
    _avg?: ReservationAvgAggregateInputType
    _sum?: ReservationSumAggregateInputType
    _min?: ReservationMinAggregateInputType
    _max?: ReservationMaxAggregateInputType
  }

  export type ReservationGroupByOutputType = {
    id: string
    startAt: Date
    endAt: Date
    partySize: number
    status: $Enums.ReservationStatus
    guestName: string
    guestPhone: string
    notes: string | null
    source: string
    createdAt: Date
    updatedAt: Date
    tableId: string
    smsConfirmationSentAt: Date | null
    smsReminderSentAt: Date | null
    _count: ReservationCountAggregateOutputType | null
    _avg: ReservationAvgAggregateOutputType | null
    _sum: ReservationSumAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  type GetReservationGroupByPayload<T extends ReservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservationGroupByOutputType[P]>
            : GetScalarType<T[P], ReservationGroupByOutputType[P]>
        }
      >
    >


  export type ReservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startAt?: boolean
    endAt?: boolean
    partySize?: boolean
    status?: boolean
    guestName?: boolean
    guestPhone?: boolean
    notes?: boolean
    source?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tableId?: boolean
    smsConfirmationSentAt?: boolean
    smsReminderSentAt?: boolean
    table?: boolean | RestaurantTableDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startAt?: boolean
    endAt?: boolean
    partySize?: boolean
    status?: boolean
    guestName?: boolean
    guestPhone?: boolean
    notes?: boolean
    source?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tableId?: boolean
    smsConfirmationSentAt?: boolean
    smsReminderSentAt?: boolean
    table?: boolean | RestaurantTableDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startAt?: boolean
    endAt?: boolean
    partySize?: boolean
    status?: boolean
    guestName?: boolean
    guestPhone?: boolean
    notes?: boolean
    source?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tableId?: boolean
    smsConfirmationSentAt?: boolean
    smsReminderSentAt?: boolean
    table?: boolean | RestaurantTableDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectScalar = {
    id?: boolean
    startAt?: boolean
    endAt?: boolean
    partySize?: boolean
    status?: boolean
    guestName?: boolean
    guestPhone?: boolean
    notes?: boolean
    source?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tableId?: boolean
    smsConfirmationSentAt?: boolean
    smsReminderSentAt?: boolean
  }

  export type ReservationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "startAt" | "endAt" | "partySize" | "status" | "guestName" | "guestPhone" | "notes" | "source" | "createdAt" | "updatedAt" | "tableId" | "smsConfirmationSentAt" | "smsReminderSentAt", ExtArgs["result"]["reservation"]>
  export type ReservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    table?: boolean | RestaurantTableDefaultArgs<ExtArgs>
  }
  export type ReservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    table?: boolean | RestaurantTableDefaultArgs<ExtArgs>
  }
  export type ReservationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    table?: boolean | RestaurantTableDefaultArgs<ExtArgs>
  }

  export type $ReservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reservation"
    objects: {
      table: Prisma.$RestaurantTablePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      startAt: Date
      endAt: Date
      partySize: number
      status: $Enums.ReservationStatus
      guestName: string
      guestPhone: string
      notes: string | null
      source: string
      createdAt: Date
      updatedAt: Date
      tableId: string
      smsConfirmationSentAt: Date | null
      smsReminderSentAt: Date | null
    }, ExtArgs["result"]["reservation"]>
    composites: {}
  }

  type ReservationGetPayload<S extends boolean | null | undefined | ReservationDefaultArgs> = $Result.GetResult<Prisma.$ReservationPayload, S>

  type ReservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReservationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReservationCountAggregateInputType | true
    }

  export interface ReservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reservation'], meta: { name: 'Reservation' } }
    /**
     * Find zero or one Reservation that matches the filter.
     * @param {ReservationFindUniqueArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReservationFindUniqueArgs>(args: SelectSubset<T, ReservationFindUniqueArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reservation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReservationFindUniqueOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReservationFindUniqueOrThrowArgs>(args: SelectSubset<T, ReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindFirstArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReservationFindFirstArgs>(args?: SelectSubset<T, ReservationFindFirstArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindFirstOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReservationFindFirstOrThrowArgs>(args?: SelectSubset<T, ReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reservations
     * const reservations = await prisma.reservation.findMany()
     * 
     * // Get first 10 Reservations
     * const reservations = await prisma.reservation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reservationWithIdOnly = await prisma.reservation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReservationFindManyArgs>(args?: SelectSubset<T, ReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reservation.
     * @param {ReservationCreateArgs} args - Arguments to create a Reservation.
     * @example
     * // Create one Reservation
     * const Reservation = await prisma.reservation.create({
     *   data: {
     *     // ... data to create a Reservation
     *   }
     * })
     * 
     */
    create<T extends ReservationCreateArgs>(args: SelectSubset<T, ReservationCreateArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reservations.
     * @param {ReservationCreateManyArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReservationCreateManyArgs>(args?: SelectSubset<T, ReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reservations and returns the data saved in the database.
     * @param {ReservationCreateManyAndReturnArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reservations and only return the `id`
     * const reservationWithIdOnly = await prisma.reservation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReservationCreateManyAndReturnArgs>(args?: SelectSubset<T, ReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reservation.
     * @param {ReservationDeleteArgs} args - Arguments to delete one Reservation.
     * @example
     * // Delete one Reservation
     * const Reservation = await prisma.reservation.delete({
     *   where: {
     *     // ... filter to delete one Reservation
     *   }
     * })
     * 
     */
    delete<T extends ReservationDeleteArgs>(args: SelectSubset<T, ReservationDeleteArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reservation.
     * @param {ReservationUpdateArgs} args - Arguments to update one Reservation.
     * @example
     * // Update one Reservation
     * const reservation = await prisma.reservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReservationUpdateArgs>(args: SelectSubset<T, ReservationUpdateArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reservations.
     * @param {ReservationDeleteManyArgs} args - Arguments to filter Reservations to delete.
     * @example
     * // Delete a few Reservations
     * const { count } = await prisma.reservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReservationDeleteManyArgs>(args?: SelectSubset<T, ReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reservations
     * const reservation = await prisma.reservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReservationUpdateManyArgs>(args: SelectSubset<T, ReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservations and returns the data updated in the database.
     * @param {ReservationUpdateManyAndReturnArgs} args - Arguments to update many Reservations.
     * @example
     * // Update many Reservations
     * const reservation = await prisma.reservation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reservations and only return the `id`
     * const reservationWithIdOnly = await prisma.reservation.updateManyAndReturn({
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
    updateManyAndReturn<T extends ReservationUpdateManyAndReturnArgs>(args: SelectSubset<T, ReservationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reservation.
     * @param {ReservationUpsertArgs} args - Arguments to update or create a Reservation.
     * @example
     * // Update or create a Reservation
     * const reservation = await prisma.reservation.upsert({
     *   create: {
     *     // ... data to create a Reservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reservation we want to update
     *   }
     * })
     */
    upsert<T extends ReservationUpsertArgs>(args: SelectSubset<T, ReservationUpsertArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationCountArgs} args - Arguments to filter Reservations to count.
     * @example
     * // Count the number of Reservations
     * const count = await prisma.reservation.count({
     *   where: {
     *     // ... the filter for the Reservations we want to count
     *   }
     * })
    **/
    count<T extends ReservationCountArgs>(
      args?: Subset<T, ReservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReservationAggregateArgs>(args: Subset<T, ReservationAggregateArgs>): Prisma.PrismaPromise<GetReservationAggregateType<T>>

    /**
     * Group by Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationGroupByArgs} args - Group by arguments.
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
      T extends ReservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReservationGroupByArgs['orderBy'] }
        : { orderBy?: ReservationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reservation model
   */
  readonly fields: ReservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    table<T extends RestaurantTableDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RestaurantTableDefaultArgs<ExtArgs>>): Prisma__RestaurantTableClient<$Result.GetResult<Prisma.$RestaurantTablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Reservation model
   */
  interface ReservationFieldRefs {
    readonly id: FieldRef<"Reservation", 'String'>
    readonly startAt: FieldRef<"Reservation", 'DateTime'>
    readonly endAt: FieldRef<"Reservation", 'DateTime'>
    readonly partySize: FieldRef<"Reservation", 'Int'>
    readonly status: FieldRef<"Reservation", 'ReservationStatus'>
    readonly guestName: FieldRef<"Reservation", 'String'>
    readonly guestPhone: FieldRef<"Reservation", 'String'>
    readonly notes: FieldRef<"Reservation", 'String'>
    readonly source: FieldRef<"Reservation", 'String'>
    readonly createdAt: FieldRef<"Reservation", 'DateTime'>
    readonly updatedAt: FieldRef<"Reservation", 'DateTime'>
    readonly tableId: FieldRef<"Reservation", 'String'>
    readonly smsConfirmationSentAt: FieldRef<"Reservation", 'DateTime'>
    readonly smsReminderSentAt: FieldRef<"Reservation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Reservation findUnique
   */
  export type ReservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation findUniqueOrThrow
   */
  export type ReservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation findFirst
   */
  export type ReservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation findFirstOrThrow
   */
  export type ReservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation findMany
   */
  export type ReservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter, which Reservations to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation create
   */
  export type ReservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The data needed to create a Reservation.
     */
    data: XOR<ReservationCreateInput, ReservationUncheckedCreateInput>
  }

  /**
   * Reservation createMany
   */
  export type ReservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reservations.
     */
    data: ReservationCreateManyInput | ReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reservation createManyAndReturn
   */
  export type ReservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * The data used to create many Reservations.
     */
    data: ReservationCreateManyInput | ReservationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reservation update
   */
  export type ReservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The data needed to update a Reservation.
     */
    data: XOR<ReservationUpdateInput, ReservationUncheckedUpdateInput>
    /**
     * Choose, which Reservation to update.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation updateMany
   */
  export type ReservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reservations.
     */
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyInput>
    /**
     * Filter which Reservations to update
     */
    where?: ReservationWhereInput
    /**
     * Limit how many Reservations to update.
     */
    limit?: number
  }

  /**
   * Reservation updateManyAndReturn
   */
  export type ReservationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * The data used to update Reservations.
     */
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyInput>
    /**
     * Filter which Reservations to update
     */
    where?: ReservationWhereInput
    /**
     * Limit how many Reservations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reservation upsert
   */
  export type ReservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * The filter to search for the Reservation to update in case it exists.
     */
    where: ReservationWhereUniqueInput
    /**
     * In case the Reservation found by the `where` argument doesn't exist, create a new Reservation with this data.
     */
    create: XOR<ReservationCreateInput, ReservationUncheckedCreateInput>
    /**
     * In case the Reservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReservationUpdateInput, ReservationUncheckedUpdateInput>
  }

  /**
   * Reservation delete
   */
  export type ReservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
    /**
     * Filter which Reservation to delete.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation deleteMany
   */
  export type ReservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservations to delete
     */
    where?: ReservationWhereInput
    /**
     * Limit how many Reservations to delete.
     */
    limit?: number
  }

  /**
   * Reservation without action
   */
  export type ReservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationInclude<ExtArgs> | null
  }


  /**
   * Model WaitlistEntry
   */

  export type AggregateWaitlistEntry = {
    _count: WaitlistEntryCountAggregateOutputType | null
    _avg: WaitlistEntryAvgAggregateOutputType | null
    _sum: WaitlistEntrySumAggregateOutputType | null
    _min: WaitlistEntryMinAggregateOutputType | null
    _max: WaitlistEntryMaxAggregateOutputType | null
  }

  export type WaitlistEntryAvgAggregateOutputType = {
    partySize: number | null
  }

  export type WaitlistEntrySumAggregateOutputType = {
    partySize: number | null
  }

  export type WaitlistEntryMinAggregateOutputType = {
    id: string | null
    desiredAt: Date | null
    partySize: number | null
    guestName: string | null
    guestPhone: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type WaitlistEntryMaxAggregateOutputType = {
    id: string | null
    desiredAt: Date | null
    partySize: number | null
    guestName: string | null
    guestPhone: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type WaitlistEntryCountAggregateOutputType = {
    id: number
    desiredAt: number
    partySize: number
    guestName: number
    guestPhone: number
    notes: number
    createdAt: number
    _all: number
  }


  export type WaitlistEntryAvgAggregateInputType = {
    partySize?: true
  }

  export type WaitlistEntrySumAggregateInputType = {
    partySize?: true
  }

  export type WaitlistEntryMinAggregateInputType = {
    id?: true
    desiredAt?: true
    partySize?: true
    guestName?: true
    guestPhone?: true
    notes?: true
    createdAt?: true
  }

  export type WaitlistEntryMaxAggregateInputType = {
    id?: true
    desiredAt?: true
    partySize?: true
    guestName?: true
    guestPhone?: true
    notes?: true
    createdAt?: true
  }

  export type WaitlistEntryCountAggregateInputType = {
    id?: true
    desiredAt?: true
    partySize?: true
    guestName?: true
    guestPhone?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type WaitlistEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WaitlistEntry to aggregate.
     */
    where?: WaitlistEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WaitlistEntries to fetch.
     */
    orderBy?: WaitlistEntryOrderByWithRelationInput | WaitlistEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WaitlistEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WaitlistEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WaitlistEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WaitlistEntries
    **/
    _count?: true | WaitlistEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WaitlistEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WaitlistEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WaitlistEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WaitlistEntryMaxAggregateInputType
  }

  export type GetWaitlistEntryAggregateType<T extends WaitlistEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateWaitlistEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWaitlistEntry[P]>
      : GetScalarType<T[P], AggregateWaitlistEntry[P]>
  }




  export type WaitlistEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WaitlistEntryWhereInput
    orderBy?: WaitlistEntryOrderByWithAggregationInput | WaitlistEntryOrderByWithAggregationInput[]
    by: WaitlistEntryScalarFieldEnum[] | WaitlistEntryScalarFieldEnum
    having?: WaitlistEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WaitlistEntryCountAggregateInputType | true
    _avg?: WaitlistEntryAvgAggregateInputType
    _sum?: WaitlistEntrySumAggregateInputType
    _min?: WaitlistEntryMinAggregateInputType
    _max?: WaitlistEntryMaxAggregateInputType
  }

  export type WaitlistEntryGroupByOutputType = {
    id: string
    desiredAt: Date
    partySize: number
    guestName: string
    guestPhone: string
    notes: string | null
    createdAt: Date
    _count: WaitlistEntryCountAggregateOutputType | null
    _avg: WaitlistEntryAvgAggregateOutputType | null
    _sum: WaitlistEntrySumAggregateOutputType | null
    _min: WaitlistEntryMinAggregateOutputType | null
    _max: WaitlistEntryMaxAggregateOutputType | null
  }

  type GetWaitlistEntryGroupByPayload<T extends WaitlistEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WaitlistEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WaitlistEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WaitlistEntryGroupByOutputType[P]>
            : GetScalarType<T[P], WaitlistEntryGroupByOutputType[P]>
        }
      >
    >


  export type WaitlistEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    desiredAt?: boolean
    partySize?: boolean
    guestName?: boolean
    guestPhone?: boolean
    notes?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["waitlistEntry"]>

  export type WaitlistEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    desiredAt?: boolean
    partySize?: boolean
    guestName?: boolean
    guestPhone?: boolean
    notes?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["waitlistEntry"]>

  export type WaitlistEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    desiredAt?: boolean
    partySize?: boolean
    guestName?: boolean
    guestPhone?: boolean
    notes?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["waitlistEntry"]>

  export type WaitlistEntrySelectScalar = {
    id?: boolean
    desiredAt?: boolean
    partySize?: boolean
    guestName?: boolean
    guestPhone?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type WaitlistEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "desiredAt" | "partySize" | "guestName" | "guestPhone" | "notes" | "createdAt", ExtArgs["result"]["waitlistEntry"]>

  export type $WaitlistEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WaitlistEntry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      desiredAt: Date
      partySize: number
      guestName: string
      guestPhone: string
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["waitlistEntry"]>
    composites: {}
  }

  type WaitlistEntryGetPayload<S extends boolean | null | undefined | WaitlistEntryDefaultArgs> = $Result.GetResult<Prisma.$WaitlistEntryPayload, S>

  type WaitlistEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WaitlistEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WaitlistEntryCountAggregateInputType | true
    }

  export interface WaitlistEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WaitlistEntry'], meta: { name: 'WaitlistEntry' } }
    /**
     * Find zero or one WaitlistEntry that matches the filter.
     * @param {WaitlistEntryFindUniqueArgs} args - Arguments to find a WaitlistEntry
     * @example
     * // Get one WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WaitlistEntryFindUniqueArgs>(args: SelectSubset<T, WaitlistEntryFindUniqueArgs<ExtArgs>>): Prisma__WaitlistEntryClient<$Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WaitlistEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WaitlistEntryFindUniqueOrThrowArgs} args - Arguments to find a WaitlistEntry
     * @example
     * // Get one WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WaitlistEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, WaitlistEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WaitlistEntryClient<$Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WaitlistEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryFindFirstArgs} args - Arguments to find a WaitlistEntry
     * @example
     * // Get one WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WaitlistEntryFindFirstArgs>(args?: SelectSubset<T, WaitlistEntryFindFirstArgs<ExtArgs>>): Prisma__WaitlistEntryClient<$Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WaitlistEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryFindFirstOrThrowArgs} args - Arguments to find a WaitlistEntry
     * @example
     * // Get one WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WaitlistEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, WaitlistEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__WaitlistEntryClient<$Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WaitlistEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WaitlistEntries
     * const waitlistEntries = await prisma.waitlistEntry.findMany()
     * 
     * // Get first 10 WaitlistEntries
     * const waitlistEntries = await prisma.waitlistEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const waitlistEntryWithIdOnly = await prisma.waitlistEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WaitlistEntryFindManyArgs>(args?: SelectSubset<T, WaitlistEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WaitlistEntry.
     * @param {WaitlistEntryCreateArgs} args - Arguments to create a WaitlistEntry.
     * @example
     * // Create one WaitlistEntry
     * const WaitlistEntry = await prisma.waitlistEntry.create({
     *   data: {
     *     // ... data to create a WaitlistEntry
     *   }
     * })
     * 
     */
    create<T extends WaitlistEntryCreateArgs>(args: SelectSubset<T, WaitlistEntryCreateArgs<ExtArgs>>): Prisma__WaitlistEntryClient<$Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WaitlistEntries.
     * @param {WaitlistEntryCreateManyArgs} args - Arguments to create many WaitlistEntries.
     * @example
     * // Create many WaitlistEntries
     * const waitlistEntry = await prisma.waitlistEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WaitlistEntryCreateManyArgs>(args?: SelectSubset<T, WaitlistEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WaitlistEntries and returns the data saved in the database.
     * @param {WaitlistEntryCreateManyAndReturnArgs} args - Arguments to create many WaitlistEntries.
     * @example
     * // Create many WaitlistEntries
     * const waitlistEntry = await prisma.waitlistEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WaitlistEntries and only return the `id`
     * const waitlistEntryWithIdOnly = await prisma.waitlistEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WaitlistEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, WaitlistEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WaitlistEntry.
     * @param {WaitlistEntryDeleteArgs} args - Arguments to delete one WaitlistEntry.
     * @example
     * // Delete one WaitlistEntry
     * const WaitlistEntry = await prisma.waitlistEntry.delete({
     *   where: {
     *     // ... filter to delete one WaitlistEntry
     *   }
     * })
     * 
     */
    delete<T extends WaitlistEntryDeleteArgs>(args: SelectSubset<T, WaitlistEntryDeleteArgs<ExtArgs>>): Prisma__WaitlistEntryClient<$Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WaitlistEntry.
     * @param {WaitlistEntryUpdateArgs} args - Arguments to update one WaitlistEntry.
     * @example
     * // Update one WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WaitlistEntryUpdateArgs>(args: SelectSubset<T, WaitlistEntryUpdateArgs<ExtArgs>>): Prisma__WaitlistEntryClient<$Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WaitlistEntries.
     * @param {WaitlistEntryDeleteManyArgs} args - Arguments to filter WaitlistEntries to delete.
     * @example
     * // Delete a few WaitlistEntries
     * const { count } = await prisma.waitlistEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WaitlistEntryDeleteManyArgs>(args?: SelectSubset<T, WaitlistEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WaitlistEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WaitlistEntries
     * const waitlistEntry = await prisma.waitlistEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WaitlistEntryUpdateManyArgs>(args: SelectSubset<T, WaitlistEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WaitlistEntries and returns the data updated in the database.
     * @param {WaitlistEntryUpdateManyAndReturnArgs} args - Arguments to update many WaitlistEntries.
     * @example
     * // Update many WaitlistEntries
     * const waitlistEntry = await prisma.waitlistEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WaitlistEntries and only return the `id`
     * const waitlistEntryWithIdOnly = await prisma.waitlistEntry.updateManyAndReturn({
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
    updateManyAndReturn<T extends WaitlistEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, WaitlistEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WaitlistEntry.
     * @param {WaitlistEntryUpsertArgs} args - Arguments to update or create a WaitlistEntry.
     * @example
     * // Update or create a WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.upsert({
     *   create: {
     *     // ... data to create a WaitlistEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WaitlistEntry we want to update
     *   }
     * })
     */
    upsert<T extends WaitlistEntryUpsertArgs>(args: SelectSubset<T, WaitlistEntryUpsertArgs<ExtArgs>>): Prisma__WaitlistEntryClient<$Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WaitlistEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryCountArgs} args - Arguments to filter WaitlistEntries to count.
     * @example
     * // Count the number of WaitlistEntries
     * const count = await prisma.waitlistEntry.count({
     *   where: {
     *     // ... the filter for the WaitlistEntries we want to count
     *   }
     * })
    **/
    count<T extends WaitlistEntryCountArgs>(
      args?: Subset<T, WaitlistEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WaitlistEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WaitlistEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WaitlistEntryAggregateArgs>(args: Subset<T, WaitlistEntryAggregateArgs>): Prisma.PrismaPromise<GetWaitlistEntryAggregateType<T>>

    /**
     * Group by WaitlistEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryGroupByArgs} args - Group by arguments.
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
      T extends WaitlistEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WaitlistEntryGroupByArgs['orderBy'] }
        : { orderBy?: WaitlistEntryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WaitlistEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWaitlistEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WaitlistEntry model
   */
  readonly fields: WaitlistEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WaitlistEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WaitlistEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the WaitlistEntry model
   */
  interface WaitlistEntryFieldRefs {
    readonly id: FieldRef<"WaitlistEntry", 'String'>
    readonly desiredAt: FieldRef<"WaitlistEntry", 'DateTime'>
    readonly partySize: FieldRef<"WaitlistEntry", 'Int'>
    readonly guestName: FieldRef<"WaitlistEntry", 'String'>
    readonly guestPhone: FieldRef<"WaitlistEntry", 'String'>
    readonly notes: FieldRef<"WaitlistEntry", 'String'>
    readonly createdAt: FieldRef<"WaitlistEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WaitlistEntry findUnique
   */
  export type WaitlistEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
    /**
     * Filter, which WaitlistEntry to fetch.
     */
    where: WaitlistEntryWhereUniqueInput
  }

  /**
   * WaitlistEntry findUniqueOrThrow
   */
  export type WaitlistEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
    /**
     * Filter, which WaitlistEntry to fetch.
     */
    where: WaitlistEntryWhereUniqueInput
  }

  /**
   * WaitlistEntry findFirst
   */
  export type WaitlistEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
    /**
     * Filter, which WaitlistEntry to fetch.
     */
    where?: WaitlistEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WaitlistEntries to fetch.
     */
    orderBy?: WaitlistEntryOrderByWithRelationInput | WaitlistEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WaitlistEntries.
     */
    cursor?: WaitlistEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WaitlistEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WaitlistEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WaitlistEntries.
     */
    distinct?: WaitlistEntryScalarFieldEnum | WaitlistEntryScalarFieldEnum[]
  }

  /**
   * WaitlistEntry findFirstOrThrow
   */
  export type WaitlistEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
    /**
     * Filter, which WaitlistEntry to fetch.
     */
    where?: WaitlistEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WaitlistEntries to fetch.
     */
    orderBy?: WaitlistEntryOrderByWithRelationInput | WaitlistEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WaitlistEntries.
     */
    cursor?: WaitlistEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WaitlistEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WaitlistEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WaitlistEntries.
     */
    distinct?: WaitlistEntryScalarFieldEnum | WaitlistEntryScalarFieldEnum[]
  }

  /**
   * WaitlistEntry findMany
   */
  export type WaitlistEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
    /**
     * Filter, which WaitlistEntries to fetch.
     */
    where?: WaitlistEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WaitlistEntries to fetch.
     */
    orderBy?: WaitlistEntryOrderByWithRelationInput | WaitlistEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WaitlistEntries.
     */
    cursor?: WaitlistEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WaitlistEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WaitlistEntries.
     */
    skip?: number
    distinct?: WaitlistEntryScalarFieldEnum | WaitlistEntryScalarFieldEnum[]
  }

  /**
   * WaitlistEntry create
   */
  export type WaitlistEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
    /**
     * The data needed to create a WaitlistEntry.
     */
    data: XOR<WaitlistEntryCreateInput, WaitlistEntryUncheckedCreateInput>
  }

  /**
   * WaitlistEntry createMany
   */
  export type WaitlistEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WaitlistEntries.
     */
    data: WaitlistEntryCreateManyInput | WaitlistEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WaitlistEntry createManyAndReturn
   */
  export type WaitlistEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
    /**
     * The data used to create many WaitlistEntries.
     */
    data: WaitlistEntryCreateManyInput | WaitlistEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WaitlistEntry update
   */
  export type WaitlistEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
    /**
     * The data needed to update a WaitlistEntry.
     */
    data: XOR<WaitlistEntryUpdateInput, WaitlistEntryUncheckedUpdateInput>
    /**
     * Choose, which WaitlistEntry to update.
     */
    where: WaitlistEntryWhereUniqueInput
  }

  /**
   * WaitlistEntry updateMany
   */
  export type WaitlistEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WaitlistEntries.
     */
    data: XOR<WaitlistEntryUpdateManyMutationInput, WaitlistEntryUncheckedUpdateManyInput>
    /**
     * Filter which WaitlistEntries to update
     */
    where?: WaitlistEntryWhereInput
    /**
     * Limit how many WaitlistEntries to update.
     */
    limit?: number
  }

  /**
   * WaitlistEntry updateManyAndReturn
   */
  export type WaitlistEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
    /**
     * The data used to update WaitlistEntries.
     */
    data: XOR<WaitlistEntryUpdateManyMutationInput, WaitlistEntryUncheckedUpdateManyInput>
    /**
     * Filter which WaitlistEntries to update
     */
    where?: WaitlistEntryWhereInput
    /**
     * Limit how many WaitlistEntries to update.
     */
    limit?: number
  }

  /**
   * WaitlistEntry upsert
   */
  export type WaitlistEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
    /**
     * The filter to search for the WaitlistEntry to update in case it exists.
     */
    where: WaitlistEntryWhereUniqueInput
    /**
     * In case the WaitlistEntry found by the `where` argument doesn't exist, create a new WaitlistEntry with this data.
     */
    create: XOR<WaitlistEntryCreateInput, WaitlistEntryUncheckedCreateInput>
    /**
     * In case the WaitlistEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WaitlistEntryUpdateInput, WaitlistEntryUncheckedUpdateInput>
  }

  /**
   * WaitlistEntry delete
   */
  export type WaitlistEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
    /**
     * Filter which WaitlistEntry to delete.
     */
    where: WaitlistEntryWhereUniqueInput
  }

  /**
   * WaitlistEntry deleteMany
   */
  export type WaitlistEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WaitlistEntries to delete
     */
    where?: WaitlistEntryWhereInput
    /**
     * Limit how many WaitlistEntries to delete.
     */
    limit?: number
  }

  /**
   * WaitlistEntry without action
   */
  export type WaitlistEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WaitlistEntry
     */
    omit?: WaitlistEntryOmit<ExtArgs> | null
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


  export const RestaurantTableScalarFieldEnum: {
    id: 'id',
    name: 'name',
    capacity: 'capacity',
    x: 'x',
    y: 'y',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RestaurantTableScalarFieldEnum = (typeof RestaurantTableScalarFieldEnum)[keyof typeof RestaurantTableScalarFieldEnum]


  export const ReservationScalarFieldEnum: {
    id: 'id',
    startAt: 'startAt',
    endAt: 'endAt',
    partySize: 'partySize',
    status: 'status',
    guestName: 'guestName',
    guestPhone: 'guestPhone',
    notes: 'notes',
    source: 'source',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    tableId: 'tableId',
    smsConfirmationSentAt: 'smsConfirmationSentAt',
    smsReminderSentAt: 'smsReminderSentAt'
  };

  export type ReservationScalarFieldEnum = (typeof ReservationScalarFieldEnum)[keyof typeof ReservationScalarFieldEnum]


  export const WaitlistEntryScalarFieldEnum: {
    id: 'id',
    desiredAt: 'desiredAt',
    partySize: 'partySize',
    guestName: 'guestName',
    guestPhone: 'guestPhone',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type WaitlistEntryScalarFieldEnum = (typeof WaitlistEntryScalarFieldEnum)[keyof typeof WaitlistEntryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'TableStatus'
   */
  export type EnumTableStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TableStatus'>
    


  /**
   * Reference to a field of type 'TableStatus[]'
   */
  export type ListEnumTableStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TableStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ReservationStatus'
   */
  export type EnumReservationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReservationStatus'>
    


  /**
   * Reference to a field of type 'ReservationStatus[]'
   */
  export type ListEnumReservationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReservationStatus[]'>
    


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


  export type RestaurantTableWhereInput = {
    AND?: RestaurantTableWhereInput | RestaurantTableWhereInput[]
    OR?: RestaurantTableWhereInput[]
    NOT?: RestaurantTableWhereInput | RestaurantTableWhereInput[]
    id?: StringFilter<"RestaurantTable"> | string
    name?: StringFilter<"RestaurantTable"> | string
    capacity?: IntFilter<"RestaurantTable"> | number
    x?: IntFilter<"RestaurantTable"> | number
    y?: IntFilter<"RestaurantTable"> | number
    status?: EnumTableStatusFilter<"RestaurantTable"> | $Enums.TableStatus
    createdAt?: DateTimeFilter<"RestaurantTable"> | Date | string
    updatedAt?: DateTimeFilter<"RestaurantTable"> | Date | string
    reservations?: ReservationListRelationFilter
  }

  export type RestaurantTableOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    capacity?: SortOrder
    x?: SortOrder
    y?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reservations?: ReservationOrderByRelationAggregateInput
  }

  export type RestaurantTableWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RestaurantTableWhereInput | RestaurantTableWhereInput[]
    OR?: RestaurantTableWhereInput[]
    NOT?: RestaurantTableWhereInput | RestaurantTableWhereInput[]
    name?: StringFilter<"RestaurantTable"> | string
    capacity?: IntFilter<"RestaurantTable"> | number
    x?: IntFilter<"RestaurantTable"> | number
    y?: IntFilter<"RestaurantTable"> | number
    status?: EnumTableStatusFilter<"RestaurantTable"> | $Enums.TableStatus
    createdAt?: DateTimeFilter<"RestaurantTable"> | Date | string
    updatedAt?: DateTimeFilter<"RestaurantTable"> | Date | string
    reservations?: ReservationListRelationFilter
  }, "id">

  export type RestaurantTableOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    capacity?: SortOrder
    x?: SortOrder
    y?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RestaurantTableCountOrderByAggregateInput
    _avg?: RestaurantTableAvgOrderByAggregateInput
    _max?: RestaurantTableMaxOrderByAggregateInput
    _min?: RestaurantTableMinOrderByAggregateInput
    _sum?: RestaurantTableSumOrderByAggregateInput
  }

  export type RestaurantTableScalarWhereWithAggregatesInput = {
    AND?: RestaurantTableScalarWhereWithAggregatesInput | RestaurantTableScalarWhereWithAggregatesInput[]
    OR?: RestaurantTableScalarWhereWithAggregatesInput[]
    NOT?: RestaurantTableScalarWhereWithAggregatesInput | RestaurantTableScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RestaurantTable"> | string
    name?: StringWithAggregatesFilter<"RestaurantTable"> | string
    capacity?: IntWithAggregatesFilter<"RestaurantTable"> | number
    x?: IntWithAggregatesFilter<"RestaurantTable"> | number
    y?: IntWithAggregatesFilter<"RestaurantTable"> | number
    status?: EnumTableStatusWithAggregatesFilter<"RestaurantTable"> | $Enums.TableStatus
    createdAt?: DateTimeWithAggregatesFilter<"RestaurantTable"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RestaurantTable"> | Date | string
  }

  export type ReservationWhereInput = {
    AND?: ReservationWhereInput | ReservationWhereInput[]
    OR?: ReservationWhereInput[]
    NOT?: ReservationWhereInput | ReservationWhereInput[]
    id?: StringFilter<"Reservation"> | string
    startAt?: DateTimeFilter<"Reservation"> | Date | string
    endAt?: DateTimeFilter<"Reservation"> | Date | string
    partySize?: IntFilter<"Reservation"> | number
    status?: EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus
    guestName?: StringFilter<"Reservation"> | string
    guestPhone?: StringFilter<"Reservation"> | string
    notes?: StringNullableFilter<"Reservation"> | string | null
    source?: StringFilter<"Reservation"> | string
    createdAt?: DateTimeFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeFilter<"Reservation"> | Date | string
    tableId?: StringFilter<"Reservation"> | string
    smsConfirmationSentAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    smsReminderSentAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    table?: XOR<RestaurantTableScalarRelationFilter, RestaurantTableWhereInput>
  }

  export type ReservationOrderByWithRelationInput = {
    id?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    partySize?: SortOrder
    status?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    notes?: SortOrderInput | SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tableId?: SortOrder
    smsConfirmationSentAt?: SortOrderInput | SortOrder
    smsReminderSentAt?: SortOrderInput | SortOrder
    table?: RestaurantTableOrderByWithRelationInput
  }

  export type ReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReservationWhereInput | ReservationWhereInput[]
    OR?: ReservationWhereInput[]
    NOT?: ReservationWhereInput | ReservationWhereInput[]
    startAt?: DateTimeFilter<"Reservation"> | Date | string
    endAt?: DateTimeFilter<"Reservation"> | Date | string
    partySize?: IntFilter<"Reservation"> | number
    status?: EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus
    guestName?: StringFilter<"Reservation"> | string
    guestPhone?: StringFilter<"Reservation"> | string
    notes?: StringNullableFilter<"Reservation"> | string | null
    source?: StringFilter<"Reservation"> | string
    createdAt?: DateTimeFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeFilter<"Reservation"> | Date | string
    tableId?: StringFilter<"Reservation"> | string
    smsConfirmationSentAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    smsReminderSentAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    table?: XOR<RestaurantTableScalarRelationFilter, RestaurantTableWhereInput>
  }, "id">

  export type ReservationOrderByWithAggregationInput = {
    id?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    partySize?: SortOrder
    status?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    notes?: SortOrderInput | SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tableId?: SortOrder
    smsConfirmationSentAt?: SortOrderInput | SortOrder
    smsReminderSentAt?: SortOrderInput | SortOrder
    _count?: ReservationCountOrderByAggregateInput
    _avg?: ReservationAvgOrderByAggregateInput
    _max?: ReservationMaxOrderByAggregateInput
    _min?: ReservationMinOrderByAggregateInput
    _sum?: ReservationSumOrderByAggregateInput
  }

  export type ReservationScalarWhereWithAggregatesInput = {
    AND?: ReservationScalarWhereWithAggregatesInput | ReservationScalarWhereWithAggregatesInput[]
    OR?: ReservationScalarWhereWithAggregatesInput[]
    NOT?: ReservationScalarWhereWithAggregatesInput | ReservationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reservation"> | string
    startAt?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
    endAt?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
    partySize?: IntWithAggregatesFilter<"Reservation"> | number
    status?: EnumReservationStatusWithAggregatesFilter<"Reservation"> | $Enums.ReservationStatus
    guestName?: StringWithAggregatesFilter<"Reservation"> | string
    guestPhone?: StringWithAggregatesFilter<"Reservation"> | string
    notes?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    source?: StringWithAggregatesFilter<"Reservation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
    tableId?: StringWithAggregatesFilter<"Reservation"> | string
    smsConfirmationSentAt?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    smsReminderSentAt?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
  }

  export type WaitlistEntryWhereInput = {
    AND?: WaitlistEntryWhereInput | WaitlistEntryWhereInput[]
    OR?: WaitlistEntryWhereInput[]
    NOT?: WaitlistEntryWhereInput | WaitlistEntryWhereInput[]
    id?: StringFilter<"WaitlistEntry"> | string
    desiredAt?: DateTimeFilter<"WaitlistEntry"> | Date | string
    partySize?: IntFilter<"WaitlistEntry"> | number
    guestName?: StringFilter<"WaitlistEntry"> | string
    guestPhone?: StringFilter<"WaitlistEntry"> | string
    notes?: StringNullableFilter<"WaitlistEntry"> | string | null
    createdAt?: DateTimeFilter<"WaitlistEntry"> | Date | string
  }

  export type WaitlistEntryOrderByWithRelationInput = {
    id?: SortOrder
    desiredAt?: SortOrder
    partySize?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type WaitlistEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WaitlistEntryWhereInput | WaitlistEntryWhereInput[]
    OR?: WaitlistEntryWhereInput[]
    NOT?: WaitlistEntryWhereInput | WaitlistEntryWhereInput[]
    desiredAt?: DateTimeFilter<"WaitlistEntry"> | Date | string
    partySize?: IntFilter<"WaitlistEntry"> | number
    guestName?: StringFilter<"WaitlistEntry"> | string
    guestPhone?: StringFilter<"WaitlistEntry"> | string
    notes?: StringNullableFilter<"WaitlistEntry"> | string | null
    createdAt?: DateTimeFilter<"WaitlistEntry"> | Date | string
  }, "id">

  export type WaitlistEntryOrderByWithAggregationInput = {
    id?: SortOrder
    desiredAt?: SortOrder
    partySize?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: WaitlistEntryCountOrderByAggregateInput
    _avg?: WaitlistEntryAvgOrderByAggregateInput
    _max?: WaitlistEntryMaxOrderByAggregateInput
    _min?: WaitlistEntryMinOrderByAggregateInput
    _sum?: WaitlistEntrySumOrderByAggregateInput
  }

  export type WaitlistEntryScalarWhereWithAggregatesInput = {
    AND?: WaitlistEntryScalarWhereWithAggregatesInput | WaitlistEntryScalarWhereWithAggregatesInput[]
    OR?: WaitlistEntryScalarWhereWithAggregatesInput[]
    NOT?: WaitlistEntryScalarWhereWithAggregatesInput | WaitlistEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WaitlistEntry"> | string
    desiredAt?: DateTimeWithAggregatesFilter<"WaitlistEntry"> | Date | string
    partySize?: IntWithAggregatesFilter<"WaitlistEntry"> | number
    guestName?: StringWithAggregatesFilter<"WaitlistEntry"> | string
    guestPhone?: StringWithAggregatesFilter<"WaitlistEntry"> | string
    notes?: StringNullableWithAggregatesFilter<"WaitlistEntry"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WaitlistEntry"> | Date | string
  }

  export type RestaurantTableCreateInput = {
    id?: string
    name: string
    capacity: number
    x?: number
    y?: number
    status?: $Enums.TableStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    reservations?: ReservationCreateNestedManyWithoutTableInput
  }

  export type RestaurantTableUncheckedCreateInput = {
    id?: string
    name: string
    capacity: number
    x?: number
    y?: number
    status?: $Enums.TableStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    reservations?: ReservationUncheckedCreateNestedManyWithoutTableInput
  }

  export type RestaurantTableUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    status?: EnumTableStatusFieldUpdateOperationsInput | $Enums.TableStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUpdateManyWithoutTableNestedInput
  }

  export type RestaurantTableUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    status?: EnumTableStatusFieldUpdateOperationsInput | $Enums.TableStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservations?: ReservationUncheckedUpdateManyWithoutTableNestedInput
  }

  export type RestaurantTableCreateManyInput = {
    id?: string
    name: string
    capacity: number
    x?: number
    y?: number
    status?: $Enums.TableStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RestaurantTableUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    status?: EnumTableStatusFieldUpdateOperationsInput | $Enums.TableStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RestaurantTableUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    status?: EnumTableStatusFieldUpdateOperationsInput | $Enums.TableStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationCreateInput = {
    id?: string
    startAt: Date | string
    endAt: Date | string
    partySize: number
    status?: $Enums.ReservationStatus
    guestName: string
    guestPhone: string
    notes?: string | null
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    smsConfirmationSentAt?: Date | string | null
    smsReminderSentAt?: Date | string | null
    table: RestaurantTableCreateNestedOneWithoutReservationsInput
  }

  export type ReservationUncheckedCreateInput = {
    id?: string
    startAt: Date | string
    endAt: Date | string
    partySize: number
    status?: $Enums.ReservationStatus
    guestName: string
    guestPhone: string
    notes?: string | null
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tableId: string
    smsConfirmationSentAt?: Date | string | null
    smsReminderSentAt?: Date | string | null
  }

  export type ReservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partySize?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    guestName?: StringFieldUpdateOperationsInput | string
    guestPhone?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    smsConfirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smsReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    table?: RestaurantTableUpdateOneRequiredWithoutReservationsNestedInput
  }

  export type ReservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partySize?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    guestName?: StringFieldUpdateOperationsInput | string
    guestPhone?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tableId?: StringFieldUpdateOperationsInput | string
    smsConfirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smsReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ReservationCreateManyInput = {
    id?: string
    startAt: Date | string
    endAt: Date | string
    partySize: number
    status?: $Enums.ReservationStatus
    guestName: string
    guestPhone: string
    notes?: string | null
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tableId: string
    smsConfirmationSentAt?: Date | string | null
    smsReminderSentAt?: Date | string | null
  }

  export type ReservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partySize?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    guestName?: StringFieldUpdateOperationsInput | string
    guestPhone?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    smsConfirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smsReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ReservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partySize?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    guestName?: StringFieldUpdateOperationsInput | string
    guestPhone?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tableId?: StringFieldUpdateOperationsInput | string
    smsConfirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smsReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WaitlistEntryCreateInput = {
    id?: string
    desiredAt: Date | string
    partySize: number
    guestName: string
    guestPhone: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type WaitlistEntryUncheckedCreateInput = {
    id?: string
    desiredAt: Date | string
    partySize: number
    guestName: string
    guestPhone: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type WaitlistEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    desiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partySize?: IntFieldUpdateOperationsInput | number
    guestName?: StringFieldUpdateOperationsInput | string
    guestPhone?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WaitlistEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    desiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partySize?: IntFieldUpdateOperationsInput | number
    guestName?: StringFieldUpdateOperationsInput | string
    guestPhone?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WaitlistEntryCreateManyInput = {
    id?: string
    desiredAt: Date | string
    partySize: number
    guestName: string
    guestPhone: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type WaitlistEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    desiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partySize?: IntFieldUpdateOperationsInput | number
    guestName?: StringFieldUpdateOperationsInput | string
    guestPhone?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WaitlistEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    desiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partySize?: IntFieldUpdateOperationsInput | number
    guestName?: StringFieldUpdateOperationsInput | string
    guestPhone?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type EnumTableStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TableStatus | EnumTableStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TableStatus[] | ListEnumTableStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TableStatus[] | ListEnumTableStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTableStatusFilter<$PrismaModel> | $Enums.TableStatus
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

  export type ReservationListRelationFilter = {
    every?: ReservationWhereInput
    some?: ReservationWhereInput
    none?: ReservationWhereInput
  }

  export type ReservationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RestaurantTableCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    capacity?: SortOrder
    x?: SortOrder
    y?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RestaurantTableAvgOrderByAggregateInput = {
    capacity?: SortOrder
    x?: SortOrder
    y?: SortOrder
  }

  export type RestaurantTableMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    capacity?: SortOrder
    x?: SortOrder
    y?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RestaurantTableMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    capacity?: SortOrder
    x?: SortOrder
    y?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RestaurantTableSumOrderByAggregateInput = {
    capacity?: SortOrder
    x?: SortOrder
    y?: SortOrder
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

  export type EnumTableStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TableStatus | EnumTableStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TableStatus[] | ListEnumTableStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TableStatus[] | ListEnumTableStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTableStatusWithAggregatesFilter<$PrismaModel> | $Enums.TableStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTableStatusFilter<$PrismaModel>
    _max?: NestedEnumTableStatusFilter<$PrismaModel>
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

  export type EnumReservationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusFilter<$PrismaModel> | $Enums.ReservationStatus
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

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type RestaurantTableScalarRelationFilter = {
    is?: RestaurantTableWhereInput
    isNot?: RestaurantTableWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ReservationCountOrderByAggregateInput = {
    id?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    partySize?: SortOrder
    status?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    notes?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tableId?: SortOrder
    smsConfirmationSentAt?: SortOrder
    smsReminderSentAt?: SortOrder
  }

  export type ReservationAvgOrderByAggregateInput = {
    partySize?: SortOrder
  }

  export type ReservationMaxOrderByAggregateInput = {
    id?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    partySize?: SortOrder
    status?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    notes?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tableId?: SortOrder
    smsConfirmationSentAt?: SortOrder
    smsReminderSentAt?: SortOrder
  }

  export type ReservationMinOrderByAggregateInput = {
    id?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    partySize?: SortOrder
    status?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    notes?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tableId?: SortOrder
    smsConfirmationSentAt?: SortOrder
    smsReminderSentAt?: SortOrder
  }

  export type ReservationSumOrderByAggregateInput = {
    partySize?: SortOrder
  }

  export type EnumReservationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReservationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReservationStatusFilter<$PrismaModel>
    _max?: NestedEnumReservationStatusFilter<$PrismaModel>
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

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type WaitlistEntryCountOrderByAggregateInput = {
    id?: SortOrder
    desiredAt?: SortOrder
    partySize?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type WaitlistEntryAvgOrderByAggregateInput = {
    partySize?: SortOrder
  }

  export type WaitlistEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    desiredAt?: SortOrder
    partySize?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type WaitlistEntryMinOrderByAggregateInput = {
    id?: SortOrder
    desiredAt?: SortOrder
    partySize?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type WaitlistEntrySumOrderByAggregateInput = {
    partySize?: SortOrder
  }

  export type ReservationCreateNestedManyWithoutTableInput = {
    create?: XOR<ReservationCreateWithoutTableInput, ReservationUncheckedCreateWithoutTableInput> | ReservationCreateWithoutTableInput[] | ReservationUncheckedCreateWithoutTableInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutTableInput | ReservationCreateOrConnectWithoutTableInput[]
    createMany?: ReservationCreateManyTableInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type ReservationUncheckedCreateNestedManyWithoutTableInput = {
    create?: XOR<ReservationCreateWithoutTableInput, ReservationUncheckedCreateWithoutTableInput> | ReservationCreateWithoutTableInput[] | ReservationUncheckedCreateWithoutTableInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutTableInput | ReservationCreateOrConnectWithoutTableInput[]
    createMany?: ReservationCreateManyTableInputEnvelope
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumTableStatusFieldUpdateOperationsInput = {
    set?: $Enums.TableStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ReservationUpdateManyWithoutTableNestedInput = {
    create?: XOR<ReservationCreateWithoutTableInput, ReservationUncheckedCreateWithoutTableInput> | ReservationCreateWithoutTableInput[] | ReservationUncheckedCreateWithoutTableInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutTableInput | ReservationCreateOrConnectWithoutTableInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutTableInput | ReservationUpsertWithWhereUniqueWithoutTableInput[]
    createMany?: ReservationCreateManyTableInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutTableInput | ReservationUpdateWithWhereUniqueWithoutTableInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutTableInput | ReservationUpdateManyWithWhereWithoutTableInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type ReservationUncheckedUpdateManyWithoutTableNestedInput = {
    create?: XOR<ReservationCreateWithoutTableInput, ReservationUncheckedCreateWithoutTableInput> | ReservationCreateWithoutTableInput[] | ReservationUncheckedCreateWithoutTableInput[]
    connectOrCreate?: ReservationCreateOrConnectWithoutTableInput | ReservationCreateOrConnectWithoutTableInput[]
    upsert?: ReservationUpsertWithWhereUniqueWithoutTableInput | ReservationUpsertWithWhereUniqueWithoutTableInput[]
    createMany?: ReservationCreateManyTableInputEnvelope
    set?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    disconnect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    delete?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    connect?: ReservationWhereUniqueInput | ReservationWhereUniqueInput[]
    update?: ReservationUpdateWithWhereUniqueWithoutTableInput | ReservationUpdateWithWhereUniqueWithoutTableInput[]
    updateMany?: ReservationUpdateManyWithWhereWithoutTableInput | ReservationUpdateManyWithWhereWithoutTableInput[]
    deleteMany?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
  }

  export type RestaurantTableCreateNestedOneWithoutReservationsInput = {
    create?: XOR<RestaurantTableCreateWithoutReservationsInput, RestaurantTableUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: RestaurantTableCreateOrConnectWithoutReservationsInput
    connect?: RestaurantTableWhereUniqueInput
  }

  export type EnumReservationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReservationStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type RestaurantTableUpdateOneRequiredWithoutReservationsNestedInput = {
    create?: XOR<RestaurantTableCreateWithoutReservationsInput, RestaurantTableUncheckedCreateWithoutReservationsInput>
    connectOrCreate?: RestaurantTableCreateOrConnectWithoutReservationsInput
    upsert?: RestaurantTableUpsertWithoutReservationsInput
    connect?: RestaurantTableWhereUniqueInput
    update?: XOR<XOR<RestaurantTableUpdateToOneWithWhereWithoutReservationsInput, RestaurantTableUpdateWithoutReservationsInput>, RestaurantTableUncheckedUpdateWithoutReservationsInput>
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

  export type NestedEnumTableStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TableStatus | EnumTableStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TableStatus[] | ListEnumTableStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TableStatus[] | ListEnumTableStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTableStatusFilter<$PrismaModel> | $Enums.TableStatus
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

  export type NestedEnumTableStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TableStatus | EnumTableStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TableStatus[] | ListEnumTableStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TableStatus[] | ListEnumTableStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTableStatusWithAggregatesFilter<$PrismaModel> | $Enums.TableStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTableStatusFilter<$PrismaModel>
    _max?: NestedEnumTableStatusFilter<$PrismaModel>
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

  export type NestedEnumReservationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusFilter<$PrismaModel> | $Enums.ReservationStatus
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

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReservationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReservationStatusFilter<$PrismaModel>
    _max?: NestedEnumReservationStatusFilter<$PrismaModel>
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

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ReservationCreateWithoutTableInput = {
    id?: string
    startAt: Date | string
    endAt: Date | string
    partySize: number
    status?: $Enums.ReservationStatus
    guestName: string
    guestPhone: string
    notes?: string | null
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    smsConfirmationSentAt?: Date | string | null
    smsReminderSentAt?: Date | string | null
  }

  export type ReservationUncheckedCreateWithoutTableInput = {
    id?: string
    startAt: Date | string
    endAt: Date | string
    partySize: number
    status?: $Enums.ReservationStatus
    guestName: string
    guestPhone: string
    notes?: string | null
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    smsConfirmationSentAt?: Date | string | null
    smsReminderSentAt?: Date | string | null
  }

  export type ReservationCreateOrConnectWithoutTableInput = {
    where: ReservationWhereUniqueInput
    create: XOR<ReservationCreateWithoutTableInput, ReservationUncheckedCreateWithoutTableInput>
  }

  export type ReservationCreateManyTableInputEnvelope = {
    data: ReservationCreateManyTableInput | ReservationCreateManyTableInput[]
    skipDuplicates?: boolean
  }

  export type ReservationUpsertWithWhereUniqueWithoutTableInput = {
    where: ReservationWhereUniqueInput
    update: XOR<ReservationUpdateWithoutTableInput, ReservationUncheckedUpdateWithoutTableInput>
    create: XOR<ReservationCreateWithoutTableInput, ReservationUncheckedCreateWithoutTableInput>
  }

  export type ReservationUpdateWithWhereUniqueWithoutTableInput = {
    where: ReservationWhereUniqueInput
    data: XOR<ReservationUpdateWithoutTableInput, ReservationUncheckedUpdateWithoutTableInput>
  }

  export type ReservationUpdateManyWithWhereWithoutTableInput = {
    where: ReservationScalarWhereInput
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyWithoutTableInput>
  }

  export type ReservationScalarWhereInput = {
    AND?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
    OR?: ReservationScalarWhereInput[]
    NOT?: ReservationScalarWhereInput | ReservationScalarWhereInput[]
    id?: StringFilter<"Reservation"> | string
    startAt?: DateTimeFilter<"Reservation"> | Date | string
    endAt?: DateTimeFilter<"Reservation"> | Date | string
    partySize?: IntFilter<"Reservation"> | number
    status?: EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus
    guestName?: StringFilter<"Reservation"> | string
    guestPhone?: StringFilter<"Reservation"> | string
    notes?: StringNullableFilter<"Reservation"> | string | null
    source?: StringFilter<"Reservation"> | string
    createdAt?: DateTimeFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeFilter<"Reservation"> | Date | string
    tableId?: StringFilter<"Reservation"> | string
    smsConfirmationSentAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    smsReminderSentAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
  }

  export type RestaurantTableCreateWithoutReservationsInput = {
    id?: string
    name: string
    capacity: number
    x?: number
    y?: number
    status?: $Enums.TableStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RestaurantTableUncheckedCreateWithoutReservationsInput = {
    id?: string
    name: string
    capacity: number
    x?: number
    y?: number
    status?: $Enums.TableStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RestaurantTableCreateOrConnectWithoutReservationsInput = {
    where: RestaurantTableWhereUniqueInput
    create: XOR<RestaurantTableCreateWithoutReservationsInput, RestaurantTableUncheckedCreateWithoutReservationsInput>
  }

  export type RestaurantTableUpsertWithoutReservationsInput = {
    update: XOR<RestaurantTableUpdateWithoutReservationsInput, RestaurantTableUncheckedUpdateWithoutReservationsInput>
    create: XOR<RestaurantTableCreateWithoutReservationsInput, RestaurantTableUncheckedCreateWithoutReservationsInput>
    where?: RestaurantTableWhereInput
  }

  export type RestaurantTableUpdateToOneWithWhereWithoutReservationsInput = {
    where?: RestaurantTableWhereInput
    data: XOR<RestaurantTableUpdateWithoutReservationsInput, RestaurantTableUncheckedUpdateWithoutReservationsInput>
  }

  export type RestaurantTableUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    status?: EnumTableStatusFieldUpdateOperationsInput | $Enums.TableStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RestaurantTableUncheckedUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    x?: IntFieldUpdateOperationsInput | number
    y?: IntFieldUpdateOperationsInput | number
    status?: EnumTableStatusFieldUpdateOperationsInput | $Enums.TableStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationCreateManyTableInput = {
    id?: string
    startAt: Date | string
    endAt: Date | string
    partySize: number
    status?: $Enums.ReservationStatus
    guestName: string
    guestPhone: string
    notes?: string | null
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    smsConfirmationSentAt?: Date | string | null
    smsReminderSentAt?: Date | string | null
  }

  export type ReservationUpdateWithoutTableInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partySize?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    guestName?: StringFieldUpdateOperationsInput | string
    guestPhone?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    smsConfirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smsReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ReservationUncheckedUpdateWithoutTableInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partySize?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    guestName?: StringFieldUpdateOperationsInput | string
    guestPhone?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    smsConfirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smsReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ReservationUncheckedUpdateManyWithoutTableInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partySize?: IntFieldUpdateOperationsInput | number
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    guestName?: StringFieldUpdateOperationsInput | string
    guestPhone?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    smsConfirmationSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smsReminderSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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