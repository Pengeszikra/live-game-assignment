type Memoized<T> = (parameter:T, memo?:T[]) => T;

const fib:Memoized<number> = index => index < 2
  ? index 
  : fib(index - 1) + fib(index - 2)
;

const reducerFibo = (index) => Array(index)
  .fill(0)
  .reduce((acu) => [...acu, acu.at(-1) + acu.at(-2)],  [0, 1])
  .at(index)
;

const fibonacci:Memoized<number> = (index, memo = []) => {
  if (memo[index]) return memo[index];
  if (index < 2) return index;
  memo[index] = fibonacci(index - 1, memo) + fibonacci(index - 2, memo);
  return memo[index];
};

const fibExample:number[] = [0, 1, 1, 2, 3, 5, 8, 13, 21];

test ('fibonacci : 3', () => {
  expect (
    fib(3)
  ).toStrictEqual(
    fibExample[3]
  );
});

test ('fibonacci : each of example', () => {
  const series = fibExample.map((_, index) => fib(index));
  expect (
    series
  ).toStrictEqual(
    fibExample
  );
});

test ('memoised fibonacci : each of example', () => {
  const series = fibExample.map((_, index) => fibonacci(index));
  expect (
    series
  ).toStrictEqual(
    fibExample
  );
});

test ('worst fibonacci : each of example', () => {
  const series = fibExample.map((_, index) => reducerFibo(index));
  expect (
    series
  ).toStrictEqual(
    fibExample
  );
});

test ('fibonacci : 42 --- take so long without memoizing', () => {
  expect (
    fibonacci(42)
  ).toStrictEqual(
    267914296
  );
});