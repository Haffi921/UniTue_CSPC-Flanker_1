import _ from "lodash";

interface trial {
    distractor: string,
    target: string,
    congruency: string,
    type: string,
    correct_key: string,
}

export default function sequencer(weights: number[], trial_types: trial[]) {
    let w: number[] = _.cloneDeep(weights);
    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

    const nr_trials = sum(w);
    let trials: number[] = Array(nr_trials).fill(0);
    const probabilities = w.map((a: number) => a / nr_trials).map((a, i, d) => i == 0 ? a : a + sum(d.slice(0, i)));

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

    return trials.map(a => Object.assign({}, trial_types[a]));
}