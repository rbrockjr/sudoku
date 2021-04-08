import { init9x9 } from "./cellUtil";

// In this file, candidates are an ordered string of numbers from 1-9

const genCandidates = (board) => {
  const candidates = init9x9("123456789");

  board.forEach((ra, row) => {
    ra.forEach((cell, col) => {
      if (cell) {
        candidates[row][col] = "";
      } else {
      }
    });
  });

  return candidates;
};

// A function should not alter state, only return something

const clearCandidateFromClaimedCells = (
  candidate,
  claimedRow,
  claimedCol,
  candidates
) => {};

const setCellValue = (cellId, value, board) => {
  return board.map((cell) => {});
};

const getCellRow = (cellId) => {
  return Math.ceil(cellId / 9);
};

const getCellCol = (cellId) => {
  return ((cellId - 1) % 9) + 1;
};

const getCellSquare = (cellId) => {
  return (
    Math.floor((getCellRow(cellId) - 1) / 3) * 3 +
    1 +
    Math.floor((getCellCol(cellId) - 1) / 3)
  );
};

const areCellsDependent = (cellId1, cellId2) => {
  return getCellRow(cellId1) === getCellRow(cellId2)
    ? true
    : getCellCol(cellId1) === getCellCol(cellId2)
    ? true
    : getCellSquare(cellId1) === getCellSquare(cellId2)
    ? true
    : false;
};

const addCandidateToString = (candidate, str) => {
  return str.match(candidate)
    ? "" + str
    : str.concat(candidate).split("").sort().join("");
};

const removeCandidateFromString = (candidate, str) => {
  return str.replace(candidate, "");
};

const genCellCandidates = (cellRow, cellCol, board) => {
  if (board[cellRow][cellCol]) {
    return Array(9).fill(false);
  } else {
    const candidates = Array(9).fill(true);

    for (let row = 0; row < 9; row++) {
      if (board[row][cellCol]) {
        candidates[board[row][cellCol] - 1] = false;
      }
    }

    for (let col = 0; col < 9; col++) {
      if (board[cellRow][col]) {
        candidates[board[cellRow][col] - 1] = false;
      }
    }

    const row1 = Math.floor(cellRow / 3) * 3;
    const col1 = Math.floor(cellCol / 3) * 3;
    for (let row = row1; row < row1 + 3; row++) {
      for (let col = col1; col < col1 + 3; col++) {
        if (board[row][col]) {
          candidates[board[row][col] - 1] = false;
        }
      }
    }

    return candidates;
  }
};

export {
  addCandidateToString,
  removeCandidateFromString,
  areCellsDependent,
  getCellRow,
  getCellCol,
  getCellSquare,
};
