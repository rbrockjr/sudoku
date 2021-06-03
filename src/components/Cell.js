import "./Cell.css";
import { useContext } from "react";
import { BoardContext } from "../util/boardContext";
import { GlobalContext } from "../util/globalContext";
import Notes from "./Notes";
import { isCellClaimed } from "../util/cellUtil";

const Cell = (props) => {
  const globalContext = useContext(GlobalContext);
  const boardContext = useContext(BoardContext);

  const { activeNumber, highlightClaimedCells } = globalContext.state;
  const { cellClicked } = boardContext;
  const { board } = boardContext.state;

  let className =
    "Cell" +
    (highlightClaimedCells && isCellClaimed(props.cellId, activeNumber, board)
      ? " claimed"
      : "");

  let contents = "";
  const cell = board[props.cellId];
  if (cell.value) {
    contents = cell.value;
  } else if (cell.notes) {
    contents = <Notes notes={cell.notes} />;
  }

  return (
    <div
      className={className}
      onClick={() => {
        cellClicked(props.cellId);
      }}
    >
      {contents}
    </div>
  );
};

export default Cell;
