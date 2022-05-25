export enum PLAY { STOP, START }
export enum CELL { DEAD, LIVE }

export interface ICell {
  cell: CELL,
  hash: string,
}

export type TArea = ICell[];
