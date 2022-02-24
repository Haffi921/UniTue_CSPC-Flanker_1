import _ from "lodash";

export function counterbalancer(weights) {
  const sum = (arr) => arr.reduce((a, b) => a + b, 0);
  const sum2d = (arr) => arr.reduce((a, b) => a + sum(b), 0);

  let trials = Array(sum2d(weights)).fill(NaN);

  const probabilities = weights
    .map((a) => a.map((b) => b / sum(a)))
    .map((a) =>
      a.map((b, j, inner) => (j == 0 ? b : b + sum(inner.slice(0, j))))
    );

  function get_index(last_index) {
    const r = Math.random();
    return probabilities[last_index].findIndex((a) => r < a);
  }

  restart: while (true) {
    let w = _.cloneDeep(weights);
    for (let trial in trials) {
      if (trial == 0) {
        trials[trial] = Math.floor(Math.random() * w.length);
        --w[trials[trial]][trials[trial]];
        continue;
      }
      const last_index = trials[trial - 1];
      let found = false;
      let tries = 0;
      while (!found) {
        const new_index = get_index(last_index);
        if (w[last_index][new_index] > 0) {
          trials[trial] = new_index;
          --w[last_index][new_index];
          found = true;
        }
        ++tries;
        if (tries > w[last_index].length * 5) {
          continue restart;
        }
      }
    }
    break;
  }

  return trials;
}
