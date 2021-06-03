import "./Notes.css";
import { useContext } from "react";
import { GlobalContext } from "../util/globalContext";

const Notes = (props) => {
  const globalContext = useContext(GlobalContext);
  const { activeNumber, highlightCandidates } = globalContext.state;

  const annotations = [];
  for (let i = 0; i < 9; i++) {
    const val = props.notes.match(i + 1) ? i + 1 : "";

    let className = "annotation";
    if (highlightCandidates && val === activeNumber) {
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
