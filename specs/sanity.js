import {expect} from "chai";

describe("sanity", function () {
  it("should work", function () {
    expect(true).eql(true);
    expect(false).eql(false);
  });
});
