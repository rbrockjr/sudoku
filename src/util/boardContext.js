import { createContext, useContext, useReducer } from "react";
import {
  findConflictCells,
  clearNotesFromClaimedCells,
  init9x9,
} from "./cellUtil";
import { GlobalContext } from "./globalContext";

const SET_BOARD = "SET_BOARD";
const SET_NOTES = "SET_NOTES";
const UNDO_REDO = "UNDO_REDO";

const boardReducer = (state, action) => {
  switch (action.type) {
    case SET_BOARD: {
      return {
        ...state,
        board: action.board,
        notes: action.notes,
        undoStates: action.undoStates,
        redoStates: [],
      };
    }
    case SET_NOTES: {
      return {
        ...state,
        notes: action.notes,
        undoStates: action.undoStates,
        redoStates: [],
      };
    }
    case UNDO_REDO: {
      return {
        ...state,
        board: action.board,
        notes: action.notes,
        undoStates: action.undoStates,
        redoStates: action.redoStates,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const initialState = {
  board: init9x9(""),
  notes: init9x9(Array(9).fill(false)),
  undoStates: [],
  redoStates: [],
};

const BoardContext = createContext();

const BoardProvider = ({ children }) => {
  const globalContext = useContext(GlobalContext);

  const [state, dispatch] = useReducer(boardReducer, initialState);

  const getCellValue = (row, col) => {
    return state.board[row][col];
  };

  const setCellValue = (row, col) => {
    let update = true;
    const { activeNumber } = globalContext.state;
    const newBoard = state.board.map((r) => r.map((c) => c));
    const newNotes = state.notes.map((r) => r.map((c) => c));

    if (newBoard[row][col] === activeNumber) {
      newBoard[row][col] = "";
    } else {
      if (!findConflictCells(row, col, activeNumber, newBoard)) {
        newBoard[row][col] = activeNumber;
        clearNotesFromClaimedCells(row, col, activeNumber, newNotes);
      } else {
        update = false;
      }
    }

    if (update) {
      dispatch({
        type: SET_BOARD,
        board: newBoard,
        notes: newNotes,
        undoStates: genUndoStates(newBoard, newNotes, state.undoStates),
      });
      globalContext.setSolvedNumbers(newBoard);
    }
  };

  const initBoard = (board) => {
    dispatch({
      type: SET_BOARD,
      board: board,
      notes: init9x9(Array(9).fill(false)),
      undoStates: [],
    });
    globalContext.setSolvedNumbers(board);
  };

  const hasNoteFor = (row, col, pos) => {
    return state.notes[row][col][pos];
  };

  const toggleNoteFor = (row, col) => {
    const { activeNumber } = globalContext.state;
    const newNotes = cloneNotes(state.notes);
    newNotes[row][col][activeNumber - 1] = !newNotes[row][col][
      activeNumber - 1
    ];

    dispatch({
      type: SET_NOTES,
      notes: newNotes,
      undoStates: genUndoStates(state.board, newNotes, state.undoStates),
    });
  };

  const undo = () => {
    if (state.undoStates.length > 0) {
      const board = cloneBoard(
        state.undoStates[state.undoStates.length - 1].board
      );
      const notes = cloneNotes(
        state.undoStates[state.undoStates.length - 1].notes
      );
      const undoStates = cloneUndoRedoArray(state.undoStates);
      const redoStates = cloneUndoRedoArray(state.redoStates);
      undoStates.length--;
      redoStates.unshift({
        board: cloneBoard(state.board),
        notes: cloneNotes(state.notes),
      });

      dispatch({
        type: UNDO_REDO,
        board,
        notes,
        undoStates,
        redoStates,
      });

      globalContext.setSolvedNumbers(board);
    }
  };

  const redo = () => {
    if (state.redoStates.length > 0) {
      const board = cloneBoard(state.redoStates[0].board);
      const notes = cloneNotes(state.redoStates[0].notes);
      const undoStates = cloneUndoRedoArray(state.undoStates);
      const redoStates = cloneUndoRedoArray(state.redoStates);
      undoStates[undoStates.length] = {
        board: cloneBoard(state.board),
        notes: cloneNotes(state.notes),
      };
      redoStates.shift();

      dispatch({
        type: UNDO_REDO,
        board,
        notes,
        undoStates,
        redoStates,
      });

      globalContext.setSolvedNumbers(board);
    }
  };

  const value = {
    state,
    dispatch,
    initBoard,
    getCellValue,
    setCellValue,
    hasNoteFor,
    toggleNoteFor,
    undo,
    redo,
  };
  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};

const genUndoStates = (board, notes, undo) => {
  const undoStates = cloneUndoRedoArray(undo);
  undoStates[undoStates.length] = {
    board: cloneBoard(board),
    notes: cloneNotes(notes),
  };
  return undoStates;
};

const cloneBoard = (b) => {
  return b.map((x) => x.map((y) => y));
};

const cloneNotes = (n) => {
  return n.map((x) => x.map((y) => y.map((z) => z)));
};

const cloneUndoRedoArray = (a) => {
  return a.map((s) => {
    return {
      board: cloneBoard(s.board),
      notes: cloneNotes(s.notes),
    };
  });
};

export { BoardProvider, BoardContext };
