// IMPORTS =========================================================================================
import React from "react";
import throttle from "lodash.throttle";
import Component from "frontend/component";

// EXPORTS =========================================================================================
export default class Headroom extends Component {
  static propTypes = {
    component: React.PropTypes.string,
    headroomClassNames: React.PropTypes.object,
  }

  static defaultProps = {
    component: "div",
    headroomClassNames: {
      visible: "navbar-down",
      hidden: "navbar-up"
    },
  }

  state = {
    className: ""
  }

  hasScrolled() {
    let topPosition = $(window).scrollTop();

    // Make sure users scroll more than delta
    if (Math.abs(this.lastScrollTop - topPosition) <= this.deltaHeight) return;

    // If they scrolled down and are past the navbar, add class `this.props.headroomClassNames.visible`.
    // This is necessary so you never see what is "behind" the navbar.
    if (topPosition > this.lastScrollTop && topPosition > this.elementHeight) {
      this.setState({className: this.props.headroomClassNames.hidden});
    }
    else {
      if ((topPosition + $(window).height()) < $(document).height()) {
        this.setState({className: this.props.headroomClassNames.visible});
      }
    }
    this.lastScrollTop = topPosition;
  }

  componentDidMount() {
    // Init options
    this.deltaHeight = this.props.deltaHeight ? this.props.deltaHeight : 5;
    this.delay = this.props.delay ? this.props.delay : 250;
    this.lastScrollTop = 0;
    this.elementHeight = document.getElementById(this.props.id).offsetHeight;

    // Add event handler on scroll
    window.addEventListener("scroll", throttle(this.hasScrolled, this.delay), false);

    // Update component"s className
    this.setState({className: this.props.headroomClassNames.visible});
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.hasScrolled, false);
  }

  render() {
    let component = this.props.component;
    let props = {id: this.props.id, className: this.props.className + " " + this.state.className};
    return React.createElement(
      component,
      props,
      this.props.children
    );
  }
}