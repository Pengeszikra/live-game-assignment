import { useEffect, useState, useCallback, memo } from 'react';
import { FC, MouseEvent} from 'react';
import '../../styles/live-games.scss';
import { hash } from './library/hash';
import { inRange } from './library/inRange';
import { increase } from './library/increase';
import { calcNeighboursDistances } from './control/calcNeighboursDistances';
import { TArea, CELL, ICell, PLAY } from './control/lifeGameDeclaration';

export const cellSize = 18;
export const gridWidth = 30;
export const gridHeight = 30;
export const speed = 64;

export type TMouseEventHandler = (event?:MouseEvent) => void;

export interface ICellVisual {
  hash: string;
  cell:CELL;
  neighbour?: number;
  onClick?: TMouseEventHandler;
}

export const logMouseEvent:TMouseEventHandler = (event) => {console.log(event)};

const CellVisual:FC<ICellVisual> = ({hash, cell, neighbour, onClick = logMouseEvent}) =>  <div className="cell" key={hash} data-cell={cell} data-around={neighbour} onClick={onClick}>{neighbour}</div>
const CellVisualNoDebug:FC<ICellVisual> = ({hash, cell, onClick = logMouseEvent}) =>  <div className="cell" key={hash} data-cell={cell} onClick={onClick}></div>
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
      (_, index) => ({cell: Math.random() > .75 ? CELL.LIVE : CELL.DEAD, hash:`${index % width}:${index / width | 0}`})
    );
    setArea(defaultArea);
    setRound(0);
    setScore(0);
    const amountOfNeighbours:(position:number) => number = countNeighbours(defaultArea);
    setDebugNh(defaultArea.map((_,i) => amountOfNeighbours(i)));

  }, [countOfPlay])

  useEffect(() => {
    if (!isEditing) return;
    const amountOfNeighbours:(position:number) => number = countNeighbours(area);
    setDebugNh(area.map((_,i) => amountOfNeighbours(i)));
  }, [area])
  
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

  const handleEdit = (seek) => (event:MouseEvent) => {
    setArea(area => area.map(item => seek === item.hash 
      ? item.cell === CELL.DEAD 
        ? {hash:item.hash, cell:CELL.LIVE}
        : {hash:item.hash, cell:CELL.DEAD}
      : item
    ));
  };
  
  const clearArea = () => {
    if (!isEditing) return;
    const clearArea:TArea = Array.from(
      {length: width * height},
      (_, index) => ({cell: CELL.DEAD, hash:`${index % width}:${index / width | 0}`})
    );
    setArea(clearArea);  
  }

  const twButton = "rounded bg-stone-200 border-2 border-gray-300 m-1 p-1 disabled:opacity-30 grow";

  return (
    <section className='relative flex min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12'>
      <main className="m-auto p-3 rounded-lg shadow-gray-700 shadow-lg font-mono bg-white">
        <section className='flex'>
          <button className={twButton} onClick={() => {if (!isEditing) {setRound(0);setScore(0)};setEditing(!isEditing)}}>edit {isEditing ? " on" : "off"}</button>
          <button className={twButton} onClick={clearArea} disabled={!isEditing}>clear</button>
          <button className={twButton} onClick={() => setRound(increase)} disabled={isEditing}>next step</button>
          <button className={twButton} onClick={() => {setCountOfPlay(increase); playControll(PLAY.STOP)}} disabled={isEditing}>random</button>
          <button className={twButton} onClick={() => playControll(isPlaying ? PLAY.STOP : PLAY.START)} disabled={isEditing}>{isPlaying ? 'stop' : 'play'}</button>
          <button className={twButton} onClick={() => setDebug(p => !p)}>{isDebug ? 'debug' : 'simple'}</button>
        </section>
          <section className="m-2">
            <span>round: {round} </span>
            <span>life: {liveCounter} </span>
            <span>score: {score} </span>
          </section>
        <section className="live-area" style={{gridTemplate: `repeat(${height}, ${cellSize}px) / repeat(${width}, ${cellSize}px)`}}>
          { 
            area.map(({cell, hash}, index) => {
              return ( 
                isDebug
                  ? <QuickCellWithDebug cell={cell} hash={hash} neighbour={debugNh[index]} onClick={handleEdit(hash)}/>
                  : <QuickCell cell={cell} hash={hash} onClick={handleEdit(hash)}/>
              );
            })
          }
        </section>
      </main>
    </section>
  )
}