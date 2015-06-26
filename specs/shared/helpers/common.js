import {prop} from "ramda";
import {expect} from "chai";
import {chunked, filterByAll, sortByAll} from "shared/helpers/common";

// SPECS ===========================================================================================
describe("chunked()", function () {
  it("should work", function () {
    expect(chunked(5, [1, 2, 3, 4, 5])).eql([[1, 2, 3, 4, 5]]);
    expect(chunked(5, [1, 2, 3, 4, 5, 6, 7])).eql([[1, 2, 3, 4, 5], [6, 7]]);
  });
});

describe("filterByAll()", function () {
  it("should filter by all arguments", function () {
    let filters = {manufacturer: "Russia", id: "1"};
    let data = [
      {id: "6", manufacturer: "Russia"},
      {id: "5", manufacturer: "USA"},
      {id: "3", manufacturer: "China"},
      {id: "2", manufacturer: "USA"},
      {id: "4", manufacturer: "Russia"},
      {id: "1", manufacturer: "Russia"},
      {id: "1", manufacturer: "Xyz"},
    ];
    let expectedData = [
      {id: "1", manufacturer: "Russia"},
    ];

    expect(filterByAll(filters, data)).eql(expectedData);
  });

  it("should curry arguments", function () {
    let filters = {id: "2"};
    let data = [{id: "2"}, {id: "1"}];
    let expectedData = [{id: "2"}];
    expect(filterByAll(filters)(data)).eql(expectedData);
  });
});

describe("sortByAll()", function () {
  it("should handle space instead of + (unencoded)", function () {
    let sorts = [" id"];
    let data = [{id: "2"}, {id: "1"}];
    let expectedData = [{id: "1"}, {id: "2"}];
    expect(sortByAll(sorts, data)).eql(expectedData);
  });

  it("should sort by all arguments", function () {
    let sorts = ["+manufacturer", "+id"];
    let data = [
      {id: "6", manufacturer: "Russia"},
      {id: "5", manufacturer: "USA"},
      {id: "3", manufacturer: "China"},
      {id: "2", manufacturer: "USA"},
      {id: "4", manufacturer: "Russia"},
      {id: "1", manufacturer: "Russia"},
    ];
    let expectedData = [
      {id: "3", manufacturer: "China"},
      {id: "1", manufacturer: "Russia"},
      {id: "4", manufacturer: "Russia"},
      {id: "6", manufacturer: "Russia"},
      {id: "2", manufacturer: "USA"},
      {id: "5", manufacturer: "USA"},
    ];
    expect(sortByAll(sorts, data)).eql(expectedData);
  });

  it("should curry arguments", function () {
    let sorts = ["+id"];
    let data = [{id: "2"}, {id: "1"}];
    let expectedData = [{id: "1"}, {id: "2"}];
    expect(sortByAll(sorts, data)).eql(expectedData);
  });
});
