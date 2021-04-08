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
    items.push(<path d={'M' + (x-radius) + ' ' + y  + ' C' + (x-radius) + ' ' + y + ' ' + (x-radius) + ' ' + (y-radius) + ' ' + x + ' ' + (y-radius) + ' L' + (x-radius) + ' ' + (y-radius) + ' Z'} />);
    items.push(<path d={'M' + (x+radius) + ' ' + y  + ' C' + (x+radius) + ' ' + y + ' ' + (x+radius) + ' ' + (y-radius) + ' ' + x + ' ' + (y-radius) + ' L' + (x+radius) + ' ' + (y-radius) + ' Z'} />);
    items.push(<path d={'M' + (x-radius) + ' ' + y  + ' C' + (x-radius) + ' ' + y  + ' ' + (x-radius) + ' ' + (y+radius) + ' ' + x + ' ' + (y+radius) + ' L' + (x-radius) + ' ' + (y+radius) + ' Z'} />);
    items.push(<path d={'M' + (x+radius) + ' ' + y  + ' C' + (x+radius) + ' ' + y + ' ' + (x+radius) + ' ' + (y+radius) + ' ' + x + ' ' + (y+radius) + ' L' + (x+radius) + ' ' + (y+radius) + ' Z'} />);
    return items;
  }

  const globalContext = useContext(GlobalContext);
  const { state } = globalContext;

  const {getCellValue} = useContext(BoardContext);

  const items = [];
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
        if (getCellValue(row, col) === state.activeNumber) {
            items.push(generateDecorator(getX(col), getY(row), CELL_SIZE));
        }
    }
  }  

  return (
      <svg className="DecoratorsSVG" viewBox="0 0 580 580"> 
        {items}
      </svg>
  )
}

export default DecoratorsSVG;