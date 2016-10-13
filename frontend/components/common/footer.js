import React from "react"
import throttle from "lodash.throttle"
import {Component} from "./component"

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <p className="text-center">
          <a href="https://github.com/Paqmind/react-ultimate" target="_blank">
            <span className="fa fa-github fa-lg margin-right-xs"></span> github.com/Paqmind/react-ultimate
          </a>
        </p>
        <p className="text-center">
          <span className="fa fa-copyright margin-right-xs"></span> <a href="http://paqmind.com" target="_blank">paqmind.com</a>
        </p>
      </footer>
    )
  }
}
