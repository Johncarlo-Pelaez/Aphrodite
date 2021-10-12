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
exports.DocumentConsumer = void 0;
const bull_1 = require("@nestjs/bull");
const repositories_1 = require("../repositories");
let DocumentConsumer = class DocumentConsumer {
    constructor(documentRepository) {
        this.documentRepository = documentRepository;
    }
    async migrate(job) {
        const document = await this.documentRepository.getDocument(job.data);
        console.log(document);
    }
};
__decorate([
    (0, bull_1.Process)('migrate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentConsumer.prototype, "migrate", null);
DocumentConsumer = __decorate([
    (0, bull_1.Processor)('document'),
    __metadata("design:paramtypes", [repositories_1.DocumentRepository])
], DocumentConsumer);
exports.DocumentConsumer = DocumentConsumer;
//# sourceMappingURL=document.consumer.js.map