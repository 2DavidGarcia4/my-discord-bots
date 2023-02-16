"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.surveysModel = exports.rafflesModel = exports.carcelModel = exports.alliancesModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
//? Sistema de alianzas
class Alliances {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Alliances.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Alliances.prototype, "members", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Alliances.prototype, "servers", void 0);
exports.alliancesModel = (0, typegoose_1.getModelForClass)(Alliances);
//? Carcél 
class Carcel {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Carcel.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Carcel.prototype, "prisoners", void 0);
exports.carcelModel = (0, typegoose_1.getModelForClass)(Carcel);
//? Raffles system
class Raffles {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Raffles.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Raffles.prototype, "data", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Raffles.prototype, "raffles", void 0);
exports.rafflesModel = (0, typegoose_1.getModelForClass)(Raffles);
//? Surveys system
class Surveys {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Surveys.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Surveys.prototype, "data", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Surveys.prototype, "surveys", void 0);
exports.surveysModel = (0, typegoose_1.getModelForClass)(Surveys);
