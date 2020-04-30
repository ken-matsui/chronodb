import { LevelUp, QueryOptions } from './types';
export declare class TimeSeries<T> {
    private readonly store;
    private readonly name;
    private readonly reviver?;
    private readonly queryAll;
    constructor(store: LevelUp, name: string, reviver?: ((original: T) => T) | undefined);
    get(key: string): Promise<T>;
    getAll(): Promise<{
        key: string;
        value: T;
    }[]>;
    query(options: QueryOptions): Promise<{
        key: string;
        value: T;
    }[]>;
    queryStream(options: QueryOptions): NodeJS.ReadableStream;
    put(value: T, date?: Date): Promise<string>;
    del(key: string): Promise<void>;
    delAll(): Promise<{}>;
    private generateKey;
    private dateToTimestamp;
}
