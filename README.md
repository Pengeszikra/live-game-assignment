# Life Game Assignment

## Development Story

### *First turning point*
After few coding iterations, I found two mayor problem:
- This moment my code based on 11 x useState(), that is so messy and confusing. Even on devtool for react is not able to show state names.
- Program is slowing down if world size above 24 x 24. Two reason behind this:
  - render to grid with div elements, but test without rendering show the real problem is the next one
  - calculate next generation containt too many array operations

### *Refact to useReducer*
I will reafact codebase with help of react-troll to useReducer.

### *Optimalization*
I will change the model to simple Int8Array, plus use one cell higher area, which one is simplify the work with border points.

# Build

> Build :: ```react```, ```typescript```, ```webpack```, ```jest```.

## Prerequisite:
  - ```npm``` v8.1+
  - ```nodejs``` v17+
  - ```yarn``` v1.22+  (npm is enough)
  - ```serve``` (or any other static site serving alternatives)

## Terminal commands (bash, gitbash):

Prepare repo: ```yarn```

Hot reload develompent: ```yarn start```

Build:
```bash
yarn build
serve ./dist
```

Lint: ```yarn lint```

Test: ```yarn test```

Test Driven Development: ```yarn watch```