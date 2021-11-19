function counterbalancer(weights) {
    const sum = arr => arr.reduce((a, b) => a + b, 0)
    const sum2d = arr => arr.reduce((a, b) => a + sum(b), 0)
    const length2d = arr => arr.reduce((a, b) => a + b.length, 0)
    
    let trials = Array(sum2d(weights)).fill(0)

    const probabilities = weights
        .map(a => a.map(b => b / sum(a)))
        .map(a => a.map(
                (b, j, inner) => (j == 0 ? b : b + sum(inner.slice(0, j)))
            )
        )

    function get_index(last_index) {
        const r = Math.random()
        return probabilities[last_index].findIndex(a => r < a)
    }

    restart:
    for (let trial in trials) {
        if (trial == 0) {
            trials[trial] = Math.floor(Math.random() * weights.length)
            continue
        }
        const last_index = trials[trial - 1]
        let found = false
        let tries = 0
        while (!found) {
            const new_index = get_index(last_index)
            if (weights[last_index][new_index] > 0) {
                trials[trial] = new_index
                --weights[last_index][new_index]
                found = true
                continue
            }
            ++tries
            if(tries > weights[last_index].length) continue restart
        }
    }

    return trials
}

module.exports = counterbalancer