import { useContext } from "react";
import RoundButton from "./RoundButton";
import { CELL_CLICK_MODES } from "../util/constants";
import "./ColorChainMenu.css";
import { ChainContext } from "../util/chainContext";
import { GlobalContext } from "../util/globalContext";
import loopImg from '../images/loop.png';

const ColorChainMenu = () => {
  const globalContext = useContext(GlobalContext);
  const globalState = globalContext.state;
  const chainContext = useContext(ChainContext);
  const { state, clearMarks, setColorChainSet, setNiceLoopMode } = chainContext;

  const loopButtonStyle = {
    backgroundImage: `url(${loopImg})`, 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: '6px 6px',
    backgroundSize: '80%' 
  };

  let loopButton = <div style={loopButtonStyle}>&nbsp;</div>

  return (
    <div className="ColorChainMenu">
      <RoundButton
        secondaryClass="set1"
        content=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 0
        }
        buttonClick={() => setColorChainSet(0)}
        key={101}
      />
      <RoundButton
        secondaryClass="set2"
        content=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 1
        }
        buttonClick={() => setColorChainSet(1)}
        key={102}
      />
      <RoundButton
        secondaryClass="set3"
        content=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 2
        }
        buttonClick={() => setColorChainSet(2)}
        key={103}
      />
      <RoundButton
        secondaryClass="set4"
        content=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 3
        }
        buttonClick={() => setColorChainSet(3)}
        key={104}
      />
      <RoundButton
        secondaryClass="set5"
        content=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 4
        }
        buttonClick={() => setColorChainSet(4)}
        key={105}
      />
      <RoundButton
        secondaryClass="set6"
        content=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 5
        }
        buttonClick={() => setColorChainSet(5)}
        key={106}
      />
      <RoundButton
        secondaryClass="nice"
        content={loopButton}
        active={globalState.cellClickMode === CELL_CLICK_MODES.LOOP}
        buttonClick={() => setNiceLoopMode()}
        key={107}
      />
      <RoundButton
        content="C"
        animatePress={true}
        buttonClick={() => clearMarks()}
        key={108}
      />
    </div>
  );
};

export default ColorChainMenu;
