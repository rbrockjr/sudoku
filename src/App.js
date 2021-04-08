import "./App.css";
import React, { useContext, useEffect } from "react";
import Board from "./components/Board";
import Menu from "./components/Menu";
import NumberBar from "./components/NumberBar";
import { BoardContext } from "./util/boardContext";
import { boards } from "./boards";

function App() {
  const context = useContext(BoardContext);
  const { initBoard } = context;

  useEffect(() => {
    const rand = Math.random();
    const idx = Math.floor(boards.length * rand);
    initBoard(boards[idx]);
  }, []);

  return (
    <div className="App">
      <div>
        <Board />
        <NumberBar />
      </div>
      <Menu />
    </div>
  );
}

export default App;
