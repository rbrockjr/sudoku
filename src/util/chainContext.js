import { createContext, useContext, useReducer, useState } from "react";
import { areCellsDependent, getCellClaims } from "./cellUtil";
import { CELL_CLICK_MODES } from "./constants";
import { GlobalContext } from "./globalContext";

const SET_COLOR_SET = "SET_COLOR_SET";
const SET_COLOR_CHAIN = "SET_COLOR_CHAIN";
const SET_NICE_LOOP = "SET_NICE_LOOP";
const CLEAR_MARKS = "CLEAR_MARKS";

const chainReducer = (state, action) => {
  switch (action.type) {
    case SET_COLOR_SET: {
      return {
        ...state,
        colorChainSet: action.set,
      };
    }
    case SET_COLOR_CHAIN: {
      return {
        ...state,
        colorChain: action.colorChain,
      };
    }
    case SET_NICE_LOOP: {
      return {
        ...state,
        niceLoop: action.niceLoop,
      };
    }
    case CLEAR_MARKS: {
      return {
        ...state,
        colorChain: [],
        niceLoop: []
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const initialState = {
  colorChain: Array(81).fill(null),
  colorChainSet: 0,
  niceLoop: []
};

const ChainContext = createContext();

const ChainProvider = ({ children }) => {
  const globalContext = useContext(GlobalContext);
  const { setCellClickMode } = globalContext;
  const { cellClickMode } = globalContext.state;

  const [state, dispatch] = useReducer(chainReducer, initialState);

  const setColorChainSet = (set) => {
    if (cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN) {
      if (set === state.colorChainSet) {
        dispatch({
          type: SET_COLOR_CHAIN,
          colorChain: state.colorChain.map((cell) => (cell && cell.set === set) ? null : cell),
        });
      }
    } else {
      setCellClickMode(CELL_CLICK_MODES.COLOR_CHAIN);
    }

    dispatch({
      type: SET_COLOR_SET,
      set,
    });
  };

  const setColorChainCell = (cellId) => {
    const chain = setCell(cellId, state.colorChainSet, state.colorChain);
    if (chain) {
      dispatch({
        type: SET_COLOR_CHAIN,
        colorChain: chain,
      });
    }
  };

  const setNiceLoopMode = () => {
    if (cellClickMode === CELL_CLICK_MODES.LOOP) {
      dispatch({
        type: SET_NICE_LOOP,
        niceLoop: state.niceLoop.length > 0 ? state.niceLoop.slice(0, state.niceLoop.length - 1) : []
      });
    } else {
      setCellClickMode(CELL_CLICK_MODES.LOOP);
    }
  };

  const setNiceLoopCell = (cellId, board) => {
    if (state.niceLoop.length > 0) {
      const lastItem = state.niceLoop[state.niceLoop.length - 1];
      if (cellId === lastItem.cellId) {
        handleNiceLoopClickOnLastItem(lastItem, state.niceLoop, board, dispatch);
      } else {
        handleNiceLoopClickOnNewCell(cellId, lastItem, state.niceLoop, board, dispatch);
      }
    } else {
      handleNiceLoopInit(cellId, board, dispatch);
    }
  }

  const clearMarks = () => {
    dispatch({
      type: CLEAR_MARKS
    });
  };

  const value = { state, dispatch, clearMarks, setColorChainSet, setColorChainCell, setNiceLoopMode, setNiceLoopCell };
  return (
    <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
  );
};


const handleNiceLoopClickOnLastItem = (item, loop, board, dispatch) => {
  let newItem = null;
  if (loop.length > 1) {
    const prevItem = loop[loop.length - 2];
    newItem = getNextNiceLoopLink(prevItem, item, getMatchingCandidatePool(board[prevItem.cellId].notes, board[item.cellId].notes), board); 
  }
  dispatch({
    type: SET_NICE_LOOP,
    niceLoop: loop.filter((cell) => cell.cellId !== item.cellId).concat(newItem ? [newItem] : [])
  });
}

const handleNiceLoopClickOnNewCell = (cellId, fromItem, loop, board, dispatch) => {
  if (loop.filter((item) => item.cellId === cellId).length === 0) {    
    if (areCellsDependent(fromItem.cellId, cellId)) {
      const  newItem = getNextNiceLoopLink(fromItem, {cellId}, getMatchingCandidatePool(board[fromItem.cellId].notes, board[cellId].notes), board);
      if (newItem) {
        dispatch({
          type: SET_NICE_LOOP,
          niceLoop: loop.concat(newItem)
        });
      }
    }
  }
}

const handleNiceLoopInit = (cellId, board, dispatch) => {    
  if (board[cellId].notes && board[cellId].notes.length > 0) {
    dispatch({
      type: SET_NICE_LOOP,
      niceLoop: [{cellId}]
    });
  }
}

const getNextNiceLoopLink = (fromItem, toItem, candidatePool, board) => {
  const lastIndex = candidatePool.findIndex((item) => (item.candidate === toItem.candidate && item.weak === toItem.weak));
  if (candidatePool.length > lastIndex + 1) {
    const item = {
      ...toItem,
      ...candidatePool[lastIndex + 1]
    }
    if (isNiceLoopLinkValid(fromItem, item, board)) {
      return item;
    } else {
      return getNextNiceLoopLink(fromItem, item, candidatePool, board);
    }
  }

  return null;
}

const getMatchingCandidatePool = (notes1, notes2) => {
  const matches = notes1 && notes2 ? notes1.match(new RegExp('[' + notes2 + ']', 'g')) : null;
  if (matches) {
    const strongPool = matches.map((candidate) => ({
      candidate
    }));
    const weakPool = matches.map((candidate) => ({
      candidate,
      weak: true
    }));
    return strongPool.concat(weakPool);
  }
  return [];
}

const isNiceLoopLinkValid = (fromItem, toItem, board) => {
  if (!toItem.weak) {
    if (fromItem.candidate !== toItem.candidate || fromItem.weak) {
      // Check for strong link
      return true;
    }
  } else {
    if (fromItem.candidate === toItem.candidate && !fromItem.weak) {
      return true;
    } else if (fromItem.candidate !== toItem.candidate && board[fromItem.cellId].notes.length === 2) {
      return true;
    }
  }
  return false;
}

const setCell = (cellId, set, chain) => {
  let update = false;
  
  const newChain = [...chain];
  if (newChain[cellId]) {
    if (newChain[cellId].set === set) {
      newChain[cellId] = null;
      update = true;
    }
  } else {
    const mateCheck = colorChainMateCheck(getCellClaims(cellId), set, chain);
    if (
      mateCheck.rowCnt < 2 &&
      mateCheck.colCnt < 2 &&
      mateCheck.sqCnt < 2 &&
      (mateCheck.rowCnt === 1 ||
        mateCheck.colCnt === 1 ||
        mateCheck.sqCnt === 1 ||
        mateCheck.total === 0)
    ) {
      update = true;
    }

    if (update) {
      newChain[cellId] = {
        set,
        type: mateCheck.type === 0 ? 1 : 0,
      };
    }
  }

  return update ? newChain : null;
};

const colorChainMateCheck = (cellClaims, set, chain) => {
  return chain.reduce((acc, cell, id) => {
    if (cell && cell.set === set) {
      const claims = getCellClaims(id);
      const rowMatch = claims.row === cellClaims.row;
      const colMatch = claims.col === cellClaims.col;
      const sqMatch = claims.box === cellClaims.box;
      acc.rowCnt += rowMatch ? 1 : 0;
      acc.colCnt += colMatch ? 1 : 0;
      acc.sqCnt += sqMatch ? 1 : 0;
      acc.total++;
      acc.type = rowMatch || colMatch || sqMatch ? cell.type : acc.type;
    }
    return acc;
  }, {
    rowCnt: 0,
    colCnt: 0,
    sqCnt: 0,
    total: 0,
    type: 0
  });
}

export { ChainProvider, ChainContext };
