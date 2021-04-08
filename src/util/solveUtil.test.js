import {
  addCandidateToString,
  removeCandidateFromString,
  areCellsDependent,
  getCellRow,
  getCellCol,
  getCellSquare,
} from "./solveUtil";

test("gets row for cell", () => {
  expect(getCellRow(1)).toBe(1);
  expect(getCellRow(9)).toBe(1);
  expect(getCellRow(10)).toBe(2);
  expect(getCellRow(81)).toBe(9);
});

test("gets col for cell", () => {
  expect(getCellCol(1)).toBe(1);
  expect(getCellCol(9)).toBe(9);
  expect(getCellCol(10)).toBe(1);
  expect(getCellCol(18)).toBe(9);
  expect(getCellCol(81)).toBe(9);
});

test("gets square for cell", () => {
  expect(getCellSquare(1)).toBe(1);
  expect(getCellSquare(2)).toBe(1);
  expect(getCellSquare(3)).toBe(1);
  expect(getCellSquare(4)).toBe(2);
  expect(getCellSquare(5)).toBe(2);
  expect(getCellSquare(6)).toBe(2);
  expect(getCellSquare(7)).toBe(3);
  expect(getCellSquare(8)).toBe(3);
  expect(getCellSquare(9)).toBe(3);

  expect(getCellSquare(10)).toBe(1);
  expect(getCellSquare(19)).toBe(1);
  expect(getCellSquare(28)).toBe(4);
  expect(getCellSquare(37)).toBe(4);
  expect(getCellSquare(46)).toBe(4);
  expect(getCellSquare(55)).toBe(7);
  expect(getCellSquare(64)).toBe(7);

  expect(getCellSquare(73)).toBe(7);
  expect(getCellSquare(74)).toBe(7);
  expect(getCellSquare(75)).toBe(7);
  expect(getCellSquare(76)).toBe(8);
  expect(getCellSquare(77)).toBe(8);
  expect(getCellSquare(78)).toBe(8);
  expect(getCellSquare(79)).toBe(9);
  expect(getCellSquare(80)).toBe(9);
  expect(getCellSquare(81)).toBe(9);
});

test("is cell claimed by", () => {
  expect(areCellsDependent(1, 1)).toBe(true);
  expect(areCellsDependent(1, 9)).toBe(true);
  expect(areCellsDependent(1, 73)).toBe(true);
  expect(areCellsDependent(1, 11)).toBe(true);
  expect(areCellsDependent(1, 21)).toBe(true);

  expect(areCellsDependent(1, 13)).toBe(false);
  expect(areCellsDependent(1, 29)).toBe(false);

  expect(areCellsDependent(41, 41)).toBe(true);
  expect(areCellsDependent(40, 41)).toBe(true);
  expect(areCellsDependent(41, 42)).toBe(true);

  expect(areCellsDependent(32, 41)).toBe(true);
  expect(areCellsDependent(41, 50)).toBe(true);

  expect(areCellsDependent(31, 41)).toBe(true);
  expect(areCellsDependent(33, 41)).toBe(true);
  expect(areCellsDependent(41, 49)).toBe(true);
  expect(areCellsDependent(41, 51)).toBe(true);

  expect(areCellsDependent(30, 41)).toBe(false);
  expect(areCellsDependent(34, 41)).toBe(false);
  expect(areCellsDependent(41, 48)).toBe(false);
  expect(areCellsDependent(41, 52)).toBe(false);
});

test("adds candidate to string", () => {
  expect(addCandidateToString("3", "123")).toBe("123");
  expect(addCandidateToString("3", "")).toBe("3");
  expect(addCandidateToString("3", "2")).toBe("23");
  expect(addCandidateToString("3", "872")).toBe("2378");
});

test("removes candidate from string", () => {
  expect(removeCandidateFromString("3", "")).toBe("");
  expect(removeCandidateFromString("3", "3")).toBe("");
  expect(removeCandidateFromString("3", "123")).toBe("12");
  expect(removeCandidateFromString("3", "234")).toBe("24");
});
