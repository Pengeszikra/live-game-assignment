import React from 'react';
import { render } from "react-dom";
// import { LifeGame } from './assignments/liveGame/LifeGame';
import { MultipleExample } from './assignments/MultipleExample';
import './tailwind-import.css';

const renderToAppId = (application:React.ReactElement<any, any>) => render(application, document.getElementById('app'));

renderToAppId((
  <React.StrictMode>
     <MultipleExample amount={1} />
  </React.StrictMode>
));