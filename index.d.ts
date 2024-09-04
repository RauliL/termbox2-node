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
    HiBlack: number;
  };

  type InputModeMapping = {
    Esc: number;
    Alt: number;
    Mouse: number;
  };

  type OutputModeMapping = {
    Normal: number;
    "256": number;
    "216": number;
    Grayscale: number;
  };

  type Key = KeyMapping[keyof KeyMapping];
  type KeyModifier = ModMapping[keyof ModMapping];
  type Color = ColorMapping[keyof ColorMapping];
  export type EventType = "Key" | "Mouse" | "Resize";
  type InputMode = InputModeMapping[keyof InputModeMapping];
  type OutputMode = OutputModeMapping[keyof OutputModeMapping];

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
  export let OutputMode: Readonly<OutputModeMapping>;

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

  /**
   * Returns the current output mode.
   */
  export function getOutputMode(): OutputMode;

  /**
   * Sets the termbox output mode. Termbox has multiple output modes:
   *
   * 1. OutputMode.Normal     => [0..8]
   *
   *    This mode provides 8 different colors:
   *    Color.Black, Color.Red, Color.Green, Color.Yellow,
   *    Color.Blue, Color.Magenta, Color.Cyan, Color.White
   *
   *    Plus Color.Default which skips sending a color code (i.e., uses the
   *    terminal's default color).
   *
   *    Colors (including Color.Default) may be bitwise OR'd with attributes:
   *    Color.Bold, Color.Underline, Color.Reverse, Color.Italic, Color.Blink,
   *    Color.Bright, Color.Dim
   *
   *    As in all modes, the value 0 is interpreted as Color.Default for
   *    convenience.
   *
   *    Some notes: Color.Reverse can be applied as either fg or bg attributes
   *    for the same effect. Color.Bright can be applied to either fg or bg.
   *    The rest of the attributes apply to fg only and are ignored as bg
   *    attributes.
   *
   *    Example usage:
   *      setCell(x, y, '@'.charCodeAt(0), Color.Black | Color.Bold, Color.Red);
   *
   * 2. OutputMode['256']        => [0..255] + Color.HiBlack
   *
   *    In this mode you get 256 distinct colors (plus default):
   *                0x00   (1): Color.Default
   *         Color.Black   (1): Color.Black in OutputMode.Normal
   *          0x01..0x07   (7): the next 7 colors as in OutputMode.Normal
   *          0x08..0x0f   (8): bright versions of the above
   *          0x10..0xe7 (216): 216 different colors
   *          0xe8..0xff  (24): 24 different shades of gray
   *
   *    All Color.* style attributes except Color.Bright may be bitwise OR'd
   *    as in OutputMode.Normal.
   *
   *    Note Color.HiBlack must be used for black, as 0x00 represents default.
   *
   * 3. OutputMode['216']        => [0..216]
   *
   *    This mode supports the 216-color range of OutputMode['256'] only, but
   *    you don't need to provide an offset:
   *                0x00   (1): Color.Default
   *          0x01..0xd8 (216): 216 different colors
   *
   * 4. OutputMode.Grayscale     => [0..24]
   *
   *    This mode supports the 24-color range of OutputMode['256'] only, but
   *    you don't need to provide an offset:
   *                0x00   (1): Color.Default
   *          0x01..0x18  (24): 24 different shades of gray
   *
   * The default output mode is OutputMode.Normal.
   *
   * To use the terminal default color (i.e., to not send an escape code), pass
   * Color.Default. For convenience, the value 0 is interpreted as
   * Color.Default in all modes.
   *
   * Note, not all terminals support all output modes, especially beyond
   * OutputMode.Normal. There is also no very reliable way to determine color
   * support dynamically. If portability is desired, callers are recommended to
   * use OutputMode.Normal or make output mode end-user configurable. The same
   * advice applies to style attributes.
   */
  export function setOutputMode(mode: OutputMode): void;
}
