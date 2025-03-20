import React from 'react';
import ReactDOM from 'react-dom';
import './globals.css';
import App from './App';

import FileProvider from "./context/FileContext";
// import StateProvider from "./context/StateContext";
import LanguageServerProvider from './context/LanguageServerContext'

ReactDOM.render(
  <React.StrictMode>
	<FileProvider>
	  {/*<StateProvider>*/}
		<LanguageServerProvider>
		  <App />
		</LanguageServerProvider>
	  {/*</StateProvider>*/}
	</FileProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
