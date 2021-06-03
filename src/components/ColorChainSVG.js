import React, { useContext } from "react";
import { getCellClaims } from "../util/cellUtil";
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

  const cellMateCheck = (cellId, set, chain) => {
    return chain.reduce((acc, cell, id) => {
      if (cell && cell.set === set && id !== cellId) {
        const cellRCS = getCellClaims(cellId);
        const matchRCS = getCellClaims(id);
        if (cellRCS.row === matchRCS.row) {
          acc.rowMatch = matchRCS
        }
        else if (cellRCS.col === matchRCS.col) {
          acc.colMatch = matchRCS
        }
        else if (cellRCS.box === matchRCS.box) {
          acc.boxMatch = matchRCS
        }
      }
      return acc;
    }, {});
  }

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
  const { colorChain } = chainContext.state;

  const items = [];
  colorChain.forEach((cell, id) => {
    if (cell) {
      const claims = getCellClaims(id);
      const x = getX(claims.col);
      const y = getY(claims.row);
      const setClass = determineSetClass(cell);
      items.push(
        <circle
          cx={x}
          cy={y}
          r="25"
          className={setClass}
          opacity="0.6"
          key={x + "-" + y}
        />
      );
      
      // Do line connectors
      const { rowMatch, colMatch, boxMatch } = cellMateCheck(id, cell.set, colorChain);
      if (rowMatch && rowMatch.col < claims.col) {
        const xAdj = 25;
        items.push(
          generateLine(
            x - xAdj,
            y,
            getX(rowMatch.col) + xAdj,
            getY(rowMatch.row),
            setClass
          )
        );
      }
      
      if (colMatch && colMatch.row < claims.row) {
        const yAdj = 25;
        items.push(
          generateLine(
            x,
            y - yAdj,
            getX(colMatch.col),
            getY(colMatch.row) + yAdj,
            setClass
          )
        );
      }

      if (boxMatch && boxMatch.row < claims.row) {
        let xAdj = 0;
        let yAdj = 0;
        if (Math.abs(claims.row - boxMatch.row) - Math.abs(claims.col - boxMatch.col) === 0) {
          // Indicates 45 degree angle
          xAdj = 25 * Math.sin(Math.PI / 4);
          yAdj = xAdj;
        } else {
          // 30, 60 degree angle
          xAdj =
            25 *
            (Math.abs(boxMatch.row - claims.row) === 2
              ? Math.sin(Math.PI / 6)
              : Math.sin(Math.PI / 3));
          yAdj =
            25 *
            (Math.abs(boxMatch.col - claims.col) === 2
              ? Math.sin(Math.PI / 6)
              : Math.sin(Math.PI / 3));
        }
        if (boxMatch.col > claims.col) {
          xAdj = -xAdj;
        }
        items.push(
          generateLine(
            x - xAdj,
            y - yAdj,
            getX(boxMatch.col) + xAdj,
            getY(boxMatch.row) + yAdj,
            setClass
          )
        );
      }
    }
  })

  return (
    <svg className={"ColorChainSVG"} viewBox="0 0 580 580">
      {items}
    </svg>
  );
}

export default ColorChainSVG;
