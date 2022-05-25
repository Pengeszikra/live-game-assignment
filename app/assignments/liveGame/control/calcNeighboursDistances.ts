import { inRange } from "../library/inRange";

export const calcNeighboursDistances:(width:number, height:number) => number[][] = 
  (width:number, height:number) => {
    const neighboursDistance:number[] = [
      -1 -width, -width, +1-width,
      -1, +1,
      -1 +width, +width, +1+width,
    ];

    const leftBorder:number[] = [1, 2, 4, 6, 7];
    const rightBorder:number[] = [0, 1, 3, 5, 6];

    const withoutLeftBorder:(x:number) => (d:number, n:number) => boolean = 
      (x:number) => (distance:number, neighbourDistanceIndex:number) => x === 0 
        ? leftBorder.includes(neighbourDistanceIndex)
        : true
      ;

    const withoutRightBorder:(x:number) => (d:number, n:number) => boolean = 
      (x:number) => (distance:number, neighbourDistanceIndex) => x === width-1 
        ? rightBorder.includes(neighbourDistanceIndex)
        : true
      ;

    const amount:number = width * height;
    const isInside:(n:number) => boolean = inRange(0, amount - 1);

    return Array(amount)
      .fill(0)
      .map(
        (_, index:number) => {
          const x:number = index % width;
          return neighboursDistance
            .filter(withoutLeftBorder(x))
            .filter(withoutRightBorder(x))
            .map((distance:number) => distance + index)
            .filter((distance:number) => isInside(distance))
          ;
        }
      )
    ;
  };
