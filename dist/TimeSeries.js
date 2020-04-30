"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const _ = require("lodash");
const through2 = require("through2");
const firstUuid = '00000000-0000-0000-0000-000000000000';
const lastUuid = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const firstTimestamp = '0000000000000';
const lastTimestamp = '9999999999999';
class TimeSeries {
    constructor(store, name, reviver) {
        this.store = store;
        this.name = name;
        this.reviver = reviver;
        this.queryAll = {
            gt: `${this.name}/${firstTimestamp}/${firstUuid}`,
            lt: `${this.name}/${lastTimestamp}/${lastUuid}`
        };
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.store.get(key);
            return this.reviver ? this.reviver(value) : value;
        });
    }
    getAll() {
        const kvArray = [];
        return new Promise((resolve, reject) => this.store
            .createReadStream(this.queryAll)
            .on('data', kv => kvArray.push({
            key: kv.key,
            value: this.reviver ? this.reviver(kv.value) : kv.value
        }))
            .on('end', () => resolve(kvArray))
            .on('error', reject));
    }
    query(options) {
        const kvArray = [];
        const gt = `${this.name}/${this.dateToTimestamp(options.start)}/${firstUuid}`;
        const lt = `${this.name}/${this.dateToTimestamp(options.end)}/${lastUuid}`;
        return new Promise((resolve, reject) => this.store
            .createReadStream({ gt, lt })
            .on('data', kv => kvArray.push({
            key: kv.key,
            value: this.reviver ? this.reviver(kv.value) : kv.value
        }))
            .on('end', () => resolve(kvArray))
            .on('error', reject));
    }
    queryStream(options) {
        const gt = `${this.name}/${this.dateToTimestamp(options.start)}/${firstUuid}`;
        const lt = `${this.name}/${this.dateToTimestamp(options.end)}/${lastUuid}`;
        const that = this;
        return this.store.createReadStream({ gt, lt }).pipe(through2.obj(function (kv) {
            this.push({
                key: kv.key,
                value: that.reviver ? that.reviver(kv.value) : kv.value
            });
        }));
    }
    put(value, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.generateKey(date);
            yield this.store.put(key, value);
            return key;
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.store.del(key);
        });
    }
    delAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => this.store
                .createKeyStream(this.queryAll)
                .on('data', key => this.store.del(key))
                .on('end', () => resolve({}))
                .on('error', reject));
        });
    }
    generateKey(date = new Date()) {
        return `${this.name}/${this.dateToTimestamp(date)}/${uuid_1.v1()}`;
    }
    dateToTimestamp(date) {
        return _.padStart(String(date.valueOf()), 13, '0');
    }
}
exports.TimeSeries = TimeSeries;
