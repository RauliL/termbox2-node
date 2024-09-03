#include <thread>

#include <napi.h>

#include "./termbox2.h"

using namespace Napi;

static inline void
init_check(const CallbackInfo& info, int value)
{
  if (value == TB_ERR_NOT_INIT)
  {
    Error::New(
      info.Env(),
      "Termbox has not been initialized"
    ).ThrowAsJavaScriptException();
  }
}

static inline Number
init_check_return(const CallbackInfo& info, int value)
{
  init_check(info, value);

  return Number::New(info.Env(), value);
}

static inline void
get_coordinates(const CallbackInfo& info, int& x, int& y)
{
  if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber())
  {
    TypeError::New(
      info.Env(),
      "Number expected"
    ).ThrowAsJavaScriptException();
  }
  x = info[0].As<Number>().Int32Value();
  y = info[1].As<Number>().Int32Value();
}

static Value
func_init(const CallbackInfo& info)
{
  const auto length = info.Length();
  int result = -1;

  if (length == 0)
  {
    result = tb_init();
  }
  else if (length == 1)
  {
    if (info[0].IsNumber())
    {
      result = tb_init_fd(info[0].As<Number>().Int32Value());
    }
    else if (info[0].IsString())
    {
      result = tb_init_file(info[0].As<String>().Utf8Value().c_str());
    } else {
      TypeError::New(
        info.Env(),
        "Either string or number expected"
      ).ThrowAsJavaScriptException();
    }
  }
  else if (length > 1)
  {
    if (!info[0].IsNumber() || !info[0].IsNumber())
    {
      TypeError::New(
        info.Env(),
        "Number expected"
      ).ThrowAsJavaScriptException();
    }
    result = tb_init_rwfd(
      info[0].As<Number>().Int32Value(),
      info[1].As<Number>().Int32Value()
    );
  }

  if (result != TB_OK)
  {
    Error::New(info.Env(), tb_strerror(result)).ThrowAsJavaScriptException();
  }

  return info.Env().Undefined();
}

static Value
func_shutdown(const CallbackInfo& info)
{
  tb_shutdown();

  return info.Env().Undefined();
}

static Value
func_get_width(const CallbackInfo& info)
{
  return init_check_return(info, tb_width());
}

static Value
func_get_height(const CallbackInfo& info)
{
  return init_check_return(info, tb_height());
}

static Value
func_clear(const CallbackInfo& info)
{
  init_check(info, tb_clear());

  return info.Env().Undefined();
}

static Value
func_present(const CallbackInfo& info)
{
  init_check(info, tb_present());

  return info.Env().Undefined();
}

static Value
func_set_cursor(const CallbackInfo& info)
{
  int x;
  int y;

  get_coordinates(info, x, y);
  init_check(info, tb_set_cursor(x, y));

  return info.Env().Undefined();
}

static Value
func_hide_cursor(const CallbackInfo& info)
{
  init_check(info, tb_hide_cursor());

  return info.Env().Undefined();
}

static Value
func_set_cell(const CallbackInfo& info)
{
  int x;
  int y;

  get_coordinates(info, x, y);
  if (
    info.Length() < 5 ||
    !info[2].IsNumber() ||
    !info[3].IsNumber() ||
    !info[4].IsNumber()
  )
  {
    TypeError::New(
      info.Env(),
      "Number expected"
    ).ThrowAsJavaScriptException();
  }
  init_check(
    info,
    tb_set_cell(
      x,
      y,
      info[2].As<Number>().Uint32Value(),
      info[3].As<Number>().Int32Value(),
      info[4].As<Number>().Int32Value()
    )
  );

  return info.Env().Undefined();
}

static Value
handle_event(const CallbackInfo& info, bool peek)
{
  const auto& env = info.Env();

  if (peek && (info.Length() < 1 || !info[0].IsNumber()))
  {
    TypeError::New(
      env,
      "Number expected"
    ).ThrowAsJavaScriptException();
  }

  for (;;)
  {
    tb_event e;
    const auto result =
      peek
        ? tb_peek_event(&e, info[0].As<Number>().Int32Value())
        : tb_poll_event(&e);

    if (result == TB_ERR_NO_EVENT)
    {
      if (peek && tb_last_errno() == EINTR)
      {
        continue;
      }

      return env.Undefined();
    }
    else if (result == TB_OK)
    {
      const auto event = Object::New(env);

      event.Set("type", Number::New(env, e.type));
      event.Set("mod", Number::New(env, e.mod));
      event.Set("key", Number::New(env, e.key));
      event.Set("ch", Number::New(env, e.ch));
      event.Set("w", Number::New(env, e.w));
      event.Set("h", Number::New(env, e.h));
      event.Set("x", Number::New(env, e.y));
      event.Set("y", Number::New(env, e.x));

      return event;
    } else {
      Error::New(env, tb_strerror(result)).ThrowAsJavaScriptException();
    }
  }
}

static Value
func_peek_event(const CallbackInfo& info)
{
  return handle_event(info, true);
}

static Value
func_poll_event(const CallbackInfo& info)
{
  return handle_event(info, false);
}

static Value
func_print(const CallbackInfo& info)
{
  const auto length = info.Length();
  int x;
  int y;

  get_coordinates(info, x, y);
  if (length < 5 || !info[2].IsNumber() || !info[3].IsNumber())
  {
    TypeError::New(
      info.Env(),
      "Number expected"
    ).ThrowAsJavaScriptException();
  }
  if (!info[4].IsString())
  {
    TypeError::New(
      info.Env(),
      "String expected"
    ).ThrowAsJavaScriptException();
  }

  init_check(
    info,
    tb_print(
      x,
      y,
      info[2].As<Number>().Int32Value(),
      info[3].As<Number>().Int32Value(),
      info[4].As<String>().Utf8Value().c_str()
    )
  );

  return info.Env().Undefined();
}

Object
init(Env env, Object exports)
{
  auto key = Object::New(env);
  auto mod = Object::New(env);
  auto color = Object::New(env);
  auto eventType = Object::New(env);

  exports.Set("init", Function::New(env, func_init));
  exports.Set("shutdown", Function::New(env, func_shutdown));

  exports.Set("getWidth", Function::New(env, func_get_width));
  exports.Set("getHeight", Function::New(env, func_get_height));

  exports.Set("clear", Function::New(env, func_clear));
  exports.Set("present", Function::New(env, func_present));

  exports.Set("setCursor", Function::New(env, func_set_cursor));
  exports.Set("hideCursor", Function::New(env, func_hide_cursor));

  exports.Set("setCell", Function::New(env, func_set_cell));

  exports.Set("peekEvent", Function::New(env, func_peek_event));
  exports.Set("pollEvent", Function::New(env, func_poll_event));

  exports.Set("print", Function::New(env, func_print));

  key.Set("CtrlTilde", Number::New(env, TB_KEY_CTRL_TILDE));
  key.Set("Ctrl2", Number::New(env, TB_KEY_CTRL_2));
  key.Set("CtrlA", Number::New(env, TB_KEY_CTRL_A));
  key.Set("CtrlB", Number::New(env, TB_KEY_CTRL_B));
  key.Set("CtrlC", Number::New(env, TB_KEY_CTRL_C));
  key.Set("CtrlD", Number::New(env, TB_KEY_CTRL_D));
  key.Set("CtrlE", Number::New(env, TB_KEY_CTRL_E));
  key.Set("CtrlF", Number::New(env, TB_KEY_CTRL_F));
  key.Set("CtrlG", Number::New(env, TB_KEY_CTRL_G));
  key.Set("Backspace", Number::New(env, TB_KEY_BACKSPACE));
  key.Set("CtrlH", Number::New(env, TB_KEY_CTRL_H));
  key.Set("Tab", Number::New(env, TB_KEY_TAB));
  key.Set("CtrlI", Number::New(env, TB_KEY_CTRL_I));
  key.Set("CtrlJ", Number::New(env, TB_KEY_CTRL_J));
  key.Set("CtrlK", Number::New(env, TB_KEY_CTRL_K));
  key.Set("CtrlL", Number::New(env, TB_KEY_CTRL_L));
  key.Set("Enter", Number::New(env, TB_KEY_ENTER));
  key.Set("CtrlM", Number::New(env, TB_KEY_CTRL_M));
  key.Set("CtrlN", Number::New(env, TB_KEY_CTRL_N));
  key.Set("CtrlO", Number::New(env, TB_KEY_CTRL_O));
  key.Set("CtrlP", Number::New(env, TB_KEY_CTRL_P));
  key.Set("CtrlQ", Number::New(env, TB_KEY_CTRL_Q));
  key.Set("CtrlR", Number::New(env, TB_KEY_CTRL_R));
  key.Set("CtrlS", Number::New(env, TB_KEY_CTRL_S));
  key.Set("CtrlT", Number::New(env, TB_KEY_CTRL_T));
  key.Set("CtrlU", Number::New(env, TB_KEY_CTRL_U));
  key.Set("CtrlV", Number::New(env, TB_KEY_CTRL_V));
  key.Set("CtrlW", Number::New(env, TB_KEY_CTRL_W));
  key.Set("CtrlX", Number::New(env, TB_KEY_CTRL_X));
  key.Set("CtrlY", Number::New(env, TB_KEY_CTRL_Y));
  key.Set("CtrlZ", Number::New(env, TB_KEY_CTRL_Z));
  key.Set("Esc", Number::New(env, TB_KEY_ESC));
  key.Set("CtrlLSQBracket", Number::New(env, TB_KEY_CTRL_LSQ_BRACKET));
  key.Set("Ctrl3", Number::New(env, TB_KEY_CTRL_3));
  key.Set("Ctrl4", Number::New(env, TB_KEY_CTRL_4));
  key.Set("CtrlBackslash", Number::New(env, TB_KEY_CTRL_BACKSLASH));
  key.Set("Ctrl5", Number::New(env, TB_KEY_CTRL_5));
  key.Set("CtrlRSQBracket", Number::New(env, TB_KEY_CTRL_RSQ_BRACKET));
  key.Set("Ctrl6", Number::New(env, TB_KEY_CTRL_6));
  key.Set("Ctrl7", Number::New(env, TB_KEY_CTRL_7));
  key.Set("CtrlSlash", Number::New(env, TB_KEY_CTRL_SLASH));
  key.Set("CtrlUnderscore", Number::New(env, TB_KEY_CTRL_UNDERSCORE));
  key.Set("Space", Number::New(env, TB_KEY_SPACE));
  key.Set("Backspace2", Number::New(env, TB_KEY_BACKSPACE2));
  key.Set("Ctrl8", Number::New(env, TB_KEY_CTRL_8));
  key.Set("F1", Number::New(env, TB_KEY_F1));
  key.Set("F2", Number::New(env, TB_KEY_F2));
  key.Set("F3", Number::New(env, TB_KEY_F3));
  key.Set("F4", Number::New(env, TB_KEY_F4));
  key.Set("F5", Number::New(env, TB_KEY_F5));
  key.Set("F6", Number::New(env, TB_KEY_F6));
  key.Set("F7", Number::New(env, TB_KEY_F7));
  key.Set("F8", Number::New(env, TB_KEY_F8));
  key.Set("F9", Number::New(env, TB_KEY_F9));
  key.Set("F10", Number::New(env, TB_KEY_F10));
  key.Set("F11", Number::New(env, TB_KEY_F11));
  key.Set("F12", Number::New(env, TB_KEY_F12));
  key.Set("Insert", Number::New(env, TB_KEY_INSERT));
  key.Set("Delete", Number::New(env, TB_KEY_DELETE));
  key.Set("Home", Number::New(env, TB_KEY_HOME));
  key.Set("End", Number::New(env, TB_KEY_END));
  key.Set("PageUp", Number::New(env, TB_KEY_PGUP));
  key.Set("PageDown", Number::New(env, TB_KEY_PGDN));
  key.Set("ArrowUp", Number::New(env, TB_KEY_ARROW_UP));
  key.Set("ArrowDown", Number::New(env, TB_KEY_ARROW_DOWN));
  key.Set("ArrowLeft", Number::New(env, TB_KEY_ARROW_LEFT));
  key.Set("ArrowRight", Number::New(env, TB_KEY_ARROW_RIGHT));
  key.Set("BackTab", Number::New(env, TB_KEY_BACK_TAB));
  key.Set("MouseLeft", Number::New(env, TB_KEY_MOUSE_LEFT));
  key.Set("MouseRight", Number::New(env, TB_KEY_MOUSE_RIGHT));
  key.Set("MouseMiddle", Number::New(env, TB_KEY_MOUSE_MIDDLE));
  key.Set("MouseRelease", Number::New(env, TB_KEY_MOUSE_RELEASE));
  key.Set("MouseWheelUp", Number::New(env, TB_KEY_MOUSE_WHEEL_UP));
  key.Set("MouseWheelDown", Number::New(env, TB_KEY_MOUSE_WHEEL_DOWN));
  key.Freeze();

  mod.Set("Alt", Number::New(env, TB_MOD_ALT));
  mod.Set("Ctrl", Number::New(env, TB_MOD_CTRL));
  mod.Set("Shift", Number::New(env, TB_MOD_SHIFT));
  mod.Set("Motion", Number::New(env, TB_MOD_MOTION));
  mod.Freeze();

  color.Set("Default", Number::New(env, TB_DEFAULT));
  color.Set("Black", Number::New(env, TB_BLACK));
  color.Set("Red", Number::New(env, TB_RED));
  color.Set("Green", Number::New(env, TB_GREEN));
  color.Set("Yellow", Number::New(env, TB_YELLOW));
  color.Set("Blue", Number::New(env, TB_BLUE));
  color.Set("Magenta", Number::New(env, TB_MAGENTA));
  color.Set("Cyan", Number::New(env, TB_CYAN));
  color.Set("White", Number::New(env, TB_WHITE));
  color.Set("Bold", Number::New(env, TB_BOLD));
  color.Set("Underline", Number::New(env, TB_UNDERLINE));
  color.Set("Reverse", Number::New(env, TB_REVERSE));
  color.Set("Italic", Number::New(env, TB_ITALIC));
  color.Set("Blink", Number::New(env, TB_BLINK));
  color.Freeze();

  eventType.Set("Key", Number::New(env, TB_EVENT_KEY));
  eventType.Set("Resize", Number::New(env, TB_EVENT_RESIZE));
  eventType.Set("Mouse", Number::New(env, TB_EVENT_MOUSE));
  eventType.Freeze();

  exports.Set("Key", key);
  exports.Set("Mod", mod);
  exports.Set("Color", color);
  exports.Set("EventType", eventType);

  return exports;
}

NODE_API_MODULE(termbox2, init)
