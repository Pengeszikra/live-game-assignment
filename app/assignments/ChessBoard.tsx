import { useEffect } from "react";
import { useState } from "react"
import "../styles/live-games.scss";

const cellSize = 45;

enum Screens {
  INPUT, BOARD, RESULT
}

const twButton = "rounded bg-stone-200 border-2 border-gray-300 m-1 p-1 disabled:opacity-30 grow";
const twInput = "p-2 m-2 text-center bg-zinc-200 border-2 border-slate-400";

export const ChessBoard = () => {

  const [screen, setScreen ] = useState<Screens>(Screens.INPUT);
  const [dimension, setDimesion] = useState(7);
  const [amountOfSteps, setAmountOfSteps] = useState(3);
  const [board, setBoard] = useState([]);
  const [result, setResult] = useState([]);
  const [setpsAreDone, setSetpsAreDone] = useState(0);
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    setBoard(
      Array(dimension * dimension)
        .fill(0)
        .map((_, index) => index % 2)
    )
  }, [dimension])

  useEffect(() => {
    if (screen != Screens.BOARD) return;
    if (setpsAreDone >= amountOfSteps) {
      setScreen(Screens.RESULT)
    }
  }, [setpsAreDone, amountOfSteps])

  useEffect(() => {
    if (screen !== Screens.INPUT) return;
    setSetpsAreDone(0);
    setResult([]);
  }, [screen])

  const handleChangeDimension = ({target:{value}}) => setDimesion(value);
  const handleAmountOfSteps = ({target:{value}}) => setAmountOfSteps(value);

  const handleMove = (event:MouseEvent) => {
    const {target:{id}} = event;
    const [x, y] = [
      +id % dimension,
      +id / dimension | 0
    ]
    setResult(r => [...r, [x,y]]);
    setSetpsAreDone(p => p + 1);
    setFocus(+id)
  }

  return (
    <section className='relative flex min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12'>
    <main className="m-auto p-3 rounded-lg shadow-gray-700 shadow-lg font-mono bg-white">
      {
        screen === Screens.INPUT && (
          <section className="grid">
            <input className={twInput} value={dimension} onChange={handleChangeDimension}></input>
            <input className={twInput} value={amountOfSteps} onChange={handleAmountOfSteps}></input>
            <button className={twButton} onClick={() => setScreen(Screens.BOARD)}>ok</button>
          </section>
        )
      }
      {
        screen === Screens.BOARD && (
          <section className="live-area" style={{gridTemplate: `repeat(${dimension}, ${cellSize}px) / repeat(${dimension}, ${cellSize}px)`}} >
            {board.map( (item, index) => (
              <pre className="cell" key={index} id={index} data-cell={item} data-focus={focus === index} onClick={handleMove}></pre>
            ))}
            <pre className="p-2 bg-zinc-300">{`${setpsAreDone} / ${amountOfSteps}`}</pre>
          </section>    
        )
      }
      {
        screen === Screens.RESULT && (
          <section>
            <h1 className="font-size-3">Thank you</h1>
            <pre>{JSON.stringify(result)}</pre>
            <button className={twButton} onClick={() => setScreen(Screens.INPUT)}>Start Over</button>
          </section>    
        )
      }

    </main></section>
  )
}