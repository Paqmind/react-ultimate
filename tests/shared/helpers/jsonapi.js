let assert = require("assert")
let {parseQuery, formatQuery, formatQueryForAxios} = require("common/helpers/jsonapi")

let assertEq = assert.deepStrictEqual

// SPECS ===========================================================================================
describe("parseQuery()", function () {
  it("should handle single param", function () {
    assertEq(parseQuery({filter: {foo: "bar"}}), {filters: {foo: "bar"}})
    assertEq(parseQuery({sort: "+name,-age"}), {sorts: ["+name", "-age"]})
    assertEq(parseQuery({page: {offset: 100}}), {offset: 100})
    assertEq(parseQuery({page: {limit: 10}}), {limit: 10})
    assertEq(parseQuery({reset: true}), {reset: true})
  })

  it("should handle multiple params", function () {
    let unparsedQuery = {
      filter: {foo: "bar"},
      sort: "+name,-age",
      page: {offset: 100, limit: 10},
      reset: true
    }
    let parsedQuery = {
      filters: {foo: "bar"},
      sorts: ["+name", "-age"],
      offset: 100,
      limit: 10,
      reset: true
    }
    assertEq(parseQuery(unparsedQuery), parsedQuery)
  })
})

describe("formatQuery()", function () {
  it("should handle single param", function () {
    assertEq(formatQuery({filters: {foo: "bar"}}), {filter: {foo: "bar"}})
    assertEq(formatQuery({sorts: ["+name", "-age"]}), {sort: "+name,-age"})
    assertEq(formatQuery({offset: 100}), {page: {offset: 100}})
    assertEq(formatQuery({limit: 10}), {page: {limit: 10}})
    assertEq(formatQuery({reset: true}), {reset: true})
  })

  it("should handle multiple params", function () {
    let unformattedQuery = {
      filters: {foo: "bar"},
      sorts: ["+name", "-age"],
      offset: 100,
      limit: 10,
      reset: true
    }
    let formattedQuery = {
      filter: {foo: "bar"},
      sort: "+name,-age",
      page: {offset: 100, limit: 10},
      reset: true
    }
    assertEq(formatQuery(unformattedQuery), formattedQuery)
  })
})

describe("formatQueryForAxios()", function () {
  it("should work", function () {
    let unformattedQuery = {
      filters: {foo: "bar"},
      sorts: ["+name", "-age"],
      offset: 100,
      limit: 10,
      reset: true
    }
    let formattedForAxiosQuery = {
      "filter[foo]": "bar",
      "sort": "+name,-age",
      "page[offset]": 100,
      "page[limit]": 10,
      "reset": true
    }
    assertEq(formatQueryForAxios(unformattedQuery), formattedForAxiosQuery)
  })
})
