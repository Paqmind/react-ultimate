// IMPORTS =========================================================================================
import {expect} from "chai";
import {
  recommendOffset,
  recalculatePaginationWithFilters, recalculatePaginationWithSorts,
  recalculatePaginationWithoutModel, recalculatePaginationWithModel,
} from "frontend/helpers/pagination";

// SPECS ===========================================================================================
describe("recommendOffset()", function() {
  it("should work with offset 3", function() {
    expect(recommendOffset(30, 0, 3)) .equals(0);
    expect(recommendOffset(30, 1, 3)) .equals(0);
    expect(recommendOffset(30, 2, 3)) .equals(0);
    expect(recommendOffset(30, 3, 3)) .equals(3);
    expect(recommendOffset(30, 29, 3)).equals(27);
    expect(recommendOffset(30, 30, 3)).equals(27);
    expect(recommendOffset(30, 31, 3)).equals(27);
  });

  it("should work with offset 5", function() {
    expect(recommendOffset(50, 0, 5)) .equals(0);
    expect(recommendOffset(50, 4, 5)) .equals(0);
    expect(recommendOffset(50, 5, 5)) .equals(5);
    expect(recommendOffset(50, 44, 5)).equals(40);
    expect(recommendOffset(50, 45, 5)).equals(45);
    expect(recommendOffset(50, 50, 5)).equals(45);
    expect(recommendOffset(50, 51, 5)).equals(45);
  });
});

describe("recalculatePaginationWithFilters()", function() {
  it("should handle undefined values", function() {
    let models = {
      "6": {id: "6", manufacturer: "Russia"},
      "5": {id: "5", manufacturer: "USA"},
      "3": {id: "3", manufacturer: "China"},
      "2": {id: "2", manufacturer: "USA"},
      "4": {id: "4", manufacturer: "Russia"},
      "1": {id: "1", manufacturer: "Russia"},
    };
    let filters = {manufacturer: "Russia"};
    let sorts = [];
    let pagination = ["1", "2", "3", "4", "5", "6", undefined, undefined];
    let expectedPagination = ["1", "4", "6"];
    expect(recalculatePaginationWithFilters(models, filters, sorts, pagination)).eql(expectedPagination);
  });
});

describe("recalculatePaginationWithSorts()", function() {
  it("should handle undefined values", function() {
    let models = {
      "6": {id: "6", manufacturer: "Russia"},
      "5": {id: "5", manufacturer: "USA"},
      "3": {id: "3", manufacturer: "China"},
      "2": {id: "2", manufacturer: "USA"},
      "4": {id: "4", manufacturer: "Russia"},
      "1": {id: "1", manufacturer: "Russia"},
    };
    let filters = {};
    let sorts = ["+manufacturer", "+id"];
    let pagination = ["1", "2", "3", "4", "5", "6", undefined, undefined];
    let expectedPagination = ["3", "1", "4", "6", "2", "5", undefined, undefined];

    expect(recalculatePaginationWithSorts(models, filters, sorts, pagination)).eql(expectedPagination);
  });
});

describe("recalculatePaginationWithoutModel()", function() {
  it("should handle undefined values", function() {
    let models = {
      "1": {id: "1"},
      "3": {id: "3"},
      "2": {id: "2"}, // gonna remove this one
    };
    let filters = {};
    let sorts = [];
    let pagination = ["1", "2", "3", undefined];
    let id = "2";
    let expectedPagination = ["1", "3", undefined];
    expect(recalculatePaginationWithoutModel(models, filters, sorts, pagination, id)).eql(expectedPagination);
  });
});

describe("recalculatePaginationWithModel()", function() {
  it("should handle undefined values", function() {
    let models = {
      "1": {id: "1", manufacturer: "Russia"},
      "3": {id: "3", manufacturer: "USA"},
      "4": {id: "4", manufacturer: "China"},
      "2": {id: "2", manufacturer: "USA"}, // gonna add this one
    };
    let filters = {};
    let sorts = ["+id"];
    let pagination = ["1", "3", "4", undefined];
    let id = "2";
    let expectedPagination = ["1", "2", "3", "4", undefined];
    expect(recalculatePaginationWithModel(models, filters, sorts, pagination, id)).eql(expectedPagination);
  });
});
