import {map} from "ramda";
import React from "react";
import {DeepComponent} from "frontend/components/common";
import MonsterSmallItem from "frontend/components/item/monster-small";


export default class MonsterUSACitizenIndex extends DeepComponent {
  render() {
    let items = this.props.items;
    if (!items.length) return false;
    return (
      <section className="container">
        <h1>All USA Citizens</h1>
        <div className="row">
          {map(item => <MonsterSmallItem item={item} key={item.id}/>, items)}
        </div>
      </section>
    );
  }
}
