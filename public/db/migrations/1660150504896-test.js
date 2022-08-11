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
exports.test1660150504896 = void 0;
class test1660150504896 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "userTest"`);
            yield queryRunner.query(`ALTER TABLE "userTest" ADD COLUMN "username" varchar`);
            yield queryRunner.query(`ALTER TABLE "userTest" ADD COLUMN "lang" varchar`);
            yield queryRunner.query(`ALTER TABLE "userTest" ADD COLUMN "token" uuid`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE userTest`); // reverts things made in "up" method
        });
    }
}
exports.test1660150504896 = test1660150504896;
