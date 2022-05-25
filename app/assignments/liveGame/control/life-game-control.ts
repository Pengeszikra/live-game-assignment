import { PLAY } from "./lifeGameDeclaration";
import {  } from 'react-troll';

export const cellSize = 22;
export const gridWidth = 22;
export const gridHeight = 22;
export const speed = 32;


const [area, setArea] = useState<TArea>([]);
const [debugNh, setDebugNh] = useState<number[]>([]);
const [round, setRound] = useState<number>(0);
const [countOfPlay, setCountOfPlay] = useState<number>(0);
const [width, setWidth] = useState<number>(gridWidth);
const [height, setHeight] = useState<number>(gridHeight);
const [isPlaying, playControll] = useState<PLAY>(PLAY.STOP);

export const 
  SET_AREA = action('setArea'),
  SET_DEBUG_NH = action('setDebugNh'),
  SET_ROUND = action('setRound'),
  SET_COUNT_OF_PLAY = action('setCountOfPlay'),
  SET_WIDTH = action('setWidth'),
  SET_HEIGHT = action('setHeight'),
  PLAY_CONTROLL = action('playControll'),
;

export const gameInitialState = {
  area: [],
  debugNh: [],
  round: 0,
  countOfPlay: 0,
  width: 100, 
  height: 100,
  isPlaying: PLAY.STOP
}