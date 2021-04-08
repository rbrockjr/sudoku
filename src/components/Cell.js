import "./Cell.css";
import { useContext } from "react";
import { BoardContext } from "../util/boardContext";
import { GlobalContext } from "../util/globalContext";
import { CELL_CLICK_MODES } from "../util/constants";
import Notes from "./Notes";
import { ChainContext } from "../util/chainContext";

const Cell = (props) => {
  const globalContext = useContext(GlobalContext);
  const chainContext = useContext(ChainContext);
  const boardContext = useContext(BoardContext);

  const { state } = globalContext;
  const {
    getCellValue,
    setCellValue,
    hasNoteFor,
    toggleNoteFor,
  } = boardContext;
  const { setColorChainCell } = chainContext;

  const hasNotes = () => {
    for (let i = 0; i < 9; i++) {
      if (hasNoteFor(props.row, props.col, i)) {
        return true;
      }
    }
  };

  const isClaimed = (cellRow, cellCol, getCellValue, activeNumber) => {
    for (let col = 0; col < 9; col++) {
      const cell = getCellValue(cellRow, col);
      if (col !== cellCol && cell === activeNumber) {
        return true;
      }
    }
    for (let row = 0; row < 9; row++) {
      const cell = getCellValue(row, cellCol);
      if (row !== cellRow && cell === activeNumber) {
        return true;
      }
    }
    const row1 = Math.floor(cellRow / 3) * 3;
    const col1 = Math.floor(cellCol / 3) * 3;
    for (let row = row1; row < row1 + 3; row++) {
      for (let col = col1; col < col1 + 3; col++) {
        const cell = getCellValue(row, col);
        if (row !== cellRow && col !== cellCol && cell === activeNumber) {
          return true;
        }
      }
    }
  };

  const cellClicked = (row, col) => {
    switch (state.cellClickMode) {
      case CELL_CLICK_MODES.VALUE:
        setCellValue(row, col);
        break;
      case CELL_CLICK_MODES.NOTE:
        toggleNoteFor(row, col);
        break;
      default:
        setColorChainCell(row, col);
    }
  };

  let className = "Cell";
  if (isClaimed(props.row, props.col, getCellValue, state.activeNumber)) {
    className += " claimed";
  }

  let contents = getCellValue(props.row, props.col);
  if (!contents && hasNotes()) {
    contents = <Notes row={props.row} col={props.col} />;
  }

  return (
    <div
      className={className}
      onClick={() => {
        cellClicked(props.row, props.col);
      }}
    >
      {contents}
    </div>
  );
};

export default Cell;
