const makeCellWithValue = (value) => {
  return { value };
}

const getCellRow = (cellId) => {
  return Math.floor(cellId / 9);
};

const getCellCol = (cellId) => {
  return cellId % 9;
};

const getCellBox = (cellId) => {
  return (
    Math.floor(getCellRow(cellId) / 3) * 3 + Math.floor(getCellCol(cellId) / 3)
  );
};

const getCellClaims = (cellId) => {
  return {
    row: getCellRow(cellId),
    col: getCellCol(cellId),
    box: getCellBox(cellId)
  }
}

const areCellsDependent = (cellId1, cellId2) => {
  return cellId1 !== cellId2
    ? getCellRow(cellId1) === getCellRow(cellId2)
      ? true
      : getCellCol(cellId1) === getCellCol(cellId2)
      ? true
      : getCellBox(cellId1) === getCellBox(cellId2)
      ? true
      : false
    : false;
};

const findDependentCells = (cellId, board) => {
  return board.reduce(
    (dep, cell, id) =>
      areCellsDependent(cellId, id) ? dep.concat([{...cell, id}]) : dep,
    []
  );
};

const isCellClaimed = (cellId, value, board) => {
  return (
    findDependentCells(cellId, board).filter((cell) => cell.value === value)
      .length > 0
  );
};

const removeCandidateFromCell = (cell, candidate) => {
  return cell.notes ? { ...cell, notes: removeCandidateFromString(candidate, cell.notes) } : cell;
}

const addCandidateToString = (candidate, str) => {
  return str
    ? str.match(candidate)
      ? "" + str
      : str.concat(candidate).split("").sort().join("")
    : "" + candidate;
};

const removeCandidateFromString = (candidate, str) => {
  return str.replace(candidate, "");
};

// const clearCandidateFromClaimedCells = (cellId, candidate, board) => {
//   return board.map((cell, id) => {
//     if (id === cellId || areCellsDependent(id, cellId)) {
//       return {
//         ...cell,
//         notes: removeCandidateFromString(candidate, cell.notes)
//       }
//     }
//     return cell;
//   });
// };

// Old stuff below

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

export {
  makeCellWithValue,
  getCellRow,
  getCellCol,
  getCellBox,
  getCellClaims,
  isCellClaimed,
  areCellsDependent,
  addCandidateToString,
  removeCandidateFromCell,
  removeCandidateFromString,
  findConflictCells,
  findDependentCells
};
