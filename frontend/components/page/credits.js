import React from "react"
import DocumentTitle from "react-document-title"
import {Component, TextHolder} from "frontend/components/common"

export default class Credits extends Component {
  render() {
    return (
      <DocumentTitle title="React Ultimate :: Tech">
        <TextHolder>
          <section className="container page home">
            <h1>Credits</h1>

            <h3>Idea</h3>
            <ul>
              <li><a href="https://twitter.com/ivankleshnin">Ivan Kleshnin</a>, inspired by <a href="https://github.com/HenrikJoreteg/humanjs-sample-app">AmpersandJS</a> <em>Humans</em> web-app sample</li>
            </ul>

            <h3>Design &amp; Programming</h3>
            <ul>
              <li><a href="https://paqmind.com/">Paqmind</a> web development hub</li>
            </ul>

            <h3>Assets</h3>
            <ul>
              <li>Pictures of <em>Robots</em> by Zikri Kader and <em>Monsters</em> by Hrvoje Novakovic from <a href="http://robohash.org/">robohash.org</a></li>
              <li>Background pattern by Ste Patten from <a href="http://subtlepatterns.com/escheresque-dark/">subtlepatterns.com</a></li>
            </ul>
          </section>
        </TextHolder>
      </DocumentTitle>
    )
  }
}
