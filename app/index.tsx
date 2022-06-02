import React from 'react';
import { render } from "react-dom";
import { ChessBoard } from './assignments/ChessBoard';
// import { LifeGame } from './assignments/liveGame/LifeGame';
import { MultipleExample } from './assignments/MultipleExample';
import './tailwind-import.css';

const renderToAppId = (application:React.ReactElement<any, any>) => render(application, document.getElementById('app'));

renderToAppId((
  <React.StrictMode>
    <ChessBoard />
  </React.StrictMode>
));