import {expect} from "chai";
import {
  recalculatePaginationWithFilters, recalculatePaginationWithSorts,
  recalculatePaginationWithoutModel, recalculatePaginationWithModel,
} from "frontend/helpers/pagination";
import {sortByAll} from "shared/helpers/common";

describe("recalculatePaginationWithFilters()", function() {
  it("should handle undefined values", function() {
    let filters = {manufacturer: "Russia"};
    let pagination = ["1", "2", "3", "4", "5", "6", undefined, undefined];
    let models = {
      "6": {id: "6", manufacturer: "Russia"},
      "5": {id: "5", manufacturer: "USA"},
      "3": {id: "3", manufacturer: "China"},
      "2": {id: "2", manufacturer: "USA"},
      "4": {id: "4", manufacturer: "Russia"},
      "1": {id: "1", manufacturer: "Russia"},
    };
    let expectedPagination = ["1", "4", "6"];

    expect(recalculatePaginationWithFilters(filters, pagination, models)).eql(expectedPagination);
  });
});

describe("recalculatePaginationWithSorts()", function() {
  it("should handle undefined values", function() {
    let sorts = ["+manufacturer", "+id"];
    let pagination = ["1", "2", "3", "4", "5", "6", undefined, undefined];
    let models = {
      "6": {id: "6", manufacturer: "Russia"},
      "5": {id: "5", manufacturer: "USA"},
      "3": {id: "3", manufacturer: "China"},
      "2": {id: "2", manufacturer: "USA"},
      "4": {id: "4", manufacturer: "Russia"},
      "1": {id: "1", manufacturer: "Russia"},
    };
    let expectedPagination = ["3", "1", "4", "6", "2", "5", undefined, undefined];

    expect(recalculatePaginationWithSorts(sorts, pagination, models)).eql(expectedPagination);
  });
});

describe("recalculatePaginationWithoutModel()", function() {
  it("should handle undefined values", function() {
    let id = "2";
    let pagination = ["1", "2", "3", undefined];
    let models = {
      "1": {id: "1", manufacturer: "Russia"},
      "2": {id: "2", manufacturer: "USA"},
      "3": {id: "3", manufacturer: "China"},
    };
    let expectedPagination = ["1", "3", undefined];

    expect(recalculatePaginationWithoutModel(id, pagination, models)).eql(expectedPagination);
  });
});

describe("recalculatePaginationWithModel()", function() {
  it("should handle undefined values", function() {
    let filters = {};
    let sorts = ["+id"];
    let id = "2";
    let pagination = ["1", "3", "4", undefined];
    let models = {
      "1": {id: "1", manufacturer: "Russia"},
      "3": {id: "3", manufacturer: "USA"},
      "4": {id: "4", manufacturer: "China"},
      "2": {id: "2", manufacturer: "USA"}, // gonna add this one
    };
    let expectedPagination = ["1", "2", "3", "4", undefined];

    expect(recalculatePaginationWithModel(filters, sorts, id, pagination, models)).eql(expectedPagination);
  });
});
