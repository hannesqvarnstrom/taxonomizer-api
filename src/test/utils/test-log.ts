import cliclr from 'cli-color'

class TestLog {
  on: boolean

  constructor(environment: string) {
    if (['test', 'development'].includes(environment)) {
      this.on = true
    }
  }

  suite(suite: string) {
    console.log(cliclr.black.bgMagentaBright('\n' + suite))
  }

  start(test: Tap.Test) {
    if (!this.on) return
    const name = '  ' + test.name
    console.log(cliclr.white.bgBlue('\n' + name))
  }

  succeed() { 
    if (!this.on) return
    console.log(cliclr.green('Test successful! \n'))
  }
}

export default new TestLog(process.env.NODE_ENV)