import { findDependentCells, getCellClaims, makeCellWithValue, removeCandidateFromCell, removeCandidateFromString } from "./cellUtil";

const sanityCheck = (board) => {
  // Check that board has no dups in a house
  if (boardHasDuplicateCellValues(board)) {
    alert("Solution is invalid.")
  }

  // Solve puzzle
  let solving = true;
  let calcBoard = generateCandidates(board);
  while (solving) {
    let tempBoard = doCrossHatching(calcBoard);
    if (!tempBoard) {
      tempBoard = doSoloCells(calcBoard);
      if (!tempBoard) {
        tempBoard = doHouseClaims(calcBoard);
        if (!tempBoard) {
          tempBoard = doSubset(calcBoard);
          if (!tempBoard) {
            solving = false;
          } else {
            calcBoard = tempBoard;
          }
        } else {
          calcBoard = tempBoard;
        }
      } else {
        calcBoard = tempBoard;
      }
    } else {
      calcBoard = tempBoard;
    }
  }

  console.log(calcBoard)
  // Find solutions
  const solutions = doSolve(calcBoard);
  console.log(solutions)
  if (solutions.length > 0) {
    if (solutions.length > 1) {
      alert("Puzzle has", solutions.length, "solutions.");
    }
    if (boardHasMissingCandidates(board, solutions[0])) {
      //
    }
  } else {
    alert("Solution is a invalid.")
  }

  alert("Sanity check complete.")
}

const boardHasDuplicateCellValues = (board) => {
  for (let house = 0; house < 9; house++) {
    if (houseHasDuplicateCellValues(getAnnotatedRowOfCells(house, board))) return true;
    if (houseHasDuplicateCellValues(getAnnotatedColOfCells(house, board))) return true;
    if (houseHasDuplicateCellValues(getAnnotatedBoxOfCells(house, board))) return true;
  }
  return false;
}

const houseHasDuplicateCellValues = (cells) => {
  const counts = Array(9).fill(0);
  cells.forEach((cell) => {
    if (cell.value) counts[cell.value-1]++;
    if (counts[cell.value] > 1) return true;
  });
  return false;
}

const boardHasMissingCandidates = (board, solution) => {
  board.forEach((cell, idx) => {
    if (cell.value !== solution[idx].value) {
      if (!cell.notes.includes(solution[idx].value)) {
        alert("Hey, cell " + (idx + 1) + " does not contain correct candidate.");
        return true;
      }
    }
  });
  return false;
}

// Emulate cross hatching and return new board or null if no changes
const doCrossHatching = (board) => {

  // Collect cell/candidate combos for houses
  const candidateSets = [];
  for (let house = 0; house < 9; house++) {
    candidateSets.push(
      ...collectCandidates(getAnnotatedRowOfCells(house, board)),
      ...collectCandidates(getAnnotatedColOfCells(house, board)),
      ...collectCandidates(getAnnotatedBoxOfCells(house, board))
    );
  }

  // Filter for combos sets with only 1 item
  const solvedCells = candidateSets.filter((set) => set && set.length === 1).map((set) => set[0]);

  if (solvedCells.length > 0) {
    const newBoard = board.map((c) => ({...c}));

    solvedCells.forEach((item) => {
      const value = parseInt(item.candidate);
      console.log("By crosshatching, ", value, " is placed in ", (item.row + 1), ", ", (item.col + 1));
      newBoard[item.id] = makeCellWithValue(value);   
      findDependentCells(item.id, newBoard).forEach((dep) => {
        newBoard[dep.id] = removeCandidateFromCell(newBoard[dep.id], value);
      })
    });

    return newBoard;
  }
};

// Solve cells with only one candidate and return board or null if no changes
const doSoloCells = (board) => {
  // Filter for cells with only one possible candidate
  const soloCells = board.reduce((solo, cell, cellId) => 
    cell.notes && cell.notes.length === 1 ? solo.concat([{...cell, cellId}]) : solo, 
  []);
  
  if (soloCells.length > 0) {
    const newBoard = board.map((c) => ({...c}));
    
    soloCells.forEach((solo) => {
      const value = parseInt(solo.notes);
      const claims = getCellClaims(solo.cellId);
      console.log("Solo found, ", value, " is placed in ", (claims.row + 1), ", ", (claims.col + 1));
      newBoard[solo.cellId] = makeCellWithValue(value);
      findDependentCells(solo.cellId, newBoard).forEach((dep) => {
        newBoard[dep.id] = removeCandidateFromCell(newBoard[dep.id], value);
      });
    });

    return newBoard;
  }

  return null;
}

// Check for house claims on other houses
const doHouseClaims = (board) => {
  let rowClaims = [];
  let colClaims = [];
  let boxRowClaims = [];
  let boxColClaims = [];
  for (let house = 0; house < 9; house++) {
    rowClaims = rowClaims.concat(collectHouseClaims(getAnnotatedRowOfCells(house, board), "box"));
    colClaims = colClaims.concat(collectHouseClaims(getAnnotatedColOfCells(house, board), "box"));
    boxRowClaims = boxRowClaims.concat(collectHouseClaims(getAnnotatedBoxOfCells(house, board), "row"));
    boxColClaims = boxColClaims.concat(collectHouseClaims(getAnnotatedBoxOfCells(house, board), "col"));
  }

  boxRowClaims = boxRowClaims.filter((claim) => !rowClaims.find((claim2) => claim.id === claim2.id));
  boxColClaims = boxColClaims.filter((claim) => !colClaims.find((claim2) => claim.id === claim2.id));

  // Apply claims to board
  let update = false;
  const newBoard = board.map((c) => ({...c}));

  rowClaims.forEach((claim) => {
    getAnnotatedBoxOfCells(claim.box, newBoard)
      .filter((cell) => cell.notes && cell.notes.match(claim.candidate) && claim.row !== cell.row)
      .forEach((cell) => {
        newBoard[cell.id] = removeCandidateFromCell(newBoard[cell.id], claim.candidate);
        update = true;
      })    
  });

  colClaims.forEach((claim) => {
    getAnnotatedBoxOfCells(claim.box, newBoard)
      .filter((cell) => cell.notes && cell.notes.match(claim.candidate) && claim.col !== cell.col)
      .forEach((cell) => {
        newBoard[cell.id] = removeCandidateFromCell(newBoard[cell.id], claim.candidate);
        update = true;
      })    
  });

  boxRowClaims.forEach((claim) => {
    getAnnotatedRowOfCells(claim.row, newBoard)
      .filter((cell) => cell.notes && cell.notes.match(claim.candidate) && claim.box !== cell.box)
      .forEach((cell) => {
        newBoard[cell.id] = removeCandidateFromCell(newBoard[cell.id], claim.candidate);
        update = true;
      })    
  });

  boxColClaims.forEach((claim) => {
    getAnnotatedColOfCells(claim.col, newBoard)
      .filter((cell) => cell.notes && cell.notes.match(claim.candidate) && claim.box !== cell.box)
      .forEach((cell) => {
        newBoard[cell.id] = removeCandidateFromCell(newBoard[cell.id], claim.candidate);
        update = true;
      })    
  });
  
  return update ? newBoard : null;
}

const doSubset = (board) => {
  let subsets = [];
  // Check rows for pairs/triplets...
  for (let row = 0; row < 9; row++) {
    const cells = getAnnotatedRowOfCells(row, board).filter((cell) => cell.notes && cell.notes.length > 0);
    subsets = subsets.concat(collectPatternSubsetCounts(cells));
  }
  // Check cols for pairs/triplets...
  for (let col = 0; col < 9; col++) {
    const cells = getAnnotatedColOfCells(col, board).filter((cell) => cell.notes && cell.notes.length > 0);
    subsets = subsets.concat(collectPatternSubsetCounts(cells));
  }
  // Check boxes for pairs/triplets...
  for (let box = 0; box < 9; box++) {
    const cells = getAnnotatedBoxOfCells(box, board).filter((cell) => cell.notes && cell.notes.length > 0);
    subsets = subsets.concat(collectPatternSubsetCounts(cells));
  }

  let update = false;
  const newBoard = board.map((c) => ({...c}));
  subsets.forEach((subset) => {
    if (subset.pattern.length === subset.matches.length) {
      if (subset.pattern.length !== subset.dependents.length) {
        subset.unmatches.forEach((cell) => {
          const newNotes = removeCandidates(cell.notes, subset.pattern);
          if (newNotes !== cell.notes) {
            console.log("Naked subset, removing ", subset.pattern, " from ", cell.row + 1, cell.col + 1);
            newBoard[cell.id].notes = newNotes;
            update = true;
          }
        });
      }
    } else if (subset.pattern.length === subset.dependents.length) {
      if (subset.dependents.length !== subset.matches.length + subset.unmatches.length) {
        subset.dependents.forEach((cell) => {
          const newNotes = removeCandidatesExcept(cell.notes, subset.pattern);
          if (newNotes !== cell.notes) {
            console.log("Hidden subset, removing all but ", subset.pattern, " from ", cell.row + 1, cell.col + 1);
            newBoard[cell.id].notes = removeCandidatesExcept(newBoard[cell.id].notes, subset.pattern);
            update = true;
          }
        });
      }
    }
  });

  return update ? newBoard : null;
}

const removeCandidatesExcept = (notes, candidates) => {
  return notes.split("").reduce((str, candidate) => candidates.match(candidate) ? str + candidate : str, "");
}

const removeCandidates = (notes, candidates) => {
  return notes.split("").reduce((str, candidate) => candidates.match(candidate) ? str : str + candidate, "");
}

const collectPatterns = (cells) => {
  let patterns = {};
  cells.forEach((cell) => {
    patterns = {
      ...patterns,
      ...genCellCandidatePatterns(cell.notes),
    };
  });
  return patterns;
}

const collectPatternSubsetCounts = (cells) => {
  const counts = [];
  Object.keys(collectPatterns(cells)).forEach((pattern) => {
    let dependents = [];
    let matches = [];
    let unmatches = [];
    cells.forEach((cell) => {
      if (pattern === cell.notes) {
        matches.push(cell);
      } else {
        unmatches.push(cell);
      }
      if (isCandidatePatternDependence(pattern, cell.notes)) {
        dependents.push(cell);
      }
    });

    counts.push({
      pattern,
      matches,
      unmatches,
      dependents
    });
  });

  return counts;
}

// Brute force solution
const doSolve = (board, startId) => {
  startId = startId ? startId : 0;

  // Determine cell to solve
  let cellId = startId + board.slice(startId).findIndex((cell) => !cell.value);
  
  // Cycle candidates
  let solutions = [];
  if (cellId >= startId) {
    board[cellId].notes.split("").forEach((candidate) => {
      const newBoard = board.map((c) => ({...c}));
      newBoard[cellId] = makeCellWithValue(parseInt(candidate));
      findDependentCells(cellId, newBoard).forEach((dep) => {
        newBoard[dep.id] = removeCandidateFromCell(newBoard[dep.id], candidate);
      });
      if (newBoard.filter((cell) => !cell.value).length === 0) {
        solutions.push(newBoard);
      } else {
        solutions = [
          ...solutions,
          ...doSolve(newBoard, cellId + 1)
        ];
      }
    });
  }

  return solutions;
};

// Cell functions
const getAnnotatedRowOfCells = (row, board) => {
  const cells = [];
  for (let id = row * 9; id < row * 9 + 9; id++) {
    cells.push({
      ...board[id],
      ...getCellClaims(id),
      id
    });
  }
  return cells;
}

const getAnnotatedColOfCells = (col, board) => {
  const cells = [];
  for (let id = col; id < 81; id+= 9) {
    cells.push({
      ...board[id],
      ...getCellClaims(id),
      id
    });
  }
  return cells;
}

const getAnnotatedBoxOfCells = (box, board) => {
  const cells = [];
  const row1 = Math.floor(box / 3) * 3;
  const col1 = (box % 3) * 3;
  for (let row = row1; row < row1 + 3; row++) {
    for (let col = col1; col < col1 + 3; col++) {
      const id = row * 9 + col;
      cells.push({
        ...board[id],
        ...getCellClaims(id),
        id
      });
    }
  }
  return cells;
}

const generateCellCandidates = (cellId, board) => {
  let notes = "123456789";
  const deps = findDependentCells(cellId, board);
  deps.forEach((cell) => {
    if (cell && cell.value) {
      notes = removeCandidateFromString(cell.value, notes)
    }
  });
  return notes;
}

const generateCandidates = (board, noOverWrite) => {
  return board.map((cell, id) => ({
    ...cell,
    notes: cell.value ? "" : cell.notes && noOverWrite ? cell.notes : generateCellCandidates(id, board)
  }));
}

// Given array of cells, determine cells for each candidate
const collectCandidates = (cells) => {
  const acc = Array(9);
  cells.forEach((cell) => {
    if (cell.notes) {
      cell.notes.split("").forEach((candidate) => {
        if (!acc[parseInt(candidate)-1]) acc[parseInt(candidate)-1] = [];
        acc[parseInt(candidate)-1].push({...cell, candidate});
      });
    }
  });
  return acc;
}

// Given array of cells and house, determine candidate claims
const collectHouseClaims = (cells, house) => {
  const claims = [];
  for (let candidate = 1; candidate <= 9; candidate++) {
    const matches = cells.filter((cell) => cell.notes && cell.notes.includes(candidate));
    if (matches.length > 1 && matches.length === matches.filter((match) => match[house] === matches[0][house]).length) {
      claims.push({...matches[0], candidate});
    }
  }
  return claims;
}

// Given a notes string, generate all candiate combos
const genCellCandidatePatterns = (notes, preFix, startIdx) => {
  let patterns = {};
  for (let i = startIdx ? startIdx : 0; i < notes.length; i++) {
    const pattern = (preFix ? preFix : "") + notes.charAt(i);
    if (pattern.length > 1) patterns[pattern] = {};
    patterns = {
      ...patterns,
      ...genCellCandidatePatterns(notes, pattern, i + 1)
    };
  }
  return patterns;
};

const isCandidatePatternDependence = (pattern, notes) => {
  for (let i = 0; i < pattern.length; i++) {
    if (notes.match(pattern.charAt(i))) return true;
  }
  return false;
};

export { generateCandidates, doCrossHatching, doSoloCells, doHouseClaims, doSubset, doSolve, sanityCheck };
