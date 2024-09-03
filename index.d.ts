declare module "termbox2" {
  type KeyMapping = {
    CtrlTidle: number;
    Ctrl2: number;
    CtrlA: number;
    CtrlB: number;
    CtrlC: number;
    CtrlD: number;
    CtrlE: number;
    CtrlF: number;
    CtrlG: number;
    Backspace: number;
    CtrlH: number;
    Tab: number;
    CtrlI: number;
    CtrlJ: number;
    CtrlK: number;
    CtrlL: number;
    Enter: number;
    CtrlM: number;
    CtrlN: number;
    CtrlO: number;
    CtrlP: number;
    CtrlQ: number;
    CtrlR: number;
    CtrlS: number;
    CtrlT: number;
    CtrlU: number;
    CtrlV: number;
    CtrlW: number;
    CtrlX: number;
    CtrlY: number;
    CtrlZ: number;
    CtrlLSQBracket: number;
    Esc: number;
    Ctrl3: number;
    Ctrl4: number;
    CtrlBackslash: number;
    Ctrl5: number;
    CtrlRSQBracket: number;
    Ctrl6: number;
    Ctrl7: number;
    CtrlSlash: number;
    CtrlUnderscore: number;
    Space: number;
    Backspace2: number;
    Ctrl8: number;
    F1: number;
    F2: number;
    F3: number;
    F4: number;
    F5: number;
    F6: number;
    F7: number;
    F8: number;
    F9: number;
    F10: number;
    F11: number;
    F12: number;
    Insert: number;
    Delete: number;
    Home: number;
    End: number;
    PageUp: number;
    PageDown: number;
    ArrowUp: number;
    ArrowDown: number;
    ArrowLeft: number;
    ArrowRight: number;
    BackTab: number;
    MouseLeft: number;
    MouseRight: number;
    MouseMiddle: number;
    MouseRelease: number;
    MouseWheelUp: number;
    MouseWheelDown: number;
  };

  type ModMapping = {
    Alt: number;
    Ctrl: number;
    Shift: number;
    Motion: number;
  };

  type ColorMapping = {
    Default: number;
    Black: number;
    Red: number;
    Green: number;
    Yellow: number;
    Blue: number;
    Magenta: number;
    Cyan: number;
    White: number;
    Bold: number;
    Underline: number;
    Reverse: number;
    Italic: number;
    Blink: number;
  };

  type EventTypeMapping = {
    Key: number;
    Resize: number;
    Mouse: number;
  };

  /**
   * An incoming event from the TTY.
   */
  export type Event = {
    /** Type of event, defined in `EventType` enumeration. */
    type: EventTypeMapping[keyof EventTypeMapping];
    /** Key modifier, defined in `Mod` enumeration. */
    mod: ModMapping[keyof ModMapping];
    /** Key code, defined in `Key` enumeration. */
    key: KeyMapping[keyof KeyMapping];
    /** Unicode codepoint. */
    ch: number;
    /** Resize width. */
    w: number;
    /** Resize height. */
    h: number;
    /** Mouse X coordinates. */
    x: number;
    /** Mouse Y coordinates. */
    y: number;
  };

  // Enumerations.
  export let Key: Readonly<KeyMapping>;
  export let Mod: Readonly<ModMapping>;
  export let Color: Readonly<ColorMapping>;
  export let EventType: Readonly<EventTypeMapping>;

  /**
   * Initializes the termbox library. This function should be called before
   * any other functions.
   */
  export function init(): void;

  export function init(ttyfd: number): void;

  export function init(path: string): void;

  export function init(rfd: number, wfd: number): void;

  export function shutdown(): void;

  export function getWidth(): number;

  export function getHeight(): number;

  /**
   * Clears the screen.
   */
  export function clear(): void;

  /**
   * Draws buffer to the screen.
   */
  export function present(): void;

  /**
   * Sets position of the cursor. Upper-left character is (0, 0).
   */
  export function setCursor(x: number, y: number): void;

  export function hideCursor(): void;

  /**
   * Set cell contents in the internal back buffer at the specified position.
   */
  export function setCell(
    x: number,
    y: number,
    ch: number,
    fg: ColorMapping[keyof ColorMapping],
    bg: ColorMapping[keyof ColorMapping]
  ): void;

  export function peekEvent(timeout: number): Event | undefined;

  export function pollEvent(): Event;

  export function print(
    x: number,
    y: number,
    fg: ColorMapping[keyof ColorMapping],
    bg: ColorMapping[keyof ColorMapping],
    str: string
  ): void;
}
