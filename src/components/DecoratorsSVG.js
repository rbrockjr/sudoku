import React, { useContext } from 'react';
import './DecoratorsSVG.css';
import { CELL_SIZE } from '../util/constants';
import { BoardContext } from '../util/boardContext';
import { GlobalContext } from '../util/globalContext';

function DecoratorsSVG() {

  const getX = (col) => {
    let x = 38;
    x += col * CELL_SIZE;
    x += col * 2;
    x += Math.floor(col / 3) * 4;
    return x;
  }

  const getY = (row) => {
    let y = 38;
    y += row * CELL_SIZE;
    y += row * 2;
    y += Math.floor(row / 3) * 4;
    return y;
  }

  const generateDecorator = (x, y, size) => {
    const radius = size / 2;
    const items = [];
    items.push(<path d={'M' + (x-radius) + ' ' + y  + ' C' + (x-radius) + ' ' + y + ' ' + (x-radius) + ' ' + (y-radius) + ' ' + x + ' ' + (y-radius) + ' L' + (x-radius) + ' ' + (y-radius) + ' Z'} key={1} />);
    items.push(<path d={'M' + (x+radius) + ' ' + y  + ' C' + (x+radius) + ' ' + y + ' ' + (x+radius) + ' ' + (y-radius) + ' ' + x + ' ' + (y-radius) + ' L' + (x+radius) + ' ' + (y-radius) + ' Z'} key={2} />);
    items.push(<path d={'M' + (x-radius) + ' ' + y  + ' C' + (x-radius) + ' ' + y  + ' ' + (x-radius) + ' ' + (y+radius) + ' ' + x + ' ' + (y+radius) + ' L' + (x-radius) + ' ' + (y+radius) + ' Z'} key={3} />);
    items.push(<path d={'M' + (x+radius) + ' ' + y  + ' C' + (x+radius) + ' ' + y + ' ' + (x+radius) + ' ' + (y+radius) + ' ' + x + ' ' + (y+radius) + ' L' + (x+radius) + ' ' + (y+radius) + ' Z'} key={4} />);
    return items;
  }

  const globalContext = useContext(GlobalContext);
  const { activeNumber, highlightValues } = globalContext.state;

  const boardContext = useContext(BoardContext);
  const { findCellsByValue } = boardContext;

  if (highlightValues) {
    const items = findCellsByValue(activeNumber).map((cell) => {
      return generateDecorator(getX(cell.col), getY(cell.row), CELL_SIZE)
    });

    return (
        <svg className="DecoratorsSVG" viewBox="0 0 580 580"> 
          {items}
        </svg>
    )
  } else {
    return null;
  }
}

export default DecoratorsSVG;