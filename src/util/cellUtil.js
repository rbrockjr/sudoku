const findConflictCells = (row, col, value, board) => {
  return (
    findInfluenceCells(row, col, board).reduce((cnt, cell) => {
      return cell === value ? cnt + 1 : cnt;
    }, 0) > 0
  );
};

const findInfluenceCells = (row, col, board) => {
  const infCells = board.reduce((acc1, theRow, rowIdx) => {
    const fCells = theRow.filter((cell, colIdx) => {
      return isInfluenceCell(row, col, rowIdx, colIdx);
    });
    return acc1.concat(fCells);
  }, []);

  return infCells;
};

const isInfluenceCell = (row1, col1, row2, col2) => {
  return (
    row1 === row2 ||
    col1 === col2 ||
    (Math.floor(row1 / 3) === Math.floor(row2 / 3) &&
      Math.floor(col1 / 3) === Math.floor(col2 / 3))
  );
};

const clearNotesFromClaimedCells = (cellRow, cellCol, activeNumber, notes) => {
  for (let i = 0; i < 9; i++) {
    if (notes[cellRow][cellCol][i]) {
      notes[cellRow][cellCol][i] = false;
    }
  }
  for (let row = 0; row < 9; row++) {
    notes[row][cellCol][activeNumber - 1] = false;
  }
  for (let col = 0; col < 9; col++) {
    notes[cellRow][col][activeNumber - 1] = false;
  }
  const row1 = Math.floor(cellRow / 3) * 3;
  const col1 = Math.floor(cellCol / 3) * 3;
  for (let row = row1; row < row1 + 3; row++) {
    for (let col = col1; col < col1 + 3; col++) {
        notes[row][col][activeNumber - 1] = false;
    }
  }
};

const colorChainMateCheck = (cellRow, cellCol, set, chainCells) => {
  let rtn = { rowCnt: 0, colCnt: 0, sqCnt: 0, total: 0, type: 0 };
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      let cell = chainCells[row][col];
      if (cell && cell.set === set) {
        let mateFound = false;
        if (row === cellRow) {
          mateFound = true;
          rtn.rowCnt++;
        }
        if (col === cellCol) {
          mateFound = true;
          rtn.colCnt++;
        }
        if (
          Math.floor(row / 3) === Math.floor(cellRow / 3) &&
          Math.floor(col / 3) === Math.floor(cellCol / 3)
        ) {
          mateFound = true;
          rtn.sqCnt++;
        }
        if (mateFound) {
          rtn.type = cell.type;
        }
        rtn.total++;
      }
    }
  }
  return rtn;
};

const init9x9 = (val) => {
    const rtn9x9 = [];
    for (let col = 0; col < 9; col++) {
        rtn9x9[col] = Array(9).fill(val);
    }
    return rtn9x9;
}

export { init9x9, findConflictCells, clearNotesFromClaimedCells, colorChainMateCheck };