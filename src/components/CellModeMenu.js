import "./CellModeMenu.css";
import { useContext } from "react";
import RoundButton from "./RoundButton";
import { CELL_CLICK_MODES } from "../util/constants";
import { BoardContext } from "../util/boardContext";
import { GlobalContext } from "../util/globalContext";
import box from '../images/box.png'; 
import pencil from '../images/pencil.png'; 
import undoImg from '../images/undo.png'; 
import redoImg from '../images/redo.png'; 

const CellModeMenu = () => {
  const globalContext = useContext(GlobalContext);
  const boardContext = useContext(BoardContext);
  const { state, setCellClickMode } = globalContext;
  const { undo, redo } = boardContext;

  const buttonClick = (mode) => {
    setCellClickMode(mode);
  };

  const undoClick = () => {
    undo();
  };

  const redoClick = () => {
    redo();
  };

  const valueButtonStyle = {
    backgroundImage: `url(${box})`, 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: '5px 5px',
    backgroundSize: '80%',
    fontSize: '24px',
    lineHeight: '46px'
  };

  const candidateButtonStyle = {
    backgroundImage: `url(${pencil})`, 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: '6px 4px',
    backgroundSize: '80%' 
  };

  const undoButtonStyle = {
    backgroundImage: `url(${undoImg})`, 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: '6px 7px',
    backgroundSize: '80%' 
  };

  const redoButtonStyle = {
    backgroundImage: `url(${redoImg})`, 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: '6px 7px',
    backgroundSize: '80%' 
  };

  let valueButton = <div style={valueButtonStyle}>{state.activeNumber}</div>
  let candidateButton = <div style={candidateButtonStyle}>&nbsp;</div>
  let undoButton = <div style={undoButtonStyle}>&nbsp;</div>
  let redoButton = <div style={redoButtonStyle}>&nbsp;</div>
  //valueButton = <img src={box} />

  return (
    <div className="CellModeMenu">
      <RoundButton
        content={valueButton}
        active={state.cellClickMode === CELL_CLICK_MODES.VALUE}
        buttonClick={() => buttonClick(CELL_CLICK_MODES.VALUE)}
        key={CELL_CLICK_MODES.VALUE}
      />
      <RoundButton
        content={candidateButton}
        active={state.cellClickMode === CELL_CLICK_MODES.NOTE}
        buttonClick={() => buttonClick(CELL_CLICK_MODES.NOTE)}
        key={CELL_CLICK_MODES.NOTE}
      />

      <RoundButton
        content={undoButton}
        animatePress={true}
        buttonClick={() => undoClick()}
        key={"UNDO"}
      />
      <RoundButton
        content={redoButton}
        animatePress={true}
        buttonClick={() => redoClick()}
        key={"REDO"}
      />
    </div>
  );
};

export default CellModeMenu;
