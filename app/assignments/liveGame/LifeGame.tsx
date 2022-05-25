import {useEffect, useState, useCallback, FC, memo} from 'react';
import '../../styles/live-games.scss';
import { hash } from './library/hash';
import { inRange } from './library/inRange';
import { increase } from './library/increase';
import { calcNeighboursDistances } from './control/calcNeighboursDistances';
import { TArea, CELL, ICell, PLAY } from './control/lifeGameDeclaration';

export const cellSize = 22;
export const gridWidth = 20;
export const gridHeight = 20;
export const speed = 32;

export interface ICellVisual {
  hash: string;
  cell:CELL;
  neighbour: number;
}
const CellVisual:FC<ICellVisual> = ({hash, cell, neighbour}) =>  <div className="cell" key={hash} data-cell={cell}>{neighbour}</div>
const QuickCell = memo(CellVisual);
 
export const LifeGame:FC = () => {
  const [area, setArea] = useState<TArea>([]);
  const [debugNh, setDebugNh] = useState<number[]>([]);
  const [round, setRound] = useState<number>(0);
  const [countOfPlay, setCountOfPlay] = useState<number>(0);
  const [width, setWidth] = useState<number>(gridWidth);
  const [height, setHeight] = useState<number>(gridHeight);
  const [isPlaying, playControll] = useState<PLAY>(PLAY.STOP);


  const neighboursIndex:number[][] = useCallback(calcNeighboursDistances(width, height), [width, height]);

  useEffect(() => console.log(neighboursIndex), [neighboursIndex]);

  useEffect(() => {
    const defaultArea:TArea = Array(width * height)
      .fill({cell:CELL.DEAD, hash:''})
      .map(_ => ({cell: Math.random() > .75 ? CELL.LIVE : CELL.DEAD, hash:hash()}))
    setArea(defaultArea);
    setRound(0);
    const amountOfNeighbours:(position:number) => number = countNeighbours(defaultArea);
    setDebugNh(defaultArea.map((_,i) => amountOfNeighbours(i)));

  }, [countOfPlay])
  
  const countNeighbours = (area:TArea) => (position:number) => neighboursIndex[position].reduce(
    (count:number, neighbourIndex:number) => count = area[neighbourIndex].cell
      ? count + 1
      : count
    ,0
  );

  const nextGeneration:(old:TArea) => TArea = parentArea => {
    const amountOfNeighbours:(position:number) => number = countNeighbours(parentArea);
    
    const mustDie = (acu:Object ,cell:ICell, position:number) => !inRange(2,3)(amountOfNeighbours(position)) 
      ? {...acu, [cell.hash]:CELL.LIVE}
      : acu
    ;
    const mustBorn = (acu:Object, cell:ICell, position:number) => amountOfNeighbours(position) === 3
      ? {...acu, [cell.hash]:CELL.LIVE}
      : acu
    ;

    const dieHashes:{} = parentArea.reduce(mustDie, {});
    const bornHashes:{} = parentArea.reduce(mustBorn, {});

    const dieProgress = ({cell, hash}:ICell) => ({
      cell: dieHashes?.[hash] ? CELL.DEAD : cell, 
      hash
    });

    const bornProgress = ({cell, hash}:ICell) => ({
      cell: bornHashes?.[hash] ? CELL.LIVE : cell, 
      hash
    });


    return parentArea
      .map(dieProgress)
      .map(bornProgress)
    ;
  }

  useEffect(() => {
    if (isPlaying !== PLAY.START) return null;
    const timer = setInterval(() => setRound(increase), speed);
    return () => clearInterval(timer);
  }, [isPlaying])

  useEffect(() => {
    if (round === 0) return null;
    const newGeneration = nextGeneration(area);
    setArea(newGeneration);
    const amountOfNeighbours:(position:number) => number = countNeighbours(newGeneration);
    setDebugNh(newGeneration.map((_,i) => amountOfNeighbours(i)));
  }, [round, width, height]);

  return (
    <main>
      <section className="live-control">
        <h2>Live Game Assignment</h2>
        <p>round: {round}</p>
        <button onClick={() => setRound(increase)}>next step</button>
        <button onClick={() => setCountOfPlay(increase)}>random</button>
        <button onClick={() => playControll(isPlaying ? PLAY.STOP : PLAY.START)}>{isPlaying ? 'stop' : 'play'}</button>
      </section>
      <section className="live-area" style={{gridTemplate: `repeat(${height}, ${cellSize}px) / repeat(${width}, ${cellSize}px)`}}>
        {
          area.map(({cell, hash}, index) => (
            <QuickCell cell={cell} hash={hash} neighbour={debugNh[index]} />
          ))
        }
      </section>
    </main>
  )
}