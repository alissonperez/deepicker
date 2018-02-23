'use strict'

const config = {
  editor: {
    fontSize: 10.5,
    mode: 'ace/mode/javascript',
    theme: 'ace/theme/monokai',

    initialize: () => {
      const { output, submit } = interaction.ui
      const editor = ace.edit('js-input')

      submit.addEventListener('click', e => {
        e.preventDefault()
        config.run(editor.getValue())
      })

      // TODO: Refactor editor settings values
      editor.renderer.setShowGutter(false)
      editor.session.setMode(config.editor.mode)

      editor.setFontSize(config.editor.fontSize)
      editor.setShowPrintMargin(false)
      editor.setTheme(config.editor.theme)
      editor.setValue(config.initialValues.defaultScript, 1)

      editor.commands.addCommand({
        name: 'run',
        bindKey: { win: 'Ctrl-enter', mac: 'Command-enter' },
        exec: () => config.run(editor.getValue())
      })
      editor.commands.addCommand({
        name: 'clear',
        bindKey: { win: 'Ctrl-K', mac: 'Command-K' },
        exec: () => config.writeOn(output, '')
      })

      return config
    },
  },

  initialValues: {
    defaultScript:
      `const picker = deepicker.simplePicker(include, exclude)\
      \n\nconsole.log(picker.pick(JSON.parse(sampleObject)))`,
    exclude: 'bar.foo.other,bar.baz',
    include: 'foo,bar',
    sampleObject: {
      foo: 'bar',
      bar: {
        baz: 'test',
        foo: {
          other: 'value',
          otherInt: 10,
        }
      },
    },

    run: () => {
      config.run(config.initialValues.defaultScript)

      return config
    },
  },

  getUI: selector => document.querySelector(selector),

  run: (evalue) => {
    config.setVariables()
    eval(evalue)
  },

  setVariables: () => {
    const { exclude, include, sample } = interaction.ui

    window.exclude = exclude.value
    window.include = include.value
    window.sampleObject = sample.value
  },

  writeOn: (object, value) => {
    if (value) { object.innerHTML += value } else { object.innerHTML = '' }

    return object
  }
}

const interaction = {
  ui: {
    output: config.getUI('#js-output'),
    exclude: config.getUI('#exclude'),
    include: config.getUI('#include'),
    sample: config.getUI('#sample-object'),
    submit: config.getUI('#js-run'),
  },

  initialize: () => {
    const { exclude, include, sample } = interaction.ui

    sample.value = JSON.stringify(config.initialValues.sampleObject, null, 2)
    include.value = config.initialValues.include
    exclude.value = config.initialValues.exclude

    config
      .initialValues.run()
      .editor.initialize()
  },

  // override console log fn
  setupConsole: () => {
    if (!console) console = {}

    const { output } = interaction.ui

    const log = (rawMessage, error = false, before = '<hr/> <small>&gt;</small>') => {
      let updatedMessage = ''

      if (typeof rawMessage === 'object') {
        updatedMessage += `<pre>${JSON.stringify(rawMessage, undefined, 2)}</pre>`
      } else { updatedMessage = rawMessage }

      config
        .writeOn(output, `${before} ${error ? '⚠️' : ''} ${updatedMessage}`)
        .scrollTop = output.scrollHeight
    }

    console = {
      error: (rawMessage) => log(rawMessage, true),

      log: log.bind(this),
    }

    window.onerror = (error) => console.error(error)
  },
};

(() => {
  interaction.setupConsole()
  interaction.initialize()
})()
