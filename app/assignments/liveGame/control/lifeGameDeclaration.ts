export enum PLAY { STOP, START }
export enum CELL { DEAD = 0, LIVE = 1}

export interface ICell {
  cell: CELL,
  hash: string,
}

export type TArea = ICell[];
