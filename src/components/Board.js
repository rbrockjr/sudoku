import "./Board.css";
import Box from "./Box";
import ColorChainSVG from "./ColorChainSVG";
import DecoratorsSVG from "./DecoratorsSVG";
import NiceLoopSVG from "./NiceLoopSVG";

function Board() {
  const boxes = [];
  for (let box = 0; box < 9; box++) {
    boxes.push(<Box box={box} key={box} />);
  }

  return (
    <div className="Board">
      <ColorChainSVG />
      <DecoratorsSVG />
      <NiceLoopSVG />
      {boxes}
    </div>
  );
}

export default Board;
