# Client Options

## Client Args

Client arguments for `log` and `cache` configuration:

```ts
export interface ClientArgs {
  logOptions?: LoggerOptions;
  cacheOptions?: IAxiosCacheAdapterOptions;
}
```

### logOptions

```ts
interface LoggerOptions {
  /**
   * Avoid error causes by circular references in the object tree. Default: `true`.
   */
  safe?: boolean;
  /**
   * The name of the logger. Default: `undefined`.
   */
  name?: string;
  /**
   * an object containing functions for custom serialization of objects.
   * These functions should return an JSONifiable object and they should never throw. When logging an object,
   * each top-level property matching the exact key of a serializer will be serialized using the defined serializer.
   */
  serializers?: { [key: string]: SerializerFn };
  /**
   * Enables or disables the inclusion of a timestamp in the log message. If a function is supplied, it must
   * synchronously return a JSON string representation of the time. If set to `false`, no timestamp will be included in the output.
   * See stdTimeFunctions for a set of available functions for passing in as a value for this option.
   * Caution: any sort of formatted time will significantly slow down Pino's performance.
   */
  timestamp?: TimeFn | boolean;
  /**
   * One of the supported levels or `silent` to disable logging. Any other value defines a custom level and
   * requires supplying a level value via `levelVal`. Default: 'info'.
   */
  level?: LevelWithSilent | string;
  /**
   * Outputs the level as a string instead of integer. Default: `false`.
   */
  useLevelLabels?: boolean;
  /**
   * Changes the property `level` to any string value you pass in. Default: 'level'
   */
  levelKey?: string;
  /**
   * (DEPRECATED, use `levelKey`) Changes the property `level` to any string value you pass in. Default: 'level'
   */
  changeLevelName?: string;
  /**
   * Use this option to define additional logging levels.
   * The keys of the object correspond the namespace of the log level, and the values should be the numerical value of the level.
   */
  customLevels?: { [key: string]: number };
  /**
   * Use this option to only use defined `customLevels` and omit Pino's levels.
   * Logger's default `level` must be changed to a value in `customLevels` in order to use `useOnlyCustomLevels`
   * Warning: this option may not be supported by downstream transports.
   */
  useOnlyCustomLevels?: boolean;
  /**
   * If provided, the `mixin` function is called each time one of the active logging methods
   * is called. The function must synchronously return an object. The properties of the
   * returned object will be added to the logged JSON.
   */
  mixin?: MixinFn;
  /**
   * As an array, the redact option specifies paths that should have their values redacted from any log output.
   *
   * Each path must be a string using a syntax which corresponds to JavaScript dot and bracket notation.
   *
   * If an object is supplied, three options can be specified:
   *
   *      paths (String[]): Required. An array of paths
   *      censor (String): Optional. A value to overwrite key which are to be redacted. Default: '[Redacted]'
   *      remove (Boolean): Optional. Instead of censoring the value, remove both the key and the value. Default: false
   */
  redact?: string[] | redactOptions;
  /**
   * When defining a custom log level via level, set to an integer value to define the new level. Default: `undefined`.
   */
  levelVal?: number;
  /**
   * The string key for the 'message' in the JSON object. Default: "msg".
   */
  messageKey?: string;
  /**
   * The string key to place any logged object under.
   */
  nestedKey?: string;
  /**
   * Enables pino.pretty. This is intended for non-production configurations. This may be set to a configuration
   * object as outlined in http://getpino.io/#/docs/API?id=pretty. Default: `false`.
   */
  prettyPrint?: boolean | PrettyOptions;
  /**
   * Allows to optionally define which prettifier module to use.
   */
  // TODO: use type definitions from 'pino-pretty' when available.
  prettifier?: any;
  /**
   * This function will be invoked during process shutdown when `extreme` is set to `true`. If you do not specify
   * a function, Pino will invoke `process.exit(0)` when no error has occurred, and `process.exit(1)` otherwise.
   * If you do specify a function, it is up to you to terminate the process; you must perform only synchronous
   * operations at this point. See http://getpino.io/#/docs/extreme for more detail.
   */
  onTerminated?(eventName: string, err: any): void;
  /**
   * Enables logging. Default: `true`.
   */
  enabled?: boolean;
  /**
   * Browser only, see http://getpino.io/#/docs/browser.
   */
  browser?: {
    /**
     * The `asObject` option will create a pino-like log object instead of passing all arguments to a console
     * method. When `write` is set, `asObject` will always be true.
     *
     * @example
     * pino.info('hi') // creates and logs {msg: 'hi', level: 30, time: <ts>}
     */
    asObject?: boolean;
    /**
     * Instead of passing log messages to `console.log` they can be passed to a supplied function. If `write` is
     * set to a single function, all logging objects are passed to this function. If `write` is an object, it
     * can have methods that correspond to the levels. When a message is logged at a given level, the
     * corresponding method is called. If a method isn't present, the logging falls back to using the `console`.
     *
     * @example
     * const pino = require('pino')({
     *   browser: {
     *     write: (o) => {
     *       // do something with o
     *     }
     *   }
     * })
     *
     * @example
     * const pino = require('pino')({
     *   browser: {
     *     write: {
     *       info: function (o) {
     *         //process info log object
     *       },
     *       error: function (o) {
     *         //process error log object
     *       }
     *     }
     *   }
     * })
     */
    write?:
      | WriteFn
      | ({
          fatal?: WriteFn;
          error?: WriteFn;
          warn?: WriteFn;
          info?: WriteFn;
          debug?: WriteFn;
          trace?: WriteFn;
        } & { [logLevel: string]: WriteFn });
    /**
     * The serializers provided to `pino` are ignored by default in the browser, including the standard
     * serializers provided with Pino. Since the default destination for log messages is the console, values
     * such as `Error` objects are enhanced for inspection, which they otherwise wouldn't be if the Error
     * serializer was enabled. We can turn all serializers on or we can selectively enable them via an array.
     *
     * When `serialize` is `true` the standard error serializer is also enabled (see
     * {@link https://github.com/pinojs/pino/blob/master/docs/api.md#pino-stdserializers}). This is a global
     * serializer which will apply to any `Error` objects passed to the logger methods.
     *
     * If `serialize` is an array the standard error serializer is also automatically enabled, it can be
     * explicitly disabled by including a string in the serialize array: `!stdSerializers.err` (see example).
     *
     * The `serialize` array also applies to any child logger serializers (see
     * {@link https://github.com/pinojs/pino/blob/master/docs/api.md#bindingsserializers-object} for how to
     * set child-bound serializers).
     *
     * Unlike server pino the serializers apply to every object passed to the logger method, if the `asObject`
     * option is `true`, this results in the serializers applying to the first object (as in server pino).
     *
     * For more info on serializers see
     * {@link https://github.com/pinojs/pino/blob/master/docs/api.md#serializers-object}.
     *
     * @example
     * const pino = require('pino')({
     *   browser: {
     *     serialize: true
     *   }
     * })
     *
     * @example
     * const pino = require('pino')({
     *   serializers: {
     *     custom: myCustomSerializer,
     *     another: anotherSerializer
     *   },
     *   browser: {
     *     serialize: ['custom']
     *   }
     * })
     * // following will apply myCustomSerializer to the custom property,
     * // but will not apply anotherSerializer to another key
     * pino.info({custom: 'a', another: 'b'})
     *
     * @example
     * const pino = require('pino')({
     *   serializers: {
     *     custom: myCustomSerializer,
     *     another: anotherSerializer
     *   },
     *   browser: {
     *     serialize: ['!stdSerializers.err', 'custom'] //will not serialize Errors, will serialize `custom` keys
     *   }
     * })
     */
    serialize?: boolean | string[];
    /**
     * Options for transmission of logs.
     *
     * @example
     * const pino = require('pino')({
     *   browser: {
     *     transmit: {
     *       level: 'warn',
     *       send: function (level, logEvent) {
     *         if (level === 'warn') {
     *           // maybe send the logEvent to a separate endpoint
     *           // or maybe analyse the messages further before sending
     *         }
     *         // we could also use the `logEvent.level.value` property to determine
     *         // numerical value
     *         if (logEvent.level.value >= 50) { // covers error and fatal
     *
     *           // send the logEvent somewhere
     *         }
     *       }
     *     }
     *   }
     * })
     */
    transmit?: {
      /**
       * Specifies the minimum level (inclusive) of when the `send` function should be called, if not supplied
       * the `send` function will be called based on the main logging `level` (set via `options.level`,
       * defaulting to `info`).
       */
      level?: Level | string;
      /**
       * Remotely record log messages.
       *
       * @description Called after writing the log message.
       */
      send: (level: Level, logEvent: LogEvent) => void;
    };
  };
  /**
   * key-value object added as child logger to each log line. If set to null the base child logger is not added
   */
  base?: { [key: string]: any } | null;
  /**
   * An object containing functions for formatting the shape of the log lines.
   * These functions should return a JSONifiable object and should never throw.
   * These functions allow for full customization of the resulting log lines.
   * For example, they can be used to change the level key name or to enrich the default metadata.
   */
  formatters?: {
    /**
     * Changes the shape of the log level.
     * The default shape is { level: number }.
     * The function takes two arguments, the label of the level (e.g. 'info') and the numeric value (e.g. 30).
     */
    level?: (label: string, number: number) => object;
    /**
     * Changes the shape of the bindings.
     * The default shape is { pid, hostname }.
     * The function takes a single argument, the bindings object.
     * It will be called every time a child logger is created.
     */
    bindings?: (bindings: Bindings) => object;
    /**
     * Changes the shape of the log object.
     * This function will be called every time one of the log methods (such as .info) is called.
     * All arguments passed to the log method, except the message, will be pass to this function.
     * By default it does not change the shape of the log object.
     */
    log?: (object: object) => object;
  };
  /**
   * An object mapping to hook functions. Hook functions allow for customizing internal logger operations.
   * Hook functions must be synchronous functions.
   */
  hooks?: {
    /**
     * Allows for manipulating the parameters passed to logger methods. The signature for this hook is
     * logMethod (args, method, level) {}, where args is an array of the arguments that were passed to the
     * log method and method is the log method itself, and level is the log level. This hook must invoke the method function by
     * using apply, like so: method.apply(this, newArgumentsArray).
     */
    logMethod?: (args: any[], method: LogFn, level: number) => void;
  };
}
```

### cacheOptions

```ts
export interface IAxiosCacheAdapterOptions {
  /**
   * {Number} Maximum time for storing each request in milliseconds,
   * defaults to 15 minutes when using `setup()`.
   */
  maxAge?: number;
  /**
   * {Number} Maximum number of cached request (last in, first out queue system),
   * defaults to `false` for no limit. *Cannot be overridden per request*
   */
  limit?: false | number;
  /**
   * {Object} An instance of localforage, defaults to a custom in memory store.
   * *Cannot be overridden per request*
   */
  store?: object;
  /**
   * {String|Function} Generate a unique cache key for the request.
   * Will use request url and serialized params by default.
   */
  key?(req: AxiosRequestConfig): string;
  /**
   * {Function} Invalidate stored cache. By default will remove cache when
   * making a `POST`, `PUT`, `PATCH` or `DELETE` query.
   */
  invalidate?(cfg: IAxiosCacheAdapterOptions, req: AxiosRequestConfig): Promise<void>;
  /**
   * {Object} Define which kind of requests should be excluded from cache.
   */
  exclude?: {
    /**
     * {Array} List of regular expressions to match against request URLs.
     */
    paths?: RegExp[];
    /**
     * {Boolean} Exclude requests with query parameters.
     */
    query?: boolean;
    /**
     * {Function} Method which returns a `Boolean` to determine if request
     * should be excluded from cache.
     */
    filter?: Function;
    /**
     * {Array} HTTP methods which will be excluded from cache.
     * Defaults to `['post', 'patch', 'put', 'delete']`
     * Any methods listed will also trigger cache invalidation while using the default `config.invalidate` method.
     *
     * Note: the HEAD method is always excluded (hard coded).
     */
    methods?: ('get' | 'post' | 'patch' | 'put' | 'delete')[];
  };
  /**
   * {Boolean} Clear cached item when it is stale.
   */
  clearOnStale?: boolean;
  /**
   * {Boolean} Clear all cache when a cache write error occurs
   * (prevents size quota problems in `localStorage`).
   */
  clearOnError?: boolean;
  /**
   * {Function|Boolean} Determine if stale cache should be read when a network error occurs.
   */
  readOnError?: Function | boolean;
  /**
   * {Boolean} Determine if response headers should be read to set `maxAge` automatically.
   * Will try to parse `cache-control` or `expires` headers.
   */
  readHeaders?: boolean;
  /**
   * {Boolean} Ignore cache, will force to interpret cache reads as a `cache-miss`.
   * Useful to bypass cache for a given request.
   */
  ignoreCache?: boolean;
  /**
   * {Function|Boolean} Print out debug log to console.
   */
  debug?: Function | boolean;

  excludeFromCache?: boolean;
}
```

## More

For more information:

- [Pino.js logOptions](https://getpino.io/#/docs/api?id=options)
- [Pino,js logDestination](https://getpino.io/#/docs/api?id=destination)
- [axios-cache-adapter cacheOptions](https://github.com/RasCarlito/axios-cache-adapter#options)
