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
exports.surveysModel = exports.rafflesModel = exports.personalModel = exports.invitesModel = exports.ticketsModel = exports.carcelModel = exports.suggestionsModel = exports.alliancesModel = exports.botModel = void 0;
const mongoose_1 = require("mongoose");
const typegoose_1 = require("@typegoose/typegoose");
//? Bot db
class PCEMbot {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], PCEMbot.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], PCEMbot.prototype, "logs", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], PCEMbot.prototype, "autoModeration", void 0);
exports.botModel = (0, typegoose_1.getModelForClass)(PCEMbot);
exports.botModel.syncIndexes();
//? Sistema de alianzas
class Alianzas {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Alianzas.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Alianzas.prototype, "canalID", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Alianzas.prototype, "miembros", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Alianzas.prototype, "servidores", void 0);
exports.alliancesModel = (0, typegoose_1.getModelForClass)(Alianzas);
//? Sistema de sugerencias
class Sugerencias {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Sugerencias.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Sugerencias.prototype, "sugerencias", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Sugerencias.prototype, "mensajes", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Sugerencias.prototype, "miembros", void 0);
exports.suggestionsModel = (0, typegoose_1.getModelForClass)(Sugerencias);
//? Carcél 
class Carcel {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Carcel.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Carcel.prototype, "cantidad", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Carcel.prototype, "prisioneros", void 0);
exports.carcelModel = (0, typegoose_1.getModelForClass)(Carcel);
//? Sistema de tickets
exports.ticketsModel = (0, mongoose_1.model)("Tickets", new mongoose_1.Schema({
    _id: { type: String, required: true },
    datos: { type: Object, required: true },
    tickets: { type: Array, required: true },
    miembros: { type: Array, required: true }
}));
//? Sistema de invitaciones
class Ivitaciones {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Ivitaciones.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Ivitaciones.prototype, "datos", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Ivitaciones.prototype, "miembros", void 0);
exports.invitesModel = (0, typegoose_1.getModelForClass)(Ivitaciones);
//? Historial del personal
class Personal {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Personal.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Personal.prototype, "datos", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Personal.prototype, "personal", void 0);
exports.personalModel = (0, typegoose_1.getModelForClass)(Personal);
//? Sistema de sorteos
class Sorteos {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Sorteos.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Sorteos.prototype, "datos", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Sorteos.prototype, "sorteos", void 0);
exports.rafflesModel = (0, typegoose_1.getModelForClass)(Sorteos);
//? Sistema de encuestas
class Encuestas {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Encuestas.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Encuestas.prototype, "datos", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Encuestas.prototype, "encuestas", void 0);
exports.surveysModel = (0, typegoose_1.getModelForClass)(Encuestas);
