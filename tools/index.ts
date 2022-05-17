const run = async () => {
    const argv = process.argv
    argv.shift()
    argv.shift()
    try {
        const scriptName = argv.shift()

        console.log('scriptname: ', scriptName)

        const{ main } = await import(`./${scriptName}`)

        const result = await main(...argv)
        console.log('result', result)
    } catch (e) {
        console.log(e)
    }
}
run()
