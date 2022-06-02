import { useEffect } from "react";
import { useState } from "react"
import "../styles/live-games.scss";

const cellSize = 45;

enum Screens {
  INPUT, BOARD, RESULT
}

export const ChessBoard = () => {

  const [screen, setScreen ] = useState<Screens>(Screens.INPUT);
  const [dimension, setDimesion] = useState(7);
  const [amountOfSteps, setAmountOfSteps] = useState(1);
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
    <main>
      {
        screen === Screens.INPUT && (
          <section className="grid">
            <input className="p-2 m-2 text-center" value={dimension} onChange={handleChangeDimension}></input>
            <input className="p-2 m-2 text-center" value={amountOfSteps} onChange={handleAmountOfSteps}></input>
            <button className="p-2 m-2 bg-slate-300" onClick={() => setScreen(Screens.BOARD)}>ok</button>
          </section>
        )
      }
      {
        screen === Screens.BOARD && (
          <section className="live-area" style={{gridTemplate: `repeat(${dimension}, ${cellSize}px) / repeat(${dimension}, ${cellSize}px)`}} >
            {board.map( (item, index) => (
              <pre className="cell" key={index} id={index} data-cell={item} data-focus={focus === index} onClick={handleMove}></pre>
            ))}
            <pre>{`${setpsAreDone} / ${amountOfSteps}`}</pre>
          </section>    
        )
      }
      {
        screen === Screens.RESULT && (
          <section>
            <h1>Thank you</h1>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            <button onClick={() => setScreen(Screens.INPUT)}>Start Over</button>
          </section>    
        )
      }

    </main>
  )
}