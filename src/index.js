import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GlobalProvider } from './util/globalContext';
import { BoardProvider } from './util/boardContext';
import { ChainProvider } from './util/chainContext';
import Toaster from './toast/Toaster';

ReactDOM.render(
  <React.StrictMode>
    <Toaster>
      <GlobalProvider>
        <BoardProvider>
          <ChainProvider>
            <App />
          </ChainProvider>
        </BoardProvider>
      </GlobalProvider>
    </Toaster>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
