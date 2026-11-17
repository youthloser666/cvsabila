import { describe, expect, it } from "bun:test";
import { generateNextInvoiceNumber } from "../src/models/schemas";

describe("Auto-Incrementing Invoice Number Engine", () => {
  it("should start with 026/PI/SMK-SL-V/2026 when no history exists", () => {
    const next = generateNextInvoiceNumber([]);
    expect(next).toBe("026/PI/SMK-SL-V/2026");
  });

  it("should increment from 026 to 027", () => {
    const history = ["026/PI/SMK-SL-V/2026"];
    const next = generateNextInvoiceNumber(history);
    expect(next).toBe("027/PI/SMK-SL-V/2026");
  });

  it("should find the highest sequence among multiple past invoices", () => {
    const history = [
      "026/PI/SMK-SL-V/2026",
      "028/PI/SMK-SL-V/2026",
      "027/PI/SMK-SL-V/2026",
    ];
    const next = generateNextInvoiceNumber(history);
    expect(next).toBe("029/PI/SMK-SL-V/2026");
  });

  it("should maintain custom suffix formatting from highest invoice", () => {
    const history = ["030/INV-EXP/2026"];
    const next = generateNextInvoiceNumber(history);
    expect(next).toBe("031/INV-EXP/2026");
  });
});
