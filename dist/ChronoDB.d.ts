import { LevelUp } from "./types";
import { TimeSeries } from './TimeSeries';
export declare class ChronoDB {
    private readonly store;
    constructor(path: string);
    getTimeSeries<T>(name: string, reviver?: (o: T) => T): TimeSeries<T>;
    getUnderlyingStore(): LevelUp;
    close(): Promise<void>;
}
