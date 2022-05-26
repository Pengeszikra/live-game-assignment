import {FC} from 'react';
import { LifeGame } from './liveGame/LifeGame';

import '../styles/dual.scss';

interface IMultipleExample {amount:number;}

export const MultipleExample:FC<IMultipleExample> = ({amount = 1}) => {
  
  const containerKeys = Array(amount).fill(0).map((_, i:number) => i + 1);

  return (
    <main className="dual-main" data-amount={amount}>
      {containerKeys.map(key => (
        <div key={key} data-key={key} className="dual-window">
          <LifeGame />
        </div>
        )
      )}
    </main>
  );
}