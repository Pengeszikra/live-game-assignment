import React from 'react';
import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { LifeGame } from './assignments/liveGame/LifeGame';

const renderToAppId = (application:React.ReactElement<any, any>) => render(application, document.getElementById('app'));

renderToAppId((
  <React.StrictMode>
    <LifeGame />
  </React.StrictMode>
));