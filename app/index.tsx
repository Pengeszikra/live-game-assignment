import React from 'react';
import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
// import { LifeGame } from './assignments/liveGame/LifeGame';
import { MultipleExample } from './assignments/MultipleExample';

const renderToAppId = (application:React.ReactElement<any, any>) => render(application, document.getElementById('app'));

renderToAppId((
  <React.StrictMode>
     <MultipleExample amount={1} />
  </React.StrictMode>
));