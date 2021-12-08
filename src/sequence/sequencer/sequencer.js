import _ from "lodash";

function sequencer(weights, trial_types) {
    let w = _.cloneDeep(weights);
    const sum = arr => arr.reduce((a, b) => a + b, 0);

    const nr_trials = sum(w);
    let trials = Array(nr_trials).fill(0);
    const probabilities = w.map(a => a / nr_trials).map((a, i, d) => i == 0 ? a : a + sum(d.slice(0, i)));

    function get_index() {
        const r = Math.random();
        return probabilities.findIndex(a => r < a);
    }

    for (let trial in trials) {
        let found = false;
        while (!found) {
            const factor = get_index();
            if (w[factor] > 0) {
                trials[trial] = factor;
                --w[factor];
                found = true;
            }
        }
    }

    if (trial_types) {
        return trials.map(a => Object.assign({}, trial_types[a]));
    }
    else {
        return trials;
    }
}

module.exports = sequencer