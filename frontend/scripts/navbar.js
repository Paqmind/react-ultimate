$(document).ready(function () {
  "use strict";

  var hideHeaderOnScrollDown = function() {
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var delay = 250;
    var navbarHeight = $header.outerHeight();

    $(window).scroll(function (event) {
      didScroll = true;
    });

    setInterval(function () {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, delay);

    function hasScrolled() {
      var st = $(window).scrollTop();

      // Make sure they scroll more than delta
      if (Math.abs(lastScrollTop - st) <= delta) return;

      // If they scrolled down and are past the navbar, add class .navbar-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight) {
        $header.removeClass("navbar-down").addClass("navbar-up");
      } else {
        if (st + $(window).height() < $(document).height()) {
          $header.removeClass("navbar-up").addClass("navbar-down");
        }
      }
      lastScrollTop = st;
    }
  };

  var collapseHeaderCollapseMenuOnClickOnLink = function() {
    $(document).on('click', "#page-header .navbar-collapse.in", function(event) {
      if ($(event.target).is('a')) {
        $menu.collapse('hide');
      }
    });
  };

  var collapseHeaderCollapseMenuOnClickOutOfMenu = function() {
    $(document).mouseup(function (event) {
      if (!$menu.is(event.target) // if the target of the click isn't the container...
          && $menu.has(event.target).length === 0) { // ... nor a descendant of the container
        $menu.collapse('hide');
      }
    });
  };

  var $header = $("#page-header");
  if ($header.length) {
    hideHeaderOnScrollDown();
    var $menu = $header.find(".navbar-collapse");
    if ($menu.length) {
      collapseHeaderCollapseMenuOnClickOnLink();
      collapseHeaderCollapseMenuOnClickOutOfMenu();
    }
  }
});
