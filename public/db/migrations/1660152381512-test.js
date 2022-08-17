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
exports.test1660152381512 = void 0;
const typeorm_1 = require("typeorm");
class test1660152381512 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "user",
                columns: [
                    {
                        name: "token",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "username",
                        type: "varchar",
                    },
                    {
                        name: "lang",
                        type: "varchar",
                    },
                ],
            }), true);
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "search",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "searchTitle",
                        type: "varchar",
                    },
                    {
                        name: "searchTime",
                        type: "integer",
                    },
                ],
            }), true);
            yield queryRunner.addColumn("search", new typeorm_1.TableColumn({
                name: "userToken",
                type: "uuid",
            }));
            yield queryRunner.createForeignKey("search", new typeorm_1.TableForeignKey({
                columnNames: ["userToken"],
                referencedColumnNames: ["token"],
                referencedTableName: "user",
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("search");
            const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf("userToken") !== -1);
            yield queryRunner.dropForeignKey("search", foreignKey);
            yield queryRunner.dropColumn("search", "userToken");
            yield queryRunner.dropTable("search");
            yield queryRunner.dropTable("user");
        });
    }
}
exports.test1660152381512 = test1660152381512;
