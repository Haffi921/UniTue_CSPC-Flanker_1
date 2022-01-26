declare const jatos: any;

(function initBatchConditions() {
	if (!jatos.batchSession.defined("/condition-counter")) {
		jatos.batchSession.set("condition-counter", [0, 0, 0, 0])
			.fail(initBatchConditions);
	}
})();

export function select_group() {
	const group_counts: number[] = jatos.batchSession.get("condition-counter");
	let min_count = Infinity;
	let possible_groups: number[] = []

	for (let i in group_counts) {
		if (group_counts[i] < min_count) {
			min_count = group_counts[i];
			possible_groups = [Number(i)];
		}
		else if (group_counts[i] === min_count) {
			possible_groups.push(Number(i));
		}
	}

	let selected_group = possible_groups[Math.floor(Math.random() * possible_groups.length)];
	group_counts[selected_group]++;

	jatos.batchSession.set("condition-counter", group_counts).fail(() => {
		selected_group = select_group()
	});

	return selected_group;
}