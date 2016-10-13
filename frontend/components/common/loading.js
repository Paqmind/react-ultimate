import Class from "classnames"
import React from "react"
import DocumentTitle from "react-document-title"
import {branch} from "baobab-react/decorators"
import {Component} from "./component"

@branch({
  cursors: {
    ajaxQueue: ["ajaxQueue"]
  },
})
export default class Loading extends Component {
  static propTypes = {
    size: React.PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  }

  static defaultProps = {
    size: "md",
  }

  render() {
    let {ajaxQueue} = this.props

    if (ajaxQueue.length) {
      return (
        <div className="special-layer top-left">
          <div className={Class("gear", this.props.size)}>
            <i className="fa fa-cog fa-spin"></i>
          </div>
        </div>
      )
    } else {
      return <div/>
    }
  }
}
