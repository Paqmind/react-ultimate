import {expect} from "chai";
import {recommendOffset} from "frontend/helpers/pagination";

// SPECS ===========================================================================================
describe("recommendOffset()", function () {
  it("should work with offset 3", function () {
    expect(recommendOffset(30, 0, 3)) .equals(0);
    expect(recommendOffset(30, 1, 3)) .equals(0);
    expect(recommendOffset(30, 2, 3)) .equals(0);
    expect(recommendOffset(30, 3, 3)) .equals(3);
    expect(recommendOffset(30, 29, 3)).equals(27);
    expect(recommendOffset(30, 30, 3)).equals(27);
    expect(recommendOffset(30, 31, 3)).equals(27);
  });

  it("should work with offset 5", function () {
    expect(recommendOffset(50, 0, 5)) .equals(0);
    expect(recommendOffset(50, 4, 5)) .equals(0);
    expect(recommendOffset(50, 5, 5)) .equals(5);
    expect(recommendOffset(50, 44, 5)).equals(40);
    expect(recommendOffset(50, 45, 5)).equals(45);
    expect(recommendOffset(50, 50, 5)).equals(45);
    expect(recommendOffset(50, 51, 5)).equals(45);
  });
});
