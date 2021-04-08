import { useContext } from "react";
import RoundButton from "./RoundButton";
import { CELL_CLICK_MODES } from "../util/constants";
import "./ColorChainMenu.css";
import { ChainContext } from "../util/chainContext";
import { GlobalContext } from "../util/globalContext";

const ColorChainMenu = () => {
  const globalContext = useContext(GlobalContext);
  const globalState = globalContext.state;
  const { setCellClickMode } = globalContext;
  const chainContext = useContext(ChainContext);
  const { state, setColorChainSet } = chainContext;

  return (
    <div className="ColorChainMenu">
      <RoundButton
        secondaryClass="set1"
        buttonText=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 0
        }
        buttonClick={() => setColorChainSet(0)}
        key={101}
      />
      <RoundButton
        secondaryClass="set2"
        buttonText=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 1
        }
        buttonClick={() => setColorChainSet(1)}
        key={102}
      />
      <RoundButton
        secondaryClass="set3"
        buttonText=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 2
        }
        buttonClick={() => setColorChainSet(2)}
        key={103}
      />
      <RoundButton
        secondaryClass="set4"
        buttonText=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 3
        }
        buttonClick={() => setColorChainSet(3)}
        key={104}
      />
      <RoundButton
        secondaryClass="set5"
        buttonText=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 4
        }
        buttonClick={() => setColorChainSet(4)}
        key={105}
      />
      <RoundButton
        secondaryClass="set6"
        buttonText=""
        active={
          globalState.cellClickMode === CELL_CLICK_MODES.COLOR_CHAIN &&
          state.colorChainSet === 5
        }
        buttonClick={() => setColorChainSet(5)}
        key={106}
      />
      <RoundButton
        secondaryClass="nice"
        buttonText="N!"
        active={globalState.cellClickMode === CELL_CLICK_MODES.LOOP}
        buttonClick={() => setCellClickMode(CELL_CLICK_MODES.LOOP)}
        key={107}
      />
    </div>
  );
};

export default ColorChainMenu;
