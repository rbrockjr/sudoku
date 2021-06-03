import { createContext, useContext, useReducer } from "react";
import { boards } from "../boards";
import {
  removeCandidateFromString,
  addCandidateToString,
  getCellClaims,
  isCellClaimed,
  areCellsDependent
} from "./cellUtil";
import { ChainContext } from "./chainContext";
import { CELL_CLICK_MODES } from "./constants";
import { GlobalContext } from "./globalContext";

const SET_BOARD = "SET_BOARD";
const UNDO_REDO = "UNDO_REDO";

const initialState = {
  board: Array(81).fill({}),
  undoStates: [],
  redoStates: [],
};

const boardReducer = (state, action) => {
  switch (action.type) {
    case SET_BOARD: {
      return {
        ...state,
        board: action.board,
        undoStates: action.undoStates,
        redoStates: [],
      };
    }
    case UNDO_REDO: {
      return {
        ...state,
        board: action.board,
        undoStates: action.undoStates,
        redoStates: action.redoStates,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const BoardContext = createContext();

const BoardProvider = ({ children }) => {
  const globalContext = useContext(GlobalContext);
  const chainContext = useContext(ChainContext);
  const { setColorChainCell, setNiceLoopCell } = chainContext;

  const [state, dispatch] = useReducer(boardReducer, initialState);

  const cellClicked = (cellId) => {
    switch (globalContext.state.cellClickMode) {
      case CELL_CLICK_MODES.VALUE:
        setCellValue(cellId);
        break;
      case CELL_CLICK_MODES.NOTE:
        toggleNoteFor(cellId);
        break;
      case CELL_CLICK_MODES.LOOP:
        setNiceLoopCell(cellId, state.board);
        break;
      default:
        setColorChainCell(cellId);
    }
  };

  const setCellValue = (cellId) => {
    const { activeNumber } = globalContext.state;

    if (!isCellClaimed(cellId, activeNumber, state.board)) {
      const board = updateBoardWithCellValue(
        cellId,
        state.board[cellId].value !== activeNumber ? activeNumber : "",
        state.board
      );

      dispatch({
        type: SET_BOARD,
        board: board,
        undoStates: genUndoStates(state.board),
      });

      globalContext.setSolvedNumbers(board);
    }
  };
  
  const findCellsByValue = (value) => {
    return state.board.reduce(
      (dep, cell, id) =>
        cell && cell.value === value ? dep = [...dep, getCellClaims(id)] : dep,
      []
    );
  };

  const initBoard = (init) => {
    const board = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        board.push({ value: init[row][col] });
      }
    }

    dispatch({
      type: SET_BOARD,
      board: board,
      undoStates: [],
    });
    globalContext.setSolvedNumbers(board);
  };

  const loadRandomBoard = () => {
    const rand = Math.random();
    const idx = Math.floor(boards.length * rand);
    initBoard(boards[idx]);
  };

  const importBoard = (str) => {
    if (str.length === 81) {
      const board = str.split('')
        .map((c) => parseInt(c))
        .map((value) => value > 0 ? { value } : {});
        
      dispatch({
        type: SET_BOARD,
        board: board,
        undoStates: [],
      });
      globalContext.setSolvedNumbers(board);
    }
  };

  const toggleNoteFor = (cellId) => {
    const { activeNumber } = globalContext.state;
    const cell = state.board[cellId];

    if (!cell.value) {
      let notes = "";
      if (cell.notes && cell.notes.match(activeNumber)) {
        notes = removeCandidateFromString(activeNumber, cell.notes);
      } else {
        notes = addCandidateToString(activeNumber, cell.notes);
      }

      dispatch({
        type: SET_BOARD,
        board: updateBoardWithNoteValue(cellId, notes, state.board),
        undoStates: genUndoStates(state.board),
      });
    }
  };

  const genUndoStates = (board) => {
    return [...state.undoStates, board.map((cell) => ({ ...cell }))];
  };

  const setBoard = (board) => {
    dispatch({
      type: SET_BOARD,
      board: board,
      undoStates: genUndoStates(state.board),
    });

    globalContext.setSolvedNumbers(board);
  };

  const undo = () => {
    if (state.undoStates.length > 0) {
      const board = state.undoStates[
        state.undoStates.length - 1
      ].map((cell) => ({ ...cell }));

      dispatch({
        type: UNDO_REDO,
        board: board,
        undoStates: state.undoStates.slice(0, state.undoStates.length - 1),
        redoStates: [state.board, ...state.redoStates],
      });

      globalContext.setSolvedNumbers(board);
    }
  };

  const redo = () => {
    if (state.redoStates.length > 0) {
      const board = state.redoStates[0].map((cell) => ({ ...cell }));

      dispatch({
        type: UNDO_REDO,
        board: board,
        undoStates: [...state.undoStates, state.board],
        redoStates: state.redoStates.slice(1),
      });

      globalContext.setSolvedNumbers(board);
    }
  };

  const value = {
    state,
    dispatch,
    importBoard,
    loadRandomBoard,
    findCellsByValue,
    cellClicked,
    setBoard,
    undo,
    redo,
  };
  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};

const updateBoardWithCellValue = (cellId, value, board) => {
  value = parseInt(value);
  return board.map((cell, id) => {
    return id === cellId
      ? { value }
      : areCellsDependent(id, cellId)
      ? removeCandidateFromCell(value, cell)
      : cell;
  });
};

const updateBoardWithNoteValue = (cellId, notes, board) => {
  return board.map((cell, id) => {
    return id === cellId ? { notes } : cell;
  });
};

const removeCandidateFromCell = (candidate, cell) => {
  return {
    ...cell,
    notes: cell.notes ? removeCandidateFromString(candidate, cell.notes) : "",
  };
};

export { BoardProvider, BoardContext };
