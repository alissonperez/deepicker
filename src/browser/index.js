/*!
 * deepicker library
 * https://alissonperez.github.io/deepicker/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://alissonperez.github.io/deepicker/LICENSE
 */

import deepicker from '../index'

((global, factory) => {

  'use strict'

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = global.document ?
      factory(global, true) :
      ((w) => {
        if (!w.document) {
          throw new Error( 'deepicker requires a window with a document' )
        }
        return factory(w)
      })
  } else {
    factory(global)
  }

// Pass this if window is not defined yet
})(typeof window !== 'undefined' ? window : this, (window) => {
  // Map over the deepicker in case of overwrite
  const _deepicker = window.deepicker

  if (window.deepicker === deepicker) window.deepicker = _deepicker
  if (!window.deepicker) window.deepicker = deepicker
})
