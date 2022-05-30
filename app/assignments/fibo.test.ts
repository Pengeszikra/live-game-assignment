const fib = n => n < 2
  ? n 
  : fib(n - 1) + fib(n - 2)
;

const fibonacci = (num, memo = {}) => {
  if (memo[num]) return memo[num];
  if (num < 2) return num;
  memo[num] = fibonacci(num - 1, memo) + fibonacci(num - 2, memo);
  return memo[num];
};

const fibExample = [0, 1, 1, 2, 3, 5, 8, 13, 21];

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

test ('fibonacci : 42 --- take so long without memoizing', () => {
  expect (
    fibonacci(42)
  ).toStrictEqual(
    267914296
  );
});