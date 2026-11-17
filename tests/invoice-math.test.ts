import { describe, expect, it } from "bun:test";
import {
  calculateGrandTotal,
  calculateLineTotal,
  calculateSubtotal,
  calculateTotalQuantity,
} from "../src/models/schemas";

describe("Invoice Mathematical Formulas & Calculations", () => {
  it("should accurately calculate single line totals", () => {
    expect(calculateLineTotal(18000, 1)).toBe(18000);
    expect(calculateLineTotal(8500, 4)).toBe(34000);
    expect(calculateLineTotal(0, 10)).toBe(0);
  });

  it("should match exact totals from PI026SMK291026.pdf sample", () => {
    const items = [
      { totalPrice: 18000, quantity: 1 }, // ST-020 Serving Plate
      { totalPrice: 9000, quantity: 1 },  // ST-016 Coaster
      { totalPrice: 8500, quantity: 1 },  // SC-004 Coaster
      { totalPrice: 8500, quantity: 1 },  // SC-004 Coaster
      { totalPrice: 25000, quantity: 1 }, // SC-004 Bowl
      { totalPrice: 20000, quantity: 1 }, // ST-005 Serving Plate
      { totalPrice: 20000, quantity: 1 }, // ST-023 Serving Plate
      { totalPrice: 15000, quantity: 1 }, // ST-021 Serving Plate
    ];

    const totalQty = calculateTotalQuantity(items);
    const subtotal = calculateSubtotal(items);
    const shippingFee = [{ amount: 23000 }];
    const grandTotal = calculateGrandTotal(subtotal, shippingFee);

    expect(totalQty).toBe(8);
    expect(subtotal).toBe(124000);
    expect(grandTotal).toBe(147000);
  });

  it("should calculate grand total with multiple additional charges", () => {
    const subtotal = 100000;
    const charges = [
      { amount: 15000 },
      { amount: 5000 },
    ];
    expect(calculateGrandTotal(subtotal, charges)).toBe(120000);
  });
});
