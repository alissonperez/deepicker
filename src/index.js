const simpleParser = require('./parsers/simple')
const xpathParser = require('./parsers/xpath')
const picker = require('./picker')

// TODO: Tests for this module

function _picker (includeStr, excludeStr, parser) {
  if (!includeStr || typeof includeStr !== 'string') {
    includeStr = undefined
  }

  if (!excludeStr || typeof excludeStr !== 'string') {
    excludeStr = undefined
  }

  return picker((includeStr && parser(includeStr)) || {},
    (excludeStr && parser(excludeStr)) || {})
}

function simplePicker (includeStr, excludeStr) {
  return _picker(includeStr, excludeStr, simpleParser)
}

function xpathPicker (includeStr, excludeStr) {
  return _picker(includeStr, excludeStr, xpathParser)
}

module.exports = {
  picker,
  xpathPicker,
  simplePicker,
}
