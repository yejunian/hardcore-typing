// Codes from
// https://www.w3.org/TR/uievents-code/
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values

const zeroStrokeKeys = new Set([
  // Alphanumeric Section -> Functional keys
  'AltLeft',
  'AltRight',
  'Backspace',
  'CapsLock',
  'ContextMenu',
  'ControlLeft',
  'ControlRight',
  'Enter',
  'MetaLeft',
  'MetaRight',
  'ShiftLeft',
  'ShiftRight',
  'Tab',

  'Convert',
  'KanaMode',
  ...Array.from({ length: 5 }, (v, i) => `Lang${i + 1}`), // 'Lang1' - 'Lang5'
  'NonConvert',

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
  'NumLock',
  'NumpadBackspace',
  'NumpadEnter',

  // Function Section
  'Escape',
  ...Array.from({ length: 24 }, (v, i) => `F${i + 1}`), // 'F1' - 'F24'
  'Fn',
  'FnLock',
  'Pause',
  'PrintScreen',
  'ScrollLock',

  // Media Keys
  'BrowserBack',
  'BrowserFavorites',
  'BrowserForward',
  'BrowserHome',
  'BrowserRefresh',
  'BrowserSearch',
  'BrowserStop',
  'Eject',
  'LaunchApp1',
  'LaunchApp2',
  'LaunchMail',
  'MediaPlayPause',
  'MediaSelect',
  'MediaStop',
  'MediaTrackNext',
  'MediaTrackPrevious',
  'Power',
  'Sleep',
  'AudioVolumeDown',
  'AudioVolumeMute',
  'AudioVolumeUp',
  'WakeUp',

  // Legacy, Non-Standard and Special Keys
  'Hyper',
  'Super',
  'Turbo',

  'Abort',
  'Resume',
  'Suspend',

  'Again',
  'Copy',
  'Cut',
  'Find',
  'Open',
  'Paste',
  'Props',
  'Select',
  'Undo',

  'Hiragana',
  'Katakana',

  'Unidentified',
  '',

  // Not Found in the Document
  'OSLeft', // 'MetaLeft'
  'OSRight', // 'MetaRight'
  'VolumeDown', // 'AudioVolumeDown'
  'VolumeMute', // 'AudioVolumeMute'
  'VolumeUp', // 'AudioVolumeUp'
])

export default zeroStrokeKeys
