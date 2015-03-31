$(document).ready(function () {
  "use strict";

  var collapseHeaderCollapseMenuOnClickOnLink = function () {
    $(document).on('click', "#page-header .navbar-collapse.in", function (event) {
      if ($(event.target).is('a')) {
        $menu.collapse('hide');
      }
    });
  };

  var collapseHeaderCollapseMenuOnClickOutOfMenu = function () {
    $(document).mouseup(function (event) {
      if (!$menu.is(event.target) // if the target of the click isn't the container...
          && $menu.has(event.target).length === 0) { // ... nor a descendant of the container
        $menu.collapse('hide');
      }
    });
  };

  var $header = $("#page-header");
  if ($header.length) {
    var $menu = $header.find(".navbar-collapse");
    if ($menu.length) {
      collapseHeaderCollapseMenuOnClickOnLink();
      collapseHeaderCollapseMenuOnClickOutOfMenu();
    }
  }
});
