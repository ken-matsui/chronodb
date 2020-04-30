"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const level = require("level");
const mkdirp = require("mkdirp");
const TimeSeries_1 = require("./TimeSeries");
class ChronoDB {
    constructor(path) {
        mkdirp.sync(path);
        this.store = level(path, { keyEncoding: 'utf-8', valueEncoding: 'json' });
    }
    getTimeSeries(name, reviver) {
        return new TimeSeries_1.TimeSeries(this.store, name, reviver);
    }
    getUnderlyingStore() {
        return this.store;
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.store.close();
        });
    }
}
exports.ChronoDB = ChronoDB;
