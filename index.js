import { readFile, cp, readdir } from 'fs/promises'

const parseDay = (day) => {
    if (!day) return '01'
    if (typeof day !== 'string') day = String(day)
    if (day.length < 2) return day.padStart(2, '0')
    return day
}

const mode = {
    new: 'new',
    run: 'run'
}

if (process.argv[2] === mode.new) {
    const days = (await readdir('./days')).map(Number).filter(i => !isNaN(i))
    const nextDay = Math.max(...days) + 1
    await cp('./days/.template', `./days/${parseDay(nextDay)}`, { recursive: true })
} else {
    const day = parseDay(process.argv[3])
    const module = await import(`./days/${day}/index.js`)
    const inputs = (await readFile(`./days/${day}/input.txt`, 'utf-8')).split('\n')
    const { silver, gold } = module.default
    
    const di = {}
    
    const silverResult = await silver(inputs, di)
    const goldResult = await gold(inputs, di)
    
    console.table({ silverResult, goldResult })
}

