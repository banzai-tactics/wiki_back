"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// config.js
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
module.exports = {
    user: process.env.USER,
    host: process.env.HOST,
    db: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
};
