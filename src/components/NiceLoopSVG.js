import React, { useContext } from "react";
import { getCellClaims } from "../util/cellUtil";
import { ChainContext } from "../util/chainContext";
import "./NiceLoopSVG.css";

function NiceLoopSVG() {
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

  const chainContext = useContext(ChainContext);
  const { niceLoop } = chainContext.state;

  const items = [];
  // items.push(
  //   <defs>
  //     <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto">
  //     <path d="M0,0 L0,5 L9,3 z" />
  //   </marker>
  //   </defs>);

  items.push(
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
          markerWidth="5" markerHeight="5"
          orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
  );

  const putCandidateCircle = (row, col, candidate) => {
    let x = getX(col);
    let y = getY(row);

    if (candidate <= 3) y -= 17;
    if (candidate >= 7) y += 17;
    if (candidate % 3 === 1) x -= 17;
    if (candidate % 3 === 0) x += 17;

    items.push(
      <circle
        cx={x}
        cy={y}
        r="11"
        fill="none"
        key={row + "-" + col + "-" + candidate}
      />
    );
  };

  const connectCandidates = (row1, col1, row2, col2, candidate, weak) => {
    const adj30 = Math.sin(Math.PI / 6);
    const adj60 = Math.sin(Math.PI / 3);
    let x1 = getCandidateX(col1, candidate);
    let y1 = getCandidateY(row1, candidate);    
    let x2 = getCandidateX(col2, candidate);
    let y2 = getCandidateY(row2, candidate);
    if (row1 === row2) {
      x1 += 12 * (col2 > col1 ? adj60 : -adj60);
      y1 += 12 * (col2 > col1 ? -adj30 : adj30);
      x2 += 12 * (col2 > col1 ? -adj60 : adj60) * 1.5;
      y2 += 12 * (col2 > col1 ? -adj30 : adj30);
    } else if (col1 === col2) {
      x1 += 12 * (row2 > row1 ? adj30 : -adj30);
      y1 += 12 * (row2 > row1 ? adj60 : -adj60);
      x2 += 12 * (row2 > row1 ? adj30 : -adj30);
      y2 += 12 * (row2 > row1 ? -adj60 : adj60) * 1.5;
    } else {
      x1 += 12 * (col2 > col1 ? (row2 > row1 ? adj60 : adj30) : (row2 > row1 ? -adj30 : -adj60));
      y1 += 12 * (col2 > col1 ? (row2 > row1 ? adj30 : -adj60) : (row2 > row1 ? adj60 : -adj30));
      x2 += 12 * (col2 > col1 ? (row2 > row1 ? -adj30 : -adj60) : (row2 > row1 ? adj60 : adj30)) * 1.5;
      y2 += 12 * (col2 > col1 ? (row2 > row1 ? -adj60 : adj30) : (row2 > row1 ? -adj30 : adj60)) * 1.5;
    }
    let q1 = x1 - (x1 - x2)/2 + (y2 - y1)/10;
    let q2 = y1 - (y1 - y2)/2 + (x1 - x2)/10;

    items.push(
      <path
        d={"M " + x1 + " " + y1 + " Q " + q1 + " " + q2 + " " + x2 + " " + y2}
        fill="transparent"
        key={x1 + "-" + y1 + "-" + x2 + "-" + y2 + "D"}
        strokeDasharray={weak ? "10,5" : ""}
        markerEnd={"url(#arrow)"}
      />
    );
  };

  const getCandidateX = (col, candidate) => {
    let x = getX(col);
    if (candidate % 3 === 1) x -= 17;
    if (candidate % 3 === 0) x += 17;
    return x;
  };

  const getCandidateY = (row, candidate) => {
    let y = getY(row);
    if (candidate <= 3) y -= 17;
    if (candidate >= 7) y += 17;
    return y;
  };

  let prevItem = null;
  niceLoop.forEach((item, idx) => {
    const claims = getCellClaims(item.cellId);
    if (idx === 0) {
      const x = getX(claims.col);
      const y = getY(claims.row);
      items.push(
        <circle cx={x} cy={y} r="25" className={"cell0"} key={x + "-" + y}
        />
      );
    } else {
      const prevClaims = getCellClaims(prevItem.cellId);
      putCandidateCircle(prevClaims.row, prevClaims.col, item.candidate);
      putCandidateCircle(claims.row, claims.col, item.candidate);
      connectCandidates(prevClaims.row, prevClaims.col, claims.row, claims.col, item.candidate, item.weak);
    }
    prevItem = item;
  })

  return (
    <svg className={"NiceLoopSVG"} viewBox="0 0 580 580">
      {items}
    </svg>
  );
}

export default NiceLoopSVG;
