export interface Action {
  type: string;
  payload: any;
}

export type ActionArmy = {[key:string]: (payload?:any) => Action};

export type Troll<T> = [T, ActionArmy];

export type TrollFactory<T> = () => Troll<T>;