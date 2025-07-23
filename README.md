# Battleship Solitaire

[![Vitest CI](https://github.com/gnattily/battleship-solitaire/actions/workflows/vitest.yml/badge.svg)](https://github.com/gnattily/battleship-solitaire/actions/workflows/vitest.yml)
[![ESLint](https://github.com/gnattily/battleship-solitaire/actions/workflows/eslint.yml/badge.svg)](https://github.com/gnattily/battleship-solitaire/actions/workflows/eslint.yml)
[![CodeQL](https://github.com/gnattily/battleship-solitaire/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/gnattily/battleship-solitaire/actions/workflows/github-code-scanning/codeql)

Battleship solitaire is a Japanese-style logic puzzle in which one deduces the positions of ships
based on the number in each row and column, the number of each length of ship, and some basic [rules](#Rules).
This is a [Next.js](https://nextjs.org) rendition of that puzzle meant to automatically solve any*
puzzle you throw at it.

> \*_Cannot solve hardmode puzzles like those on [lukerissacher.com](https://lukerissacher.com/battleships),
> see [about](#About)_

## About
This repository served primarily as a vessel through which I learned [React.js](https://react.dev).
This was a logic puzzle that I did extensively in elementary school. The idea of creating a tool to
automatically solve these simple puzzles seemed like a great small project, and thus this repository
was born. It's grown to become my largest project, with full unit testing (on the main logic files)
and thousands of lines of code. I've refactored many, many times, including switching from
[CRA](https://create-react-app.dev) to [Next](https://nextjs.org), migrating to TypeScript, and more.

Although this tool can solve any puzzle that can be completed through pure logic, some websites like
[lukerissacher.com](https://lukerissacher.com/battleships) can also create puzzles that can only be
solved with guess-and-check. Initially this was a planned feature, but I've since limited the scope
of this project so I could move on to new plans. This tool can still help with these puzzles, but it
is not designed for them and will require much manual input.

### Rules
There are only a few rules to this game:
- Ships cannot touch, even diagonally.
- There cannot be more ships in a row/column than is specified at the top/side.
- The number of ships of each length must match that specified by the puzzle.
- There are only horizontal/vertical ships. They cannot be diagonal.

## Deploying Locally
Deploying a local server is extremely simple.

Install [Node.js](https://nodejs.org), then run these commands:
```sh
npm install -g pnpm@latest-10 # pnpm is like npm, but much faster
pnpm i # install dependencies
pnpm build # compile the project
pnpm start # run the server
```
Your new web server should now be accessible at [localhost:3000](http://localhost:3000).

> 💡 **Tip**: for a development server, use `pnpm dev` instead to auto-reload after changes.

## Contributing
If you would like to contribute to the project, you are more than welcome, so long as you follow our
[Code of Conduct](./CODE_OF_CONDUCT.md). Here's a couple commands to get you started:

```sh
pnpm dev # start a development server
pnpm lint # lint your code with ESLint
pnpm test # run unit tests on your code
```

If you use Visual Studio Code, we also recommend the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).
It catches styling errors as you code, drastically speeding up development compared to only using
`pnpm lint`. Additionally, you can enable ESLint as a formatter through its settings menu (Eslint
\> Format: Enable).

## Export Specification
Boards can be exported to base 64 through the `Board.export` function. Exported boards can be imported
via `Board.from`, which returns a new Board with the imported data. Here is each property exported with
the number of bits it uses:

| property  |        number of bits         |    type   |
|-----------|:-----------------------------:|:---------:|
| width     |              8                |   number  |
| height    |              8                |   number  |
| solveData |              1                |  boolean  |
| colCounts | `a = ceil(log2(width)) + 1`   |  number[] |
| rowCounts | `b = ceil(log2(height)) + 1`  |  number[] |
| runs      | `8 + max(a, b) * numRuns * 2` |  number[] |
| state     | 6 to `width * height * 5`     | see below |

> **Note**: colCounts, rowCounts, and runs are only present if solveData is true.

> **Note**: the runs property is in the format (length of ship, count), both taking the same
> number of bits.

The state property is a bit more complicated. Normal squares are in the format (pinned: 1b, type:
4b). For sequences of unknown squares or water, `.export` adds `11111` to denote unknown squares and
`11110` to denote sequences of water. It then appends one less than the number of squares in the sequence
in `ceil(log2(width * height + 1))` bits.

For more details, view the `.export` method directly in [Board.ts](./src/app/_board/Board.ts)
