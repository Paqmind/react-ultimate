let assert = require("assert")
let {recommendOffset} = require("frontend/helpers/pagination")

let assertEq = assert.deepStrictEqual

// SPECS ===========================================================================================
describe("recommendOffset()", function () {
  it("should work with offset 3", function () {
    assertEq(recommendOffset(30, 0, 3), 0)
    assertEq(recommendOffset(30, 1, 3), 0)
    assertEq(recommendOffset(30, 2, 3), 0)
    assertEq(recommendOffset(30, 3, 3), 3)
    assertEq(recommendOffset(30, 29, 3), 27)
    assertEq(recommendOffset(30, 30, 3), 27)
    assertEq(recommendOffset(30, 31, 3), 27)
  })

  it("should work with offset 5", function () {
    assertEq(recommendOffset(50, 0, 5), 0)
    assertEq(recommendOffset(50, 4, 5), 0)
    assertEq(recommendOffset(50, 5, 5), 5)
    assertEq(recommendOffset(50, 44, 5), 40)
    assertEq(recommendOffset(50, 45, 5), 45)
    assertEq(recommendOffset(50, 50, 5), 45)
    assertEq(recommendOffset(50, 51, 5), 45)
  })
})
