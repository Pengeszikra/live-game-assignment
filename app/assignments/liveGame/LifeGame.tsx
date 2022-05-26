import {useEffect, useState, useCallback, FC, memo} from 'react';
import '../../styles/live-games.scss';
import { hash } from './library/hash';
import { inRange } from './library/inRange';
import { increase } from './library/increase';
import { calcNeighboursDistances } from './control/calcNeighboursDistances';
import { TArea, CELL, ICell, PLAY } from './control/lifeGameDeclaration';

export const cellSize = 22;
export const gridWidth = 27;
export const gridHeight = 27;
export const speed = 64;

export interface ICellVisual {
  hash: string;
  cell:CELL;
  neighbour?: number;
}
const CellVisual:FC<ICellVisual> = ({hash, cell, neighbour}) =>  <div className="cell" key={hash} data-cell={cell}>{neighbour}</div>
const CellVisualNoDebug:FC<ICellVisual> = ({hash, cell}) =>  <div className="cell" key={hash} data-cell={cell}></div>
const QuickCell = memo(CellVisualNoDebug);
const QuickCellWithDebug = memo(CellVisual);
 
export const LifeGame:FC = () => {
  const [area, setArea] = useState<TArea>([]);
  const [debugNh, setDebugNh] = useState<number[]>([]);
  const [round, setRound] = useState<number>(0);
  const [countOfPlay, setCountOfPlay] = useState<number>(0);
  const [width, setWidth] = useState<number>(gridWidth);
  const [height, setHeight] = useState<number>(gridHeight);
  const [isPlaying, playControll] = useState<PLAY>(PLAY.STOP);
  const [isDebug, setDebug] = useState<boolean>(false);
  const [isEditing, setEditing] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [liveCounter, setLiveCounter] = useState<number>(0);


  const neighboursIndex:number[][] = useCallback(calcNeighboursDistances(width, height), [width, height]);

  useEffect(() => console.log(neighboursIndex), [neighboursIndex]);

  useEffect(() => {
    const defaultArea:TArea = Array.from(
      {length: width * height},
      _ => ({cell: Math.random() > .75 ? CELL.LIVE : CELL.DEAD, hash:hash()})
    );
    setArea(defaultArea);
    setRound(0);
    setScore(0);
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
    isDebug && setDebugNh(newGeneration.map((_,i) => amountOfNeighbours(i)));
    const countOfLive = area.reduce((sum, {cell}) => sum + (cell === CELL.LIVE ? 1 : 0), 0);
    setScore(score => countOfLive === liveCounter ? score : score + countOfLive);
    setLiveCounter(countOfLive);
  }, [round, width, height]);

  return (
    <main>
      <section className="live-control" style={{fontFamily:'monospace'}}>
        <button onClick={() => setEditing(!isEditing)}>edit {isEditing ? " on" : "off"}</button>
        <button onClick={() => setRound(increase)} disabled={isEditing}>next step</button>
        <button onClick={() => {setCountOfPlay(increase); playControll(PLAY.STOP)}} disabled={isEditing}>random</button>
        <button onClick={() => playControll(isPlaying ? PLAY.STOP : PLAY.START)} disabled={isEditing}>{isPlaying ? 'stop' : 'play'}</button>
        <button onClick={() => setDebug(p => !p)}>{isDebug ? 'debug' : 'simple'}</button>
        <span style={{marginLeft:'1em'}}>
          <span>round: {round} </span>
          <span>life: {liveCounter} </span>
          <span>score: {score} </span>
        </span>
      </section>
      <section className="live-area" style={{gridTemplate: `repeat(${height}, ${cellSize}px) / repeat(${width}, ${cellSize}px)`}}>
        { 
          area.map(({cell, hash}, index) => ( 
            isDebug
              ? <QuickCellWithDebug cell={cell} hash={hash} neighbour={debugNh[index]} />
              : <QuickCell cell={cell} hash={hash} />
          ))
        }
      </section>
    </main>
  )
}