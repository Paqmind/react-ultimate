// IMPORTS =========================================================================================
import React from "react";
import DocumentTitle from "react-document-title";
import Component from "frontend/component";

// EXPORTS =========================================================================================
export default class Tech extends Component {
  render() {
    return (
      <DocumentTitle title="React Ultimate :: Tech">
        <section className="container page home">
          <h1>Credits</h1>

          <h3>Idea</h3>
          <ul>
            <li><a href="https://twitter.com/ivankleshnin">Ivan Kleshnin</a>, inspired by <a href="https://github.com/HenrikJoreteg/humanjs-sample-app">AmpersandJS</a> "humans" web-app sample</li>
          </ul>

          <h3>Design &amp; Programming</h3>
          <ul>
            <li><a href="https://paqmind.com/">Paqmind</a> web development hub</li>
          </ul>

          <h3>Assets</h3>
          <ul>
            <li>Robots &amp; Monsters pictures authored by Zikri Kader and Hrvoje Novakovic at <a href="http://robohash.org/">robohash.org</a></li>
            <li>Background pattern by Ste Patten at <a href="http://subtlepatterns.com/escheresque-dark/">subtlepatterns.com</a></li>
          </ul>
        </section>
      </DocumentTitle>
    );
  }
}