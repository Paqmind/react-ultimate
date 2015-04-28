// IMPORTS =========================================================================================
import state from "frontend/common/state";
import loadIndex from "./load-index";

// ACTIONS =========================================================================================
export default function setOffset(offset) {
  console.debug("setOffset:", offset);

  let cursor = state.select("robots");
  let currentOffset = cursor.get("offset");

  if (offset != currentOffset) {
    let newOffset = offset;

    cursor.set("offset", newOffset);
    state.commit();

    loadIndex();
  }
}