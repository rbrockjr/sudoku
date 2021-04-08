import './Box.css';
import Cell from './Cell';

const Box = (props) => {
    const cells = [];
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            cells.push(<Cell row={props.startRow + row} col={props.startCol + col} key={row + ',' + col} />);
        }
    }

    return (
        <div className="Box">{cells}</div>
    )
};

export default Box;