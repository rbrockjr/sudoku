import { useContext } from "react";
import { BoardContext } from "../util/boardContext";
import { GlobalContext } from "../util/globalContext";

const Settings = (props) => {
  
  const globalContext = useContext(GlobalContext);
  const { highlightValues, highlightCandidates, highlightClaimedCells } = globalContext.state;
  const { toggleHighlightValues, toggleHighlightCandidates, toggleHighlightClaimedCells } = globalContext;

  const boardContext = useContext(BoardContext);
  const { importBoard, loadRandomBoard } = boardContext;

  let importString = "";

  const doImport = () => {
    importBoard(importString);
  }

  const handleChange = (event) => {
    importString = event.target.value;
  }

  return (
    <>
        <form style={{width: 600}}>
          <fieldset>
            <legend>Puzzle Stuff</legend>
            <p>
              <label>Import Puzzle:
                <input
                  name="importString"
                  size="50"
                  onChange={handleChange}
                />
              </label>
              <button type="button" onClick={doImport}>
                Import
              </button>
            </p>
            <p>
              <button type="button" onClick={loadRandomBoard}>
                Load Random Puzzle
              </button>
            </p>
          </fieldset>
          <fieldset>
            <legend>Active Number Highlighting</legend>
              <input 
                name="highlightValues"
                type="checkbox"
                checked={highlightValues}
                onChange={toggleHighlightValues} 
              />
              <label htmlFor={"highlightValues"}>Values</label>
              <input 
                name="highlightCandidates"
                type="checkbox"
                checked={highlightCandidates}
                onChange={toggleHighlightCandidates} 
              />
              <label htmlFor={"highlightCandidates"}>Candidates</label>
              <input 
                name="highlightClaimed"
                type="checkbox"
                checked={highlightClaimedCells}
                onChange={toggleHighlightClaimedCells} 
              />
              <label htmlFor={"highlightClaimed"}>Claimed cells</label>
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

export default Settings;