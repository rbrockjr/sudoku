import React, { useContext } from "react";
import { ChainContext } from "../util/chainContext";
import "./ColorChainSVG.css";

function ColorChainSVG() {
  const getX = (col) => {
    let x = 38;
    x += col * 60;
    x += col * 2;
    x += Math.floor(col / 3) * 4;
    return x;
  };

  const getY = (row) => {
    let y = 38;
    y += row * 60;
    y += row * 2;
    y += Math.floor(row / 3) * 4;
    return y;
  };

  const determineSetClass = (cell) => {
    let set = cell.type === 0 ? "set1a" : "set1b";
    if (cell.set === 1) {
      set = cell.type === 0 ? "set2a" : "set2b";
    }
    if (cell.set === 2) {
      set = cell.type === 0 ? "set3a" : "set3b";
    }
    if (cell.set === 3) {
      set = cell.type === 0 ? "set4a" : "set4b";
    }
    if (cell.set === 4) {
      set = cell.type === 0 ? "set5a" : "set5b";
    }
    if (cell.set === 5) {
      set = cell.type === 0 ? "set6a" : "set6b";
    }
    return set;
  };

  const rowMateCheck = (row, col, set, chain) => {
    return chain[row].reduce((acc, cur, iCol) => {
      if (col !== iCol && cur && cur.set === set) {
        acc = { row, col: iCol };
      }
      return acc;
    }, null);
  };

  const colMateCheck = (row, col, set, chain) => {
    return chain.reduce((acc, cur, iRow) => {
      const cell = cur[col];
      if (row !== iRow && cell && cell.set === set) {
        acc = { row: iRow, col };
      }
      return acc;
    }, null);
  };

  const squareMateCheck = (row, col, set, chain) => {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        const cell = chain[r][c];
        if (row !== r && col !== c && cell && cell.set === set) {
          return {
            row: r,
            col: c,
          };
        }
      }
    }
    return null;
  };

  const generateLine = (x1, y1, x2, y2, className) => {
    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={className}
        key={x1 + "-" + y1 + "-" + x2 + "-" + y2}
      />
    );
  };

  const chainContext = useContext(ChainContext);
  const { state } = chainContext;

  const items = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = state.colorChain[row][col];
      if (cell) {
        const x = getX(col);
        const y = getY(row);
        const setClass = determineSetClass(cell);
        items.push(
          <circle
            cx={x}
            cy={y}
            r="25"
            className={setClass}
            opacity="0.6"
            key={row + "-" + col}
          />
        );

        // Do line connectors
        let match = rowMateCheck(row, col, cell.set, state.colorChain);
        if (match && match.col < col) {
          const xAdj = 25;
          items.push(
            generateLine(
              x - xAdj,
              y,
              getX(match.col) + xAdj,
              getY(match.row),
              setClass
            )
          );
        }

        match = colMateCheck(row, col, cell.set, state.colorChain);
        if (match && match.row < row) {
          const yAdj = 25;
          items.push(
            generateLine(
              x,
              y - yAdj,
              getX(match.col),
              getY(match.row) + yAdj,
              setClass
            )
          );
        }

        match = squareMateCheck(row, col, cell.set, state.colorChain);
        if (match && match.row < row) {
          let xAdj = 0;
          let yAdj = 0;
          if (Math.abs(row - match.row) - Math.abs(col - match.col) === 0) {
            // Indicates 45 degree angle
            xAdj = 25 * Math.sin(Math.PI / 4);
            yAdj = xAdj;
          } else {
            // 30, 60 degree angle
            xAdj =
              25 *
              (Math.abs(match.row - row) === 2
                ? Math.sin(Math.PI / 6)
                : Math.sin(Math.PI / 3));
            yAdj =
              25 *
              (Math.abs(match.col - col) === 2
                ? Math.sin(Math.PI / 6)
                : Math.sin(Math.PI / 3));
          }
          if (match.col > col) {
            xAdj = -xAdj;
          }
          items.push(
            generateLine(
              x - xAdj,
              y - yAdj,
              getX(match.col) + xAdj,
              getY(match.row) + yAdj,
              setClass
            )
          );
        }
      }
    }
  }

  return (
    <svg className={"ColorChainSVG"} viewBox="0 0 580 580">
      {items}
    </svg>
  );
}

export default ColorChainSVG;
