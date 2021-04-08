import "./CellModeMenu.css";
import { useContext, useEffect, useState } from "react";
import RoundButton from "./RoundButton";
import { CELL_CLICK_MODES } from "../util/constants";
import { BoardContext } from "../util/boardContext";
import { GlobalContext } from "../util/globalContext";
import { clearNotesFromClaimedCells, init9x9 } from "../util/cellUtil";

const CellModeMenu = () => {
  const globalContext = useContext(GlobalContext);
  const boardContext = useContext(BoardContext);
  const { state, setCellClickMode } = globalContext;
  const { undo, redo } = boardContext;

  const [fadeUndo, setFadeUndo] = useState(false);
  const [fadeRedo, setFadeRedo] = useState(false);

  const buttonClick = (mode) => {
    setCellClickMode(mode);
  };

  useEffect(() => {
    if (fadeUndo || fadeRedo) {
      const timerId = setTimeout(() => {
        setFadeUndo(false);
        setFadeRedo(false);
      }, 10);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [fadeUndo, fadeRedo]);

  const undoClick = () => {
    undo();
    setFadeUndo(true);
  };

  const redoClick = () => {
    redo();
    setFadeRedo(true);
  };

  return (
    <div className="CellModeMenu">
      <RoundButton
        buttonText="V"
        active={state.cellClickMode === CELL_CLICK_MODES.VALUE}
        buttonClick={() => buttonClick(CELL_CLICK_MODES.VALUE)}
        key={CELL_CLICK_MODES.VALUE}
      />
      <RoundButton
        buttonText="N"
        active={state.cellClickMode === CELL_CLICK_MODES.NOTE}
        buttonClick={() => buttonClick(CELL_CLICK_MODES.NOTE)}
        key={CELL_CLICK_MODES.NOTE}
      />

      <RoundButton
        buttonText="U"
        active={fadeUndo}
        secondaryClass={!fadeUndo ? "temporaryActive" : ""}
        buttonClick={() => undoClick()}
        key={"UNDO"}
      />
      <RoundButton
        buttonText="R"
        active={fadeRedo}
        secondaryClass={!fadeRedo ? "temporaryActive" : ""}
        buttonClick={() => redoClick()}
        key={"REDO"}
      />
      <RoundButton
        buttonText="VE"
        buttonClick={() =>
          doVeryEasy(boardContext.state.board, boardContext.dispatch)
        }
        key={"DO1"}
      />
      <RoundButton
        buttonText="E"
        buttonClick={() =>
          doEasy(
            boardContext.state.board,
            boardContext.state.notes,
            boardContext.dispatch
          )
        }
        key={"DO2"}
      />
      <RoundButton
        buttonText="S4"
        buttonClick={() =>
          doThree(
            boardContext.state.board,
            boardContext.state.notes,
            boardContext.dispatch
          )
        }
        key={"DO4"}
      />
      <RoundButton
        buttonText="BF"
        buttonClick={() =>
          startSolution(
            boardContext.state.board,
            boardContext.state.notes,
            boardContext.dispatch
          )
        }
        key={"DO5"}
      />
    </div>
  );
};

// Very easy = cells that can be easily seen with crosshatching
const doVeryEasy = (board, dispatch) => {
  const newBoard = board.map((r) => r.map((c) => c));
  const solvedCells = [];

  // Set candidates
  const newNotes = genCandidates(newBoard);

  // Check rows for solo candidates
  for (let row = 0; row < 9; row++) {
    solvedCells.push(
      ...collectNoteCountsForCells(collectCellNotesByRow(row, newNotes)).filter(
        (item) => item.count === 1
      )
    );
  }

  // Check cols for solo candidates
  for (let col = 0; col < 9; col++) {
    solvedCells.push(
      ...collectNoteCountsForCells(collectCellNotesByCol(col, newNotes)).filter(
        (item) => item.count === 1
      )
    );
  }

  // Check squares for solo candidates
  for (let sq = 0; sq < 9; sq++) {
    solvedCells.push(
      ...collectNoteCountsForCells(
        collectCellNotesBySquare(sq, newNotes)
      ).filter((item) => item.count === 1)
    );
  }

  if (dispatch) {
    solvedCells.forEach((item) => {
      console.log(
        "Setting " +
          item.value +
          " in " +
          (item.row + 1) +
          ", " +
          (item.col + 1)
      );
      newBoard[item.row][item.col] = item.value;
      clearNotesFromClaimedCells(item.row, item.col, item.value, newNotes);
    });

    dispatch({
      type: "SET_BOARD",
      board: newBoard,
      notes: newNotes,
      undoStates: [],
    });
  }
};

const collectCellNotesByRow = (row, notes) => {
  return notes[row].map((c, col) => ({
    row,
    col,
    notes: c,
  }));
};

const collectCellNotesByCol = (col, notes) => {
  return notes.reduce(
    (acc, r, row) => [
      ...acc,
      {
        row,
        col,
        notes: r[col],
      },
    ],
    []
  );
};

const collectCellNotesBySquare = (square, notes) => {
  const sqRow = Math.floor(square / 3);
  const sqCol = square % 3;

  return notes.reduce((acc, r, row) => {
    return Math.floor(row / 3) === sqRow
      ? [
          ...acc,
          ...r.reduce((acc, c, col) => {
            if (Math.floor(col / 3) === sqCol) {
              return [
                ...acc,
                {
                  row,
                  col,
                  notes: c,
                },
              ];
            } else return acc;
          }, []),
        ]
      : acc;
  }, []);
};

const collectNoteCountsForCells = (cells) => {
  const counts = Array(9)
    .fill()
    .map((c) => ({ count: 0 }));

  cells.forEach((cell) => {
    cell.notes
      .reduce((acc, flag) => {
        return [
          ...acc,
          {
            row: cell.row,
            col: cell.col,
            count: flag ? 1 : 0,
          },
        ];
      }, [])
      .forEach((count, id) => {
        if (count.count === 1) {
          counts[id].count = counts[id].count + 1;
          counts[id].row = count.row;
          counts[id].col = count.col;
          counts[id].value = id + 1;
        }
      });
  }, []);

  return counts;
};

const collectRowCellsByCandidate = (row, candidate, notes) => {
  return notes[row].reduce(
    (acc, c, col) =>
      c[candidate]
        ? [
            ...acc,
            {
              row,
              col,
            },
          ]
        : acc,
    []
  );
};

const collectColCellsByCandidate = (col, candidate, notes) => {
  return notes.reduce(
    (acc, r, row) =>
      r[col][candidate]
        ? [
            ...acc,
            {
              row,
              col,
            },
          ]
        : acc,
    []
  );
};

const collectSquareCellsByCandidate = (square, candidate, notes) => {
  const sqRow = Math.floor(square / 3);
  const sqCol = square % 3;

  return notes.reduce(
    (acc, r, row) =>
      Math.floor(row / 3) === sqRow
        ? [
            ...acc,
            ...r.reduce(
              (acc2, c, col) =>
                Math.floor(col / 3) === sqCol && c[candidate]
                  ? [
                      ...acc2,
                      {
                        row,
                        col,
                      },
                    ]
                  : acc2,
              []
            ),
          ]
        : acc,
    []
  );
};

const genCandidateSquareClaim = (row, col, square) => {
  return {
    row,
    col,
    square:
      square >= 0 ? square : Math.floor(row / 3) * 3 + Math.floor(col / 3),
  };
};

// Easy = Cells/Candidates that can be solved by elimination
const doEasy = (board, notes, dispatch) => {
  // Set candidates
  const newNotes = notes.map((r) => r.map((c) => c.map((n) => n)));

  // Locate cells with only one possible candidate
  const soloCells = newNotes.reduce(
    (acc, r, row) => [
      ...acc,
      ...r.reduce((acc2, c, col) => {
        const solo = c.reduce(
          (acc3, flag, id) => ({
            id: flag ? id : acc3.id,
            solo: flag ? (acc3.id >= 0 ? false : true) : acc3.solo,
          }),
          {}
        );
        return solo.solo ? [...acc2, { row, col, id: solo.id }] : acc2;
      }, []),
    ],
    []
  );

  const newBoard = board.map((r) => r.map((c) => c));
  soloCells.forEach((solo) => {
    console.log(
      "Found solo " +
        (solo.id + 1) +
        " in " +
        (solo.row + 1) +
        ", " +
        (solo.col + 1)
    );
    newBoard[solo.row][solo.col] = solo.id + 1;
    clearNotesFromClaimedCells(solo.row, solo.col, solo.id + 1, newNotes);
  });

  // Check for candidates that claim a row, col or square
  for (let candidate = 0; candidate < 9; candidate++) {
    const rowClaims = {};
    for (let row = 0; row < 9; row++) {
      const cells = collectRowCellsByCandidate(row, candidate, newNotes);
      if (
        cells.length > 1 &&
        Math.floor(cells[0].col / 3) ===
          Math.floor(cells[cells.length - 1].col / 3)
      ) {
        const claim = genCandidateSquareClaim(row, cells[0].col);
        rowClaims[claim.square] = claim;
      }
    }

    const colClaims = {};
    for (let col = 0; col < 9; col++) {
      const cells = collectColCellsByCandidate(col, candidate, newNotes);
      if (
        cells.length > 1 &&
        Math.floor(cells[0].row / 3) ===
          Math.floor(cells[cells.length - 1].row / 3)
      ) {
        const claim = genCandidateSquareClaim(cells[0].row, col);
        colClaims[claim.square] = claim;
      }
    }

    const rowClaims2 = {};
    const colClaims2 = {};
    for (let sq = 0; sq < 9; sq++) {
      if (!rowClaims[sq] && !colClaims[sq]) {
        const cells = collectSquareCellsByCandidate(sq, candidate, newNotes);
        if (cells.length > 0) {
          const claims = cells.reduce(
            (acc, cell) => ({
              row: acc.row !== cell.row ? -1 : acc.row,
              col: acc.col !== cell.col ? -1 : acc.col,
            }),
            {
              row: cells[0].row,
              col: cells[0].col,
            }
          );
          if (claims.row >= 0) {
            const claim = genCandidateSquareClaim(claims.row, claims.col, sq);
            console.log(claim);
            rowClaims2[sq] = claim;
          }
          if (claims.col >= 0) {
            const claim = genCandidateSquareClaim(claims.row, claims.col, sq);
            console.log(claim);
            colClaims2[sq] = claim;
          }
        }
      }
    }

    // console.log("Row claims for " + (candidate + 1));
    // console.log(rowClaims);
    // console.log(rowClaims2);
    // console.log("Col claims for " + (candidate + 1));
    // console.log(colClaims);
    // console.log(colClaims2);

    Object.keys(rowClaims).forEach((key) => {
      const claim = rowClaims[key];
      clearCandidateFromSquareSansRow(
        candidate,
        claim.square,
        claim.row,
        newNotes
      );
    });
    Object.keys(colClaims).forEach((key) => {
      const claim = colClaims[key];
      clearCandidateFromSquareSansCol(
        candidate,
        claim.square,
        claim.col,
        newNotes
      );
    });
    Object.keys(rowClaims2).forEach((key) => {
      const claim = rowClaims2[key];
      clearCandidateFromRowSansSquare(
        candidate,
        claim.row,
        claim.square,
        newNotes
      );
    });
    Object.keys(colClaims2).forEach((key) => {
      const claim = colClaims2[key];
      clearCandidateFromColSansSquare(
        candidate,
        claim.col,
        claim.square,
        newNotes
      );
    });
  }

  if (dispatch) {
    dispatch({
      type: "SET_BOARD",
      board: newBoard,
      notes: newNotes,
      undoStates: [],
    });
  }
};

const startSolution = (board, notes) => {
  const newBoard = doSolve(board, notes, 0, 0, ".");
  console.log(newBoard);
};

const isSolved = (board) => {
  return board.reduce(
    (a, r) => (r.reduce((a, c) => (c && a ? a : false), true) && a ? a : false),
    true
  );
};

const doSolve = (board, notes, startRow, startCol, prefix) => {
  startRow = startRow ? startRow : 0;
  startCol = startCol ? startCol : 0;

  // Determine cell to update
  let cellRow = 0;
  let cellCol = 0;
  let found = false;
  for (let row = startRow; row < 9 && !found; row++) {
    for (let col = startCol; col < 9 && !found; col++) {
      if (!board[row][col]) {
        cellRow = row;
        cellCol = col;
        found = true;
      }
    }
    startCol = 0;
  }

  // Cycle candidates
  let solutions = [];
  for (let candidate = 0; candidate < 9; candidate++) {
    if (notes[cellRow][cellCol][candidate]) {
      const newBoard = board.map((r) => r.map((c) => c));
      const newNotes = notes.map((r) => r.map((c) => c.map((n) => n)));

      newBoard[cellRow][cellCol] = candidate + 1;
      clearNotesFromClaimedCells(cellRow, cellCol, candidate + 1, newNotes);

      if (isSolved(newBoard)) {
        solutions.push(newBoard);
      } else {
        solutions = [
          ...solutions,
          ...doSolve(newBoard, newNotes, cellRow, cellCol + 1, prefix + "."),
        ];
      }
    }
  }

  return solutions;
};

const reportOnPatterns = (label, pattern, results) => {
  if (pattern.length === results.matches.length) {
    if (pattern.length !== results.dependents.length) {
      results.unmatches.forEach((cell) => {
        console.log(
          "Remove " + pattern + " from " + cell.row + ", " + cell.col
        );
      });
    }
  } else if (pattern.length === results.dependents.length) {
    if (
      results.dependents.length !==
      results.matches.length + results.unmatches.length
    ) {
      results.dependents.forEach((cell) => {
        console.log(
          "Remove all except " + pattern + " from " + cell.row + ", " + cell.col
        );
      });
    }
  }
};

const doThree = (board, notes, dispatch) => {
  const newNotes = notes.map((r) => r.map((c) => c.map((n) => n)));

  // Check rows for pairs/triplets...
  for (let row = 0; row < 9; row++) {
    // Generate set of patterns
    let patterns = {};
    newNotes[row].forEach((c, col) => {
      patterns = {
        ...patterns,
        ...genCellNotePatterns(c),
      };
    });

    Object.keys(patterns).forEach((p) => {
      let dependents = [];
      let matches = [];
      let unmatches = [];
      for (let col = 0; col < 9; col++) {
        if (!board[row][col]) {
          if (isCandidatePatternMatch(p, newNotes[row][col])) {
            matches.push({ row, col });
            dependents.push({ row, col });
          } else {
            unmatches.push({ row, col });

            for (let i = 0; i < p.length; i++) {
              const val = p.charAt(i);
              if (newNotes[row][col][val]) {
                dependents.push({ row, col });
                break;
              }
            }
          }
        }
      }
      patterns[p].dependents = dependents;
      patterns[p].matches = matches;
      patterns[p].unmatches = unmatches;
    });

    Object.keys(patterns).forEach((p) => {
      reportOnPatterns("Row " + (row + 1) + ": ", p, patterns[p]);
    });
  }

  // Check cols for pairs/triplets...
  for (let col = 0; col < 9; col++) {
    // Generate set of patterns
    let patterns = {};
    for (let row = 0; row < 9; row++) {
      patterns = {
        ...patterns,
        ...genCellNotePatterns(newNotes[row][col]),
      };
    }

    Object.keys(patterns).forEach((p) => {
      let dependents = [];
      let matches = [];
      let unmatches = [];
      for (let row = 0; row < 9; row++) {
        if (!board[row][col]) {
          if (isCandidatePatternMatch(p, newNotes[row][col])) {
            matches.push({ row, col });
            dependents.push({ row, col });
          } else {
            unmatches.push({ row, col });

            for (let i = 0; i < p.length; i++) {
              const val = p.charAt(i);
              if (newNotes[row][col][val]) {
                dependents.push({ row, col });
                break;
              }
            }
          }
        }
      }
      patterns[p].dependents = dependents;
      patterns[p].matches = matches;
      patterns[p].unmatches = unmatches;
    });

    Object.keys(patterns).forEach((p) => {
      reportOnPatterns("Col " + (col + 1) + ": ", p, patterns[p]);
    });
  }

  // Check squares for pairs/triplets
  for (let sq = 0; sq < 9; sq++) {
    // Generate set of patterns
    let patterns = {};
    const row1 = Math.floor(sq / 3) * 3;
    const col1 = (sq % 3) * 3;
    for (let row = row1; row < row1 + 3; row++) {
      for (let col = col1; col < col1 + 3; col++) {
        patterns = {
          ...patterns,
          ...genCellNotePatterns(newNotes[row][col]),
        };
      }
    }

    Object.keys(patterns).forEach((p) => {
      let dependents = [];
      let matches = [];
      let unmatches = [];
      for (let row = row1; row < row1 + 3; row++) {
        for (let col = col1; col < col1 + 3; col++) {
          if (!board[row][col]) {
            if (isCandidatePatternMatch(p, newNotes[row][col])) {
              matches.push({ row, col });
              dependents.push({ row, col });
            } else {
              unmatches.push({ row, col });

              for (let i = 0; i < p.length; i++) {
                const val = p.charAt(i);
                if (newNotes[row][col][val]) {
                  dependents.push({ row, col });
                  break;
                }
              }
            }
          }
        }
      }
      patterns[p].dependents = dependents;
      patterns[p].matches = matches;
      patterns[p].unmatches = unmatches;
    });

    Object.keys(patterns).forEach((p) => {
      reportOnPatterns("Square " + (sq + 1) + ": ", p, patterns[p]);
    });
  }
};

const genCellNotePatterns = (notes, preFix, startIdx) => {
  let patterns = {};
  for (let i = startIdx ? startIdx : 0; i < 9; i++) {
    if (notes[i]) {
      const pattern = (preFix ? preFix : "") + i;
      if (pattern.length > 1) patterns[pattern] = {};
      patterns = {
        ...patterns,
        ...genCellNotePatterns(notes, pattern, i + 1),
      };
    }
  }
  return patterns;
};

const isCandidatePatternMatch = (pattern, flags) => {
  for (let i = 0; i < 9; i++) {
    if (flags[i] && pattern.indexOf("" + i) < 0) return false;
  }
  return true;
};

const genCellNoteString = (flags) => {
  let str = "";
  for (let i = 0; i < 9; i++) {
    str = str + (flags[i] ? i : "");
  }
  return str;
};

const clearCandidateFromSquareSansRow = (
  candidate,
  square,
  exemptRow,
  notes
) => {
  const row1 = Math.floor(square / 3) * 3;
  const col1 = (square % 3) * 3;
  for (let row = row1; row < row1 + 3; row++) {
    if (row !== exemptRow) {
      for (let col = col1; col < col1 + 3; col++) {
        if (notes[row][col][candidate])
          console.log(
            "Clearing " +
              (candidate + 1) +
              " from " +
              (row + 1) +
              ", " +
              (col + 1)
          );
        notes[row][col][candidate] = false;
      }
    }
  }
};

const clearCandidateFromSquareSansCol = (
  candidate,
  square,
  exemptCol,
  notes
) => {
  const row1 = Math.floor(square / 3) * 3;
  const col1 = (square % 3) * 3;
  for (let row = row1; row < row1 + 3; row++) {
    for (let col = col1; col < col1 + 3; col++) {
      if (col !== exemptCol) {
        if (notes[row][col][candidate])
          console.log(
            "Clearing " +
              (candidate + 1) +
              " from " +
              (row + 1) +
              ", " +
              (col + 1)
          );
        notes[row][col][candidate] = false;
      }
    }
  }
};

const clearCandidateFromRowSansSquare = (candidate, row, square, notes) => {
  const exemptCol1 = (square % 3) * 3;
  console.log(
    "clearCandidateFromRowSansSquare: " +
      candidate +
      " - " +
      row +
      " - " +
      square +
      " - " +
      exemptCol1
  );
  for (let col = 0; col < 9; col++) {
    if (!(col >= exemptCol1 && col < exemptCol1 + 3)) {
      if (notes[row][col][candidate])
        console.log(
          "Clearing " +
            (candidate + 1) +
            " from " +
            (row + 1) +
            ", " +
            (col + 1) +
            " for square " +
            square
        );
      notes[row][col][candidate] = false;
    }
  }
};

const clearCandidateFromColSansSquare = (candidate, col, square, notes) => {
  const exemptRow1 = Math.floor(square / 3) * 3;
  console.log(
    "clearCandidateFromRowSansSquare: " +
      candidate +
      " - " +
      col +
      " - " +
      square +
      " - " +
      exemptRow1
  );
  for (let row = 0; row < 9; row++) {
    if (!(row >= exemptRow1 && row < exemptRow1 + 3)) {
      if (notes[row][col][candidate])
        console.log(
          "Clearing " +
            (candidate + 1) +
            " from " +
            (row + 1) +
            ", " +
            (col + 1) +
            " for square " +
            square
        );
      notes[row][col][candidate] = false;
    }
  }
};

const genCandidates = (board) => {
  const candidates = init9x9();

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      candidates[row][col] = genCellCandidates(row, col, board);
    }
  }

  return candidates;
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

export default CellModeMenu;
