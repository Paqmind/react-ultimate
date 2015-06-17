import Moment from "moment";
import {expect} from "chai";
import {parseString, parseInteger, parseFloat, parseDate} from "shared/converters";
import {formatString, formatInteger, formatFloat, formatDate} from "shared/converters";

// SPECS ===========================================================================================
describe("parseString()", function () {
  it("should parse '' as undefined", function () {
    expect(parseString("")).eql(undefined);
  });

  it("should parse strings, trimming whitespace", function () {
    expect(parseString("foo")).eql("foo");
    expect(parseString(" foo ")).eql("foo");
  });

  it("should throw for non strings", function () {
    expect(() => parseString(undefined)).throw("value must be of string type, got undefined");
    expect(() => parseString(null)).throw("value must be of string type, got object");
    expect(() => parseString(42)).throw("value must be of string type, got number");
  });
});

describe("parseInteger()", function () {
  it("should parse '' as undefined", function () {
    expect(parseInteger("")).eql(undefined);
  });

  it("should parse valid integer strings, trimming whitespace", function () {
    expect(parseInteger("42")).eql(42);
    expect(parseInteger(" 42 ")).eql(42);
  });

  it("should throw for invalid integer strings", function () {
    expect(() => parseInteger("42.1")).throw("invalid integer string: 42.1");
    expect(() => parseInteger("foo")).throw("invalid integer string: foo");
  });

  it("should throw for other types", function () {
    expect(() => parseInteger(undefined)).throw("value must be of string type, got undefined");
    expect(() => parseInteger(null)).throw("value must be of string type, got object");
    expect(() => parseInteger(42)).throw("value must be of string type, got number");
  });
});

describe("parseFloat()", function () {
  it("should parse '' as undefined", function () {
    expect(parseFloat("")).eql(undefined);
  });

  it("should parse valid float string values, trimming whitespace", function () {
    expect(parseFloat("42")).eql(42);
    expect(parseFloat(" 42 ")).eql(42);
    expect(parseFloat("42.1")).eql(42.1);
    expect(parseFloat(" 42.1 ")).eql(42.1);
  });

  it("should throw for invalid float strings", function () {
    expect(() => parseFloat("foo")).throw("invalid float string: foo");
    expect(() => parseFloat(" bar ")).throw("invalid float string: bar");
  });

  it("should throw for other types", function () {
    expect(() => parseFloat(undefined)).throw("value must be of string type, got undefined");
    expect(() => parseFloat(null)).throw("value must be of string type, got object");
    expect(() => parseFloat(42)).throw("value must be of string type, got number");
    expect(() => parseFloat(42.1)).throw("value must be of string type, got number");
  });
});

describe("parseDate()", function () {
  it("should parse '' as undefined", function () {
    expect(parseDate("")).eql(undefined);
  });

  it("should parse date strings in valid formats, trimming whitespace", function () {
    expect(parseDate("2015-01-02", "YYYY-MM-DD").isSame(Moment("2015-01-02"))).eql(true);
    expect(parseDate(" 2015-01-02 ", "YYYY-MM-DD").isSame(Moment("2015-01-02"))).eql(true);
  });

  it("should throw for date string in non-valid formats", function () {
    expect(() => parseDate("2015-01-02", "YYYY:MM:DD")).throw("invalid date string: 2015-01-02");
    expect(() => parseDate(" 2015-01-02 ", "YYYY/MM/DD")).throw("invalid date string: 2015-01-02");
    expect(() => parseDate("2015/01/02", "YYYY-MM-DD")).throw("invalid date string: 2015/01/02");
    expect(() => parseDate(" 2015/01/02 ", "YYYY-MM-DD")).throw("invalid date string: 2015/01/02");
    expect(() => parseDate("foo")).throw("invalid date string: foo");
    expect(() => parseDate(" bar ")).throw("invalid date string: bar");
  });

  it("should throw for other types", function () {
    expect(() => parseDate(undefined)).throw("value must be of string type, got undefined");
    expect(() => parseDate(null)).throw("value must be of string type, got object");
    expect(() => parseDate(4)).throw("value must be of string type, got number");
    expect(() => parseDate(4.1)).throw("value must be of string type, got number");
  });
});

// SPECS FOR FORMATTERS ============================================================================
describe("formatString()", function () {
  it("should format undefined as ''", function () {
    expect(formatString(undefined)).eql("");
  });

  it("should keep strings", function () {
    expect(formatString("foo")).eql("foo");
    expect(formatString(" foo ")).eql(" foo ");
  });

  it("should throw for other types", function () {
    expect(() => formatString(null)).throw("value must be of string type, got object");
    expect(() => formatString(4)).throw("value must be of string type, got number");
  });
});

describe("formatInteger()", function () {
  it("should format undefined as ''", function () {
    expect(formatInteger(undefined)).eql("");
  });

  it("should keep strings", function () {
    expect(formatInteger("42")).eql("42");
  });

  it("should format valid integers", function () {
    expect(formatInteger(42)).eql("42");
  });

  it("should throw for invalid integers", function () {
    expect(() => formatInteger(42.1)).throw("invalid integer value: 42.1");
  });

  it("should throw for other types", function () {
    expect(() => formatInteger(null)).throw("value must be of integer type, got object");
    expect(() => formatInteger({})).throw("value must be of integer type, got object");
  });
});

describe("formatFloat()", function () {
  it("should format undefined as ''", function () {
    expect(formatFloat(undefined)).eql("");
  });

  it("should keep strings", function () {
    expect(formatFloat("42.1")).eql("42.1");
  });

  it("should format valid floats", function () {
    expect(formatFloat(42)).eql("42");
    expect(formatFloat(42.1)).eql("42.1");
  });

  it("should throw for other types", function () {
    expect(() => formatFloat(null)).throw("value must be of float type, got object");
    expect(() => formatFloat({})).throw("value must be of float type, got object");
  });
});

describe("formatDate()", function () {
  it("should format undefined as ''", function () {
    expect(formatDate(undefined)).eql("");
  });

  it("should keep strings", function () {
    expect(formatDate("2015-01-02")).eql("2015-01-02");
  });

  it("should format valid dates by passed format", function () {
    expect(formatDate(new Date("2015-01-02"), "YYYY-MM-DD")).eql("2015-01-02");
    expect(formatDate(new Moment("2015-01-02"), "YYYY-MM-DD")).eql("2015-01-02");
    expect(formatDate(new Date("2015-01-02"), "DD/MM/YYYY")).eql("02/01/2015");
    expect(formatDate(new Moment("2015-01-02"), "DD/MM/YYYY")).eql("02/01/2015");
  });

  it("should use ISO 8601 as default format", function () {
    expect(formatDate(new Date("2015-01-02T12:12:12"))).eql("2015-01-02T12:12:12");
    expect(formatDate(new Moment("2015-01-02T12:12:12"))).eql("2015-01-02T12:12:12");
  });

  // MomentJS fails to parse Moment(new Date(...), format) case even when Date() really satisfies that format. Bug IMO
  it("should not complain about format mismatch in case of extra data", function () {
    expect(formatDate(new Date("2015-01-02 12:12:12"), "YYYY-MM-DD")).eql("2015-01-02");
    expect(formatDate(new Moment("2015-01-02 12:12:12"), "YYYY-MM-DD")).eql("2015-01-02");
  });

  it("should throw for other types", function () {
    expect(() => formatDate(null)).throw("value must be of Moment type, got object");
    expect(() => formatDate(42)).throw("value must be of Moment type, got number");
  });
});
