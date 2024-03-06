import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "react-big-schedule/dist/css/style.css";
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  {/* <DndProvider backend={HTML5Backend}> */}

    <App />
  {/* </DndProvider> */}
  </>,
)
