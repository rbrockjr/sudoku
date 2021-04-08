import "./Notes.css";
import { useContext } from "react";
import { BoardContext } from "../util/boardContext";
import { GlobalContext } from "../util/globalContext";

const Notes = (props) => {
  const globalContext = useContext(GlobalContext);
  const boardContext = useContext(BoardContext);
  const { state } = globalContext;
  const { hasNoteFor } = boardContext;

  const annotations = [];
  for (let i = 0; i < 9; i++) {
    const val = hasNoteFor(props.row, props.col, i) ? i + 1 : "";

    let className = "annotation";
    if (val === state.activeNumber) {
      className += " claimed";
    }
    annotations.push(
      <div className={className} key={i}>
        {val}
      </div>
    );
  }

  return <div className="Notes">{annotations}</div>;
};

export default Notes;
