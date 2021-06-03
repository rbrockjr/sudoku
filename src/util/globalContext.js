import { createContext, useReducer } from "react";
import { useToast } from "../toast/Toaster";
import { CELL_CLICK_MODES } from "./constants";

const SET_ACTIVE_NUMBER = "SET_ACTIVE_NUMBER";
const SET_CELL_CLICK_MODE = "SET_CELL_CLICK_MODE";
const SET_SOLVED_NUMBERS = "SET_SOLVED_NUMBERS";
const TOGGLE_HIGHLIGHT_VALUES = "TOGGLE_HIGHLIGHT_VALUES";
const TOGGLE_HIGHLIGHT_CANDIDATES = "TOGGLE_HIGHLIGHT_CANDIDATES";
const TOGGLE_HIGHLIGHT_CLAIMED_CELLS = "TOGGLE_HIGHLIGHT_CLAIMED_CELLS";

const globalReducer = (state, action) => {
  switch (action.type) {
    case SET_ACTIVE_NUMBER: {
      return {
        ...state,
        activeNumber: action.activeNumber,
      };
    }
    case SET_CELL_CLICK_MODE: {
      return {
        ...state,
        cellClickMode: action.mode,
      };
    }
    case SET_SOLVED_NUMBERS: {
      return {
        ...state,
        solvedNumbers: action.solvedNumbers,
      };
    }
    case TOGGLE_HIGHLIGHT_CLAIMED_CELLS: {
      return {
        ...state,
        highlightClaimedCells: !state.highlightClaimedCells
      };
    }
    case TOGGLE_HIGHLIGHT_VALUES: {
      return {
        ...state,
        highlightValues: !state.highlightValues
      };
    }
    case TOGGLE_HIGHLIGHT_CANDIDATES: {
      return {
        ...state,
        highlightCandidates: !state.highlightCandidates
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const initialState = {
  activeNumber: 1,
  cellClickMode: CELL_CLICK_MODES.VALUE,
  solvedNumbers: Array(9).fill(false),
  highlightValues: true,
  highlightCandidates: true,
  highlightClaimedCells: true
};

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);
  const { addToast } = useToast();

  const setActiveNumber = (n) => {
    dispatch({
      type: SET_ACTIVE_NUMBER,
      activeNumber: n,
    });
  };

  const setCellClickMode = (mode) => {
    dispatch({
      type: SET_CELL_CLICK_MODE,
      mode,
    });
  };

  const setSolvedNumbers = (board) => {
    const solvedNumbers = board
      .reduce((res, cell) => {
        if (cell.value) res[cell.value - 1] = (res[cell.value - 1] || 0) + 1;
        return res;
      }, Array(9).fill(0))
      .map((n) => n === 9);

    let update = false;
    let allSolved = true;
    solvedNumbers.forEach((val, i) => {
      if (val !== state.solvedNumbers[i]) {
        if (val) {
          addToast("The " + (i + 1) + "'s are complete.");
        }
        update = true;
      }
      if (!val) allSolved = false;
    });

    if (allSolved) {
      addToast("The puzzle is complete!");
    }

    if (update) {
      dispatch({
        type: SET_SOLVED_NUMBERS,
        solvedNumbers,
      });
    }
  };

  const toggleHighlightValues = () => {
    dispatch({
      type: TOGGLE_HIGHLIGHT_VALUES
    });
  };

  const toggleHighlightCandidates = () => {
    dispatch({
      type: TOGGLE_HIGHLIGHT_CANDIDATES
    });
  };
  
  const toggleHighlightClaimedCells = () => {
    dispatch({
      type: TOGGLE_HIGHLIGHT_CLAIMED_CELLS
    });
  };

  const value = {
    state,
    dispatch,
    setActiveNumber,
    setCellClickMode,
    setSolvedNumbers,
    toggleHighlightValues,
    toggleHighlightCandidates,
    toggleHighlightClaimedCells
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };
