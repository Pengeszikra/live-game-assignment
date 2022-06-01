const productionList = [
  {production: 'Apple', category: 'Fruit'},
  {production: 'Cherry', category: 'Fruit'},
  {production: 'Mazda', category: 'Car'},
]

const salesList = [
  {production: 'Apple', sales: 362},
  {production: 'Cherry', sales: 111},
  {production: 'Mazda', sales: 3},
];

const sqlQuery = (itemDB, saleDB) => saleDB.reduce(
  (acu, {production, sales}) => {
    const {category} = itemDB.find(({production:id}) => id === production)
    if (!category) return acu;
    return acu[category]
      ? {...acu, [category]: acu[category] + sales}
      : {...acu, [category]: sales}
    ;
  }
, {});

test ('basic group test', () => {
  expect (
    sqlQuery(productionList, salesList)
  ).toStrictEqual(
    {Fruit: 362 + 111, Car: 3}
  );
});

test ('filtered test', () => {
  expect (
    sqlQuery(productionList, salesList.filter(({sales}) => sales > 100))
  ).toStrictEqual(
    {Fruit: 362 + 111}
  );
});