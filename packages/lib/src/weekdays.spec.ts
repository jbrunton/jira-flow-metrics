import { categorizeWeekday } from "@lib/weekdays";
import { describe, expect, it } from "vitest";

describe("categorizeWeekday", () => {
  it("categorizes weekdays", () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(categorizeWeekday)).toEqual([
      "weekday",
      "weekday",
      "weekday",
      "weekday",
      "weekday",
      "weekend",
      "weekend",
    ]);
  });
});
