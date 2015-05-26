// IMPORTS =========================================================================================
import {expect} from "chai";
import {parseQuery, formatQuery, formatQueryForAxios} from "shared/helpers/jsonapi";

// SPECS ===========================================================================================
describe("parseQuery()", function () {
  it("should handle single param", function () {
    expect(parseQuery({filter: {foo: "bar"}})).eql({filters: {foo: "bar"}});
    expect(parseQuery({sort: "+name,-age"})).eql({sorts: ["+name", "-age"]});
    expect(parseQuery({page: {offset: 100}})).eql({offset: 100});
    expect(parseQuery({page: {limit: 10}})).eql({limit: 10});
    expect(parseQuery({reset: true})).eql({reset: true});
  });

  it("should handle multiple params", function () {
    let unparsedQuery = {
      filter: {foo: "bar"},
      sort: "+name,-age",
      page: {offset: 100, limit: 10},
      reset: true
    };
    let parsedQuery = {
      filters: {foo: "bar"},
      sorts: ["+name", "-age"],
      offset: 100,
      limit: 10,
      reset: true
    };
    expect(parseQuery(unparsedQuery)).eql(parsedQuery);
  });
});

describe("formatQuery()", function () {
  it("should handle single param", function () {
    expect(formatQuery({filters: {foo: "bar"}})).eql({filter: {foo: "bar"}});
    expect(formatQuery({sorts: ["+name", "-age"]})).eql({sort: "+name,-age"});
    expect(formatQuery({offset: 100})).eql({page: {offset: 100}});
    expect(formatQuery({limit: 10})).eql({page: {limit: 10}});
    expect(formatQuery({reset: true})).eql({reset: true});
  });

  it("should handle multiple params", function () {
    let unformattedQuery = {
      filters: {foo: "bar"},
      sorts: ["+name", "-age"],
      offset: 100,
      limit: 10,
      reset: true
    };
    let formattedQuery = {
      filter: {foo: "bar"},
      sort: "+name,-age",
      page: {offset: 100, limit: 10},
      reset: true
    };
    expect(formatQuery(unformattedQuery)).eql(formattedQuery);
  });
});

describe("formatQueryForAxios()", function () {
  it("should work", function () {
    let unformattedQuery = {
      filters: {foo: "bar"},
      sorts: ["+name", "-age"],
      offset: 100,
      limit: 10,
      reset: true
    };
    let formattedForAxiosQuery = {
      "filter[foo]": "bar",
      "sort": "+name,-age",
      "page[offset]": 100,
      "page[limit]": 10,
      "reset": true
    };
    expect(formatQueryForAxios(unformattedQuery)).eql(formattedForAxiosQuery);
  });
});
