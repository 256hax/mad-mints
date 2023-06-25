"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressBar = void 0;
const progressBar = (currentCount, completeCount) => {
    const dots = ".".repeat(currentCount);
    const left = completeCount - currentCount;
    const empty = " ".repeat(left);
    process.stdout.write(`\r[${dots}${empty}] ${Math.round(currentCount / completeCount * 100)}%`);
};
exports.progressBar = progressBar;
