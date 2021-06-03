import "./ExperimentalMenu.css";
import { useContext } from "react";
import RoundButton from "./RoundButton";
import { BoardContext } from "../util/boardContext";
import { findDependentCells, removeCandidateFromString } from "../util/cellUtil";
import { doCrossHatching, doHouseClaims, doSoloCells, doSubset, doSolve } from "../util/solveUtil";

const ExperimentalMenu = (props) => {
  const boardContext = useContext(BoardContext);

  if (!props.dummy) return null;

  return (
    <div className="ExperimentalMenu">
      <RoundButton
        content="VE"
        buttonClick={() =>
          doVeryEasy(
            boardContext.state.board, 
            boardContext.dispatch
          )
        }
        key={"DO1"}
      />
      <RoundButton
        content="E"
        buttonClick={() =>
          doEasy(
            boardContext.state.board,
            boardContext.dispatch
          )
        }
        key={"DO2"}
      />
      <RoundButton
        content="M"
        buttonClick={() =>
          doMedium(
            boardContext.state.board,
            boardContext.dispatch
          )
        }
        key={"DM4"}
      />
      <RoundButton
        content="H"
        buttonClick={() =>
          doHard(
            boardContext.state.board,
            boardContext.dispatch
          )
        }
        key={"DO4"}
      />
      <RoundButton
        content="BF"
        buttonClick={() =>
          startSolution(
            boardContext.state.board,
            boardContext.dispatch
          )
        }
        key={"DO5"}
      />
    </div>
  );
};

const genCellCandies = (cellId, board) => {
  let notes = "123456789";
  const deps = findDependentCells(cellId, board);
  deps.forEach((cell) => {
    if (cell && cell.value) {
      notes = removeCandidateFromString(cell.value, notes)
    }
  });
  return notes;
}

// Very easy = cells that can be easily seen with crosshatching
const doVeryEasy = (board, dispatch) => {

  // Set candidates
  const newBoard = board.map((cell, id) => ({
    ...cell,
    notes: cell.value ? "" : cell.notes ? cell.notes : genCellCandies(id, board)
  }));

  const newBoard2 = doCrossHatching(newBoard);
  
  if (newBoard2 && dispatch) {
    dispatch({
      type: "SET_BOARD",
      board: newBoard2,
      undoStates: [],
    });
    return true;
  } else {
    console.log("No very easy changes found.");
    return false;
  }
};

// Easy = solo candidate cells
const doEasy = (board, dispatch) => {
  const newBoard = doSoloCells(board);
  if (newBoard && dispatch) {
    dispatch({
      type: "SET_BOARD",
      board: newBoard,
      undoStates: [],
    });
    return true;
  } else {
    console.log("No easy changes found.");
    return false;
  }
}

// Medium = process candidate claims
const doMedium = (board, dispatch) => {
  const newBoard = doHouseClaims(board);
  if (newBoard && dispatch) {
    dispatch({
      type: "SET_BOARD",
      board: newBoard,
      undoStates: [],
    });
    return true;
  } else {
    console.log("No medium changes found.");
    return false;
  }
}

const doHard = (board, dispatch) => {
  const newBoard = doSubset(board);
  if (newBoard && dispatch) {
    dispatch({
      type: "SET_BOARD",
      board: newBoard,
      undoStates: [],
    });
    return true;
  } else {
    console.log("No hard changes found.");
    return false;
  }
};


const startSolution = (board, dispatch) => {
  if (!doVeryEasy(board, dispatch)) {
    if (!doEasy(board, dispatch)) {
      if (!doMedium(board, dispatch)) {
        if (!doHard(board, dispatch)) {
          console.log("That's all folks!");
          const solutions = doSolve(board, 0, "Blah");
          if (solutions.length > 0) {
            dispatch({
              type: "SET_BOARD",
              board: solutions[0],
              undoStates: [],
            });
            if (solutions.length > 1) {
              console.log("Multiple solutions found.");
              console.log(solutions);
            }
          }
        }
      }
    }
  }
};

export default ExperimentalMenu;
