import "./App.css";
import AppProviders from "./AppProviders";
import Board from "./components/Board";
import ExperimentalMenu from "./components/ExpirementalMenu";
import Menu from "./components/Menu";
import NumberBar from "./components/NumberBar";

function App() {

  return (
    <AppProviders>
      <div className="App">
        <div>
          <Board />
          <NumberBar />
        </div>
        <Menu />
        <ExperimentalMenu />
      </div>
    </AppProviders>
  );
}

export default App;
