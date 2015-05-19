// IMPORTS =========================================================================================
import {expect} from "chai";
import {
  getMaxOffset,
  recalculatePaginationWithFilters, recalculatePaginationWithSorts,
  recalculatePaginationWithoutModel, recalculatePaginationWithModel,
} from "frontend/helpers/pagination";

// SPECS ===========================================================================================
describe("getMaxOffset()", function() {
  it("should work", function() {
    expect(getMaxOffset(30, 3)).equals(27);
    expect(getMaxOffset(50, 5)).equals(45);
  });
});

describe("recalculatePaginationWithFilters()", function() {
  it("should handle undefined values", function() {
    let filters = {manufacturer: "Russia"};
    let sorts = [];
    let models = {
      "6": {id: "6", manufacturer: "Russia"},
      "5": {id: "5", manufacturer: "USA"},
      "3": {id: "3", manufacturer: "China"},
      "2": {id: "2", manufacturer: "USA"},
      "4": {id: "4", manufacturer: "Russia"},
      "1": {id: "1", manufacturer: "Russia"},
    };
    let pagination = ["1", "2", "3", "4", "5", "6", undefined, undefined];
    let expectedPagination = ["1", "4", "6"];
    expect(recalculatePaginationWithFilters(filters, sorts, models, pagination)).eql(expectedPagination);
  });
});

describe("recalculatePaginationWithSorts()", function() {
  it("should handle undefined values", function() {
    let filters = {};
    let sorts = ["+manufacturer", "+id"];
    let models = {
      "6": {id: "6", manufacturer: "Russia"},
      "5": {id: "5", manufacturer: "USA"},
      "3": {id: "3", manufacturer: "China"},
      "2": {id: "2", manufacturer: "USA"},
      "4": {id: "4", manufacturer: "Russia"},
      "1": {id: "1", manufacturer: "Russia"},
    };
    let pagination = ["1", "2", "3", "4", "5", "6", undefined, undefined];
    let expectedPagination = ["3", "1", "4", "6", "2", "5", undefined, undefined];

    expect(recalculatePaginationWithSorts(filters, sorts, models, pagination)).eql(expectedPagination);
  });
});

describe("recalculatePaginationWithoutModel()", function() {
  it("should handle undefined values", function() {
    let filters = {};
    let sorts = [];
    let models = {
      "1": {id: "1"},
      "3": {id: "3"},
      "2": {id: "2"}, // gonna remove this one
    };
    let pagination = ["1", "2", "3", undefined];
    let id = "2";
    let expectedPagination = ["1", "3", undefined];
    expect(recalculatePaginationWithoutModel(filters, sorts, models, pagination, id)).eql(expectedPagination);
  });
});

describe("recalculatePaginationWithModel()", function() {
  it("should handle undefined values", function() {
    let filters = {};
    let sorts = ["+id"];
    let models = {
      "1": {id: "1", manufacturer: "Russia"},
      "3": {id: "3", manufacturer: "USA"},
      "4": {id: "4", manufacturer: "China"},
      "2": {id: "2", manufacturer: "USA"}, // gonna add this one
    };
    let pagination = ["1", "3", "4", undefined];
    let id = "2";
    let expectedPagination = ["1", "2", "3", "4", undefined];
    expect(recalculatePaginationWithModel(filters, sorts, models, pagination, id)).eql(expectedPagination);
  });
});
