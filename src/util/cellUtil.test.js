import {
  addCandidateToString,
  removeCandidateFromString,
  areCellsDependent,
  getCellRow,
  getCellCol,
  getCellBox,
} from "./cellUtil";

test("gets row for cell", () => {
  expect(getCellRow(0)).toBe(0);
  expect(getCellRow(8)).toBe(0);
  expect(getCellRow(9)).toBe(1);
  expect(getCellRow(80)).toBe(8);
});

test("gets col for cell", () => {
  expect(getCellCol(0)).toBe(0);
  expect(getCellCol(1)).toBe(1);
  expect(getCellCol(2)).toBe(2);
  expect(getCellCol(8)).toBe(8);
  expect(getCellCol(9)).toBe(0);
  expect(getCellCol(17)).toBe(8);
  expect(getCellCol(80)).toBe(8);
});

test("gets box for cell", () => {
  expect(getCellBox(0)).toBe(0);
  expect(getCellBox(1)).toBe(0);
  expect(getCellBox(2)).toBe(0);
  expect(getCellBox(3)).toBe(1);
  expect(getCellBox(4)).toBe(1);
  expect(getCellBox(5)).toBe(1);
  expect(getCellBox(6)).toBe(2);
  expect(getCellBox(7)).toBe(2);
  expect(getCellBox(8)).toBe(2);

  expect(getCellBox(9)).toBe(0);
  expect(getCellBox(18)).toBe(0);
  expect(getCellBox(27)).toBe(3);
  expect(getCellBox(36)).toBe(3);
  expect(getCellBox(45)).toBe(3);
  expect(getCellBox(54)).toBe(6);
  expect(getCellBox(63)).toBe(6);

  expect(getCellBox(72)).toBe(6);
  expect(getCellBox(73)).toBe(6);
  expect(getCellBox(74)).toBe(6);
  expect(getCellBox(75)).toBe(7);
  expect(getCellBox(76)).toBe(7);
  expect(getCellBox(77)).toBe(7);
  expect(getCellBox(78)).toBe(8);
  expect(getCellBox(79)).toBe(8);
  expect(getCellBox(80)).toBe(8);
});

test("is cell claimed by", () => {
  expect(areCellsDependent(0, 0)).toBe(true);
  expect(areCellsDependent(0, 8)).toBe(true);
  expect(areCellsDependent(0, 72)).toBe(true);
  expect(areCellsDependent(0, 10)).toBe(true);
  expect(areCellsDependent(0, 20)).toBe(true);

  expect(areCellsDependent(0, 12)).toBe(false);
  expect(areCellsDependent(0, 28)).toBe(false);

  expect(areCellsDependent(40, 40)).toBe(true);
  expect(areCellsDependent(39, 40)).toBe(true);
  expect(areCellsDependent(40, 41)).toBe(true);

  expect(areCellsDependent(31, 40)).toBe(true);
  expect(areCellsDependent(40, 49)).toBe(true);

  expect(areCellsDependent(30, 40)).toBe(true);
  expect(areCellsDependent(32, 40)).toBe(true);
  expect(areCellsDependent(40, 48)).toBe(true);
  expect(areCellsDependent(40, 50)).toBe(true);

  expect(areCellsDependent(29, 40)).toBe(false);
  expect(areCellsDependent(33, 40)).toBe(false);
  expect(areCellsDependent(40, 47)).toBe(false);
  expect(areCellsDependent(40, 51)).toBe(false);
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
