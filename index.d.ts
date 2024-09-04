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

  type InputModeMapping = {
    Esc: number;
    Alt: number;
    Mouse: number;
  };

  type Key = KeyMapping[keyof KeyMapping];
  type KeyModifier = ModMapping[keyof ModMapping];
  type Color = ColorMapping[keyof ColorMapping];
  export type EventType = "Key" | "Mouse" | "Resize";
  type InputMode = InputModeMapping[keyof InputModeMapping];

  /**
   * An incoming event from the TTY.
   */
  export type Event = {
    /** Type of the event. */
    type: EventType;
  };

  /**
   * An incoming keyboard event from the TTY.
   */
  export type KeyEvent = Event & {
    type: "Key";
    /** Key modifier, defined in Mod enumeration. */
    mod: KeyModifier;
    /** One of the Key constants. */
    key?: Key;
    /** Unicode code point. */
    ch: number;
  };

  /**
   * An incoming mouse event from the TTY.
   */
  export type MouseEvent = Event & {
    type: "Mouse";
    /** X coordinates where the user clicked. */
    x: number;
    /** Y coordinates where the user clicked. */
    y: number;
  };

  /**
   * An incoming resize event from the TTY.
   */
  export type ResizeEvent = Event & {
    type: "Resize";
    /** New width of the terminal. */
    width: number;
    /** New height of the terminal. */
    height: number;
  };

  // Enumerations.
  export let Key: Readonly<KeyMapping>;
  export let Mod: Readonly<ModMapping>;
  export let Color: Readonly<ColorMapping>;
  export let InputMode: Readonly<InputModeMapping>;

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
    fg: Color,
    bg: Color
  ): void;

  export function peekEvent(timeout: number): Event | undefined;

  export function pollEvent(): Event;

  export function print(
    x: number,
    y: number,
    fg: Color,
    bg: Color,
    str: string
  ): void;

  /**
   * Returns the current input mode.
   */
  export function getInputMode(): InputMode;

  /**
   * Sets the input mode. Termbox has two input modes:
   *
   * 1. InputMode.Esc
   *    When escape (\x1b) is in the buffer and there's no match for an escape
   *    sequence, a key event for TB_KEY_ESC is returned.
   *
   * 2. InputMode.Alt
   *    When escape (\x1b) is in the buffer and there's no match for an escape
   *    sequence, the next keyboard event is returned with a Mod.Alt modifier.
   *
   * You can also apply InputMode.Mouse via bitwise OR operation to either of
   * the modes (e.g., InputMode.Esc | InputMode.Mouse) to receive
   * EventType.Mouse events. If none of the main two modes were set, but the
   * mouse mode was, InputMode.Esc mode is used. If for some reason you've
   * decided to use (InputMode.Esc | InputMode.Alt) combination, it will behave
   * as if only InputMode.Esc was selected.
   *
   * The default input mode is InputMode.Esc.
   */
  export function setInputMode(mode: InputMode): void;
}
