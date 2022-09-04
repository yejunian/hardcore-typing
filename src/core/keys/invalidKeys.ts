// Codes from
// https://www.w3.org/TR/uievents-code/
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values

const invalidKeys = new Set([
  // Alphanumeric Section -> Functional keys
  'Backspace',

  // Control Pad Section
  'Delete',
  'End',
  'Help',
  'Home',
  'Insert',
  'PageDown',
  'PageUp',

  // Arrow Pad Section
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',

  // Numpad Section
  'NumpadBackspace',

  // Legacy, Non-Standard and Special Keys
  'Again',
  'Copy',
  'Cut',
  'Find',
  'Open',
  'Paste',
  'Props',
  'Select',
  'Undo',
])

export default invalidKeys
