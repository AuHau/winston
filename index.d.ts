// Type definitions for winston 3.0
// Project: https://github.com/winstonjs/winston

/// <reference types="node" />

import * as NodeJSStream from "stream";

import * as logform from 'logform';
import * as Transport from 'winston-transport';

import * as Config from './lib/winston/config/index';
import * as Transports from './lib/winston/transports/index';

declare namespace winston {
  // Hoisted namespaces from other modules
  export import format = logform.format;
  export import Logform = logform;
  export import config = Config;
  export import transports = Transports;
  export import transport = Transport;

  interface ExceptionHandler {
    logger: Logger;
    handlers: Map<any, any>;
    catcher: Function | boolean;

    handle(...transports: Transport[]): void;
    unhandle(...transports: Transport[]): void;
    getAllInfo(err: string | Error): object;
    getProcessInfo(): object;
    getOsInfo(): object;
    getTrace(err: Error): object;

    new(logger: Logger): ExceptionHandler;
  }

  interface QueryOptions {
    rows?: number;
    limit?: number;
    start?: number;
    from?: Date;
    until?: Date;
    order?: "asc" | "desc";
    fields: any;
  }

  interface Profiler {
    logger: Logger;
    start: Number;
    done(info?: any): boolean;
  }

  type LogCallback = (error?: any, level?: string, message?: string, meta?: any) => void;

  interface LogEntry {
    level: string;
    message: string;
    [optionName: string]: any;
  }

  interface LogMethod {
    (level: string, message: string, callback: LogCallback): Logger;
    (level: string, message: string, meta: any, callback: LogCallback): Logger;
    (level: string, message: string, ...meta: any[]): Logger;
    (entry: LogEntry): Logger;
    (level: string, message: any): Logger;
  }

  interface LeveledLogMethod {
    (message: string, callback: LogCallback): Logger;
    (message: string, meta: any, callback: LogCallback): Logger;
    (message: string, ...meta: any[]): Logger;
    (message: any): Logger;
    (infoObject: object): Logger;
  }

  interface LoggerOptions<T extends Config.AbstractConfigSetLevels = Config.AbstractConfigSetLevels> {
    levels?: T;
    silent?: boolean;
    format?: logform.Format;
    level?: string;
    exitOnError?: Function | boolean;
    defaultMeta?: any;
    transports?: Transport[] | Transport;
    handleExceptions?: boolean;
    exceptionHandlers?: any;
  }

  type DefaultLevels = {
    // for cli and npm levels
    error: number;
    warn: number;
    help: number;
    data: number;
    info: number;
    debug: number;
    prompt: number;
    http: number;
    verbose: number;
    input: number;
    silly: number;
    
    // for syslog levels only
    emerg: number;
    alert: number;
    crit: number;
    warning: number;
    notice: number;
  }

  type Logger<T extends Config.AbstractConfigSetLevels = DefaultLevels> = NodeJSStream.Transform & {
    silent: boolean;
    format: logform.Format;
    levels: T;
    level: string;
    transports: Transport[];
    exceptions: ExceptionHandler;
    profilers: object;
    exitOnError: Function | boolean;
    defaultMeta?: any;

    log: LogMethod;
    add(transport: Transport): Logger;
    remove(transport: Transport): Logger;
    clear(): Logger;
    close(): Logger;

    query(options?: QueryOptions, callback?: (err: Error, results: any) => void): any;
    stream(options?: any): NodeJS.ReadableStream;

    startTimer(): Profiler;
    profile(id: string | number, meta?: LogEntry): Logger;

    configure(options: LoggerOptions): void;

    child(options: Object): Logger;

    isLevelEnabled(level: string): boolean;
    isErrorEnabled(): boolean;
    isWarnEnabled(): boolean;
    isInfoEnabled(): boolean;
    isVerboseEnabled(): boolean;
    isDebugEnabled(): boolean;
    isSillyEnabled(): boolean;

    new(options?: LoggerOptions): Logger;
  } & {[K in keyof T]: LeveledLogMethod;}

  interface Container {
    loggers: Map<string, Logger>;
    options: LoggerOptions;

    add(id: string, options?: LoggerOptions): Logger;
    get(id: string, options?: LoggerOptions): Logger;
    has(id: string): boolean;
    close(id?: string): void;

    new(options?: LoggerOptions): Container;
  }

  let version: string;
  let ExceptionHandler: ExceptionHandler;
  let Container: Container;
  let loggers: Container;

  let addColors: (target: Config.AbstractConfigSetColors) => any;
  let createLogger: <T extends Config.AbstractConfigSetLevels = DefaultLevels>(options?: LoggerOptions<T>) => Logger<T>;

  // Pass-through npm level methods routed to the default logger.
  let error: LeveledLogMethod;
  let warn: LeveledLogMethod;
  let info: LeveledLogMethod;
  let http: LeveledLogMethod;
  let verbose: LeveledLogMethod;
  let debug: LeveledLogMethod;
  let silly: LeveledLogMethod;

  // Other pass-through methods routed to the default logger.
  let log: LogMethod;
  let query: (options?: QueryOptions, callback?: (err: Error, results: any) => void) => any;
  let stream: (options?: any) => NodeJS.ReadableStream;
  let add: (transport: Transport) => Logger;
  let remove: (transport: Transport) => Logger;
  let clear: () => Logger;
  let startTimer: () => Profiler;
  let profile: (id: string | number) => Logger;
  let configure: (options: LoggerOptions) => void;
  let child: (options: Object) => Logger;
  let level: string;
  let exceptions: ExceptionHandler;
  let exitOnError: Function | boolean;
  // let default: object;
}

export = winston;
