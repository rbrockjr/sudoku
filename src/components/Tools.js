import { useContext } from "react";
import { BoardContext } from "../util/boardContext";
import { GlobalContext } from "../util/globalContext";
import { generateCandidates, sanityCheck } from "../util/solveUtil";

const Tools = (props) => {
  
  const globalContext = useContext(GlobalContext);
  const { highlightValues, highlightCandidates, highlightClaimedCells } = globalContext.state;
  const { toggleHighlightValues, toggleHighlightCandidates, toggleHighlightClaimedCells } = globalContext;

  const boardContext = useContext(BoardContext);
  const { state, setBoard } = boardContext;

  const setCandidates = () => {
    setBoard(generateCandidates(state.board));
  }

  const runSanityCheck = () => {
    sanityCheck(state.board);
  }

  return (
    <>
        <form style={{width: 600}}>
          <fieldset>
            <legend>Tool Stuff</legend>
            <p>
              <button type="button" onClick={setCandidates}>
                Set Candidates
              </button>
            </p>
            <p>
              <button type="button" onClick={runSanityCheck}>
                Sanity Check
              </button>
            </p>
          </fieldset>
        </form>
        <div className="footer">
          <button onClick={props.onClose}>
            Close
          </button>
        </div>

    </>
  );
}

export default Tools;