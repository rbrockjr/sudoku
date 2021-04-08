import './Board.css';
import Box from "./Box";
import ColorChainSVG from './ColorChainSVG';
import DecoratorsSVG from './DecoratorsSVG';

function Board() {
 
    const boxes = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            boxes.push(
                <Box startRow={row * 3} startCol={col * 3} key={row + ',' + col} />
            );
        }
    }

    return (
        <div className="Board">
            <ColorChainSVG />
            <DecoratorsSVG />
            {boxes}
        </div>
    )
}

export default Board;