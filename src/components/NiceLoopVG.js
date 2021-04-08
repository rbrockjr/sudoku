import React, { useContext } from "react";
import { ChainContext } from "../util/chainContext";
import "./ColorChainSVG.css";

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
  const { state } = chainContext;

  const items = [];

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
        stroke="black"
        stroke-width="2"
        key={row + "-" + col + "-" + candidate}
      />
    );
  };

  const putCandidateArc = (row, col, candidate, up, right) => {
    let x = getX(col);
    let y = getY(row);

    if (candidate <= 3) y -= 17;
    if (candidate >= 7) y += 17;
    if (candidate % 3 === 1) x -= 17;
    if (candidate % 3 === 0) x += 17;

    let x1 = x;
    let x2 = x;
    let y1 = y;
    let y2 = y;
    if (up) {
      if (right) {
        x2 = x + 10;
        y1 = y - 10;
      } else {
        x1 = x - 10;
        y2 = y - 10;
      }
    } else {
      if (right) {
        x1 = x + 10;
        y2 = y + 10;
      } else {
        x2 = x - 10;
        y1 = y + 10;
      }
    }

    items.push(
      <path
        d={"M " + x1 + " " + y1 + " A 12 12 0 0 1 " + x2 + " " + y2}
        stroke="black"
        fill="none"
        stroke-width="2"
        key={row + "-" + col + "-" + candidate}
      />
    );
  };

  const connectCandidates = (
    row1,
    col1,
    candidate1,
    row2,
    col2,
    candidate2,
    strong
  ) => {
    const up = row2 > row1 || (row2 === row1 && col2 >= col1);
    const right = col2 > col1 || (col2 === col1 && row2 >= row1);

    let x1 = getCandidateX(col1, candidate1);
    let y1 = getCandidateY(row1, candidate1);
    let x2 = getCandidateX(col2, candidate2);
    let y2 = getCandidateY(row2, candidate2);

    items.push(
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="black"
        stroke-width="2"
        key={x1 + "-" + y1 + "-" + x2 + "-" + y2}
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

  putCandidateCircle(5, 5, 5);
  putCandidateCircle(4, 4, 4);
  putCandidateCircle(3, 3, 3);
  putCandidateCircle(8, 8, 8);
  putCandidateCircle(2, 2, 9);

  putCandidateArc(6, 6, 6, true, true);
  putCandidateArc(6, 0, 6, true, false);
  putCandidateArc(6, 3, 6, false, false);
  putCandidateArc(6, 4, 6, false, true);

  connectCandidates(4, 0, 3, 5, 6, 5, true);

  return (
    <svg className={"NiceLoopSVG"} viewBox="0 0 580 580">
      {items}
    </svg>
  );
}

export default NiceLoopSVG;
