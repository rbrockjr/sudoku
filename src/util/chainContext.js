import { createContext, useContext, useReducer } from "react";
import { init9x9, colorChainMateCheck } from "./cellUtil";
import { CELL_CLICK_MODES } from "./constants";
import { GlobalContext } from "./globalContext";

const SET_COLOR_SET = 'SET_COLOR_SET';
const SET_COLOR_CHAIN = 'SET_COLOR_CHAIN';

const chainReducer = (state, action) => {
  switch (action.type) {
    case SET_COLOR_SET: {
      return {
        ...state,
        colorChainSet: action.set
      }
    }
    case SET_COLOR_CHAIN: {
       return {
        ...state,
        colorChain: action.colorChain
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const initialState = {
  colorChain: init9x9(null),
  colorChainSet: 0
}

const ChainContext = createContext();

const ChainProvider = ({children}) => {
  const globalContext = useContext(GlobalContext);
  const globalState = globalContext.state;

  const [state, dispatch] = useReducer(
      chainReducer,
      initialState
  );
  
  const setColorChainSet = (set) => {
    if (globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN) {
      if (set === state.colorChainSet) {
        const colorChain = JSON.parse(JSON.stringify(state.colorChain));
        colorChain.forEach((rowCells, row) => {
          rowCells.forEach((cell, col) => {
              if (cell && cell.set === set) {
                  colorChain[row][col] = null;
              }
          });
        });

        dispatch({
            type: SET_COLOR_CHAIN,
            colorChain
        });
      }
    } else {
      globalContext.setCellClickMode(CELL_CLICK_MODES.COLOR_CHAIN);
    }

    dispatch({
        type: SET_COLOR_SET,
        set
    });
  }
  
  const setColorChainCell = (row, col) => {
    const chain = setCell(row, col, state.colorChainSet, state.colorChain);
    if (chain) {
        dispatch({
            type: SET_COLOR_CHAIN,
            colorChain: chain
        })
    }
  }

  const value = {state, dispatch, setColorChainSet, setColorChainCell};
  return <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
}

const setCell = (row, col, set, chain) => {
  let update = false;
  const newChain = JSON.parse(JSON.stringify(chain));
  if (newChain[row][col]) {
    if (newChain[row][col].set === set) {
      newChain[row][col] = null;
      update = true;
    }
  } else {
    
    const mateCheck = colorChainMateCheck(row, col, set, chain);
    if (mateCheck.rowCnt < 2 && mateCheck.colCnt < 2 && mateCheck.sqCnt < 2 && 
        (mateCheck.rowCnt === 1 || mateCheck.colCnt === 1 || mateCheck.sqCnt === 1 || mateCheck.total === 0)) {
      update = true;
    }

    if (update) {
      newChain[row][col] = {
        set,
        type: mateCheck.type === 0 ? 1 : 0
      };
    }
  }
  
  return update ? newChain : null;
}

export {ChainProvider, ChainContext};