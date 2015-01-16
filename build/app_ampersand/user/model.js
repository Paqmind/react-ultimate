"use strict";

var Model = require("ampersand-model");

module.exports = Model.extend({
  type: "robot", // TODO: or typeAttribute???

  props: {
    id: ["string"],
    firstName: ["string", true, ""],
    lastName: ["string", true, ""],
    username: ["string"] },

  derived: {
    fullName: {
      deps: ["firstName", "lastName"],
      cache: true,
      fn: function () {
        return this.firstName + " " + this.lastName;
      }
    },

    initials: {
      deps: ["firstName", "lastName"],
      cache: true,
      fn: function () {
        return (this.firstName[0] + this.lastName[0]).toUpperCase();
      }
    }
  }
});