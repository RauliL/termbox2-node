# Termbox2 bindings for Node.js

[Node.js] bindings for [termbox2] terminal rendering library.

[Node.js]: https://nodejs.org/
[termbox2]: https://github.com/termbox/termbox2

## Installation

```bash
$ npm install --save termbox2
```

## Usage

Currently the best source of "documentation" are the
[type definitions](https://github.com/RauliL/termbox2-node/blob/main/index.d.ts)
of the library.

```JavaScript
const tb = require("termbox2");

let y = 0;

tb.init();

tb.print(0, y++, tb.Color.Green, 0, "hello from termbox");
tb.print(0, y++, 0, 0, `width=${tb.getWidth()} height=${tb.getHeight()}`);
tb.print(0, y++, 0, 0, "press any key...");
tb.present();

const ev = tb.pollEvent();

y++;
tb.print(0, y++, 0, 0, `event type=${ev.type} key=${ev.key} ch=${ev.ch}`);
tb.print(0, y++, 0, 0, "press any key to quit...");
tb.present();

tb.pollEvent();
tb.shutdown();
```

## TODO

- Input and output mode handling.
