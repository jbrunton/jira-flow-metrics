import { excludeOutliersFromSeq } from "./outliers";

describe("excludeOutliersFromSeq", () => {
  const seqWithoutOutliers = [{ x: 1 }, { x: 2 }, { x: 1 }, { x: 3 }];

  it("filters out outliers if they exist", () => {
    const result = excludeOutliersFromSeq(
      [...seqWithoutOutliers, { x: 100 }],
      (a) => a.x,
    );
    expect(result).toEqual(seqWithoutOutliers);
  });

  it("filters nothing if there are no outliers", () => {
    const result = excludeOutliersFromSeq(seqWithoutOutliers, (a) => a.x);
    expect(result).toEqual(seqWithoutOutliers);
  });
});
