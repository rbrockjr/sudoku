import "./Box.css";
import Cell from "./Cell";

const Box = (props) => {
  const cells = [];

  let cellId = Math.floor(props.box / 3) * 27 + (props.box % 3) * 3;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      cells.push(<Cell cellId={cellId} key={row + "," + col} />);
      cellId++;
    }
    cellId += 6;
  }

  return <div className="Box">{cells}</div>;
};

export default Box;
