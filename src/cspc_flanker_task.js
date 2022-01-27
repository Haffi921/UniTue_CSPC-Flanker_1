/**
 * @title CSPC Flanker Task
 * @description 
 * @version 1.0.0
 *
 * The following lines specify which media directories will be packaged and preloaded by jsPsych.
 * Modify them to arbitrary paths (or comma-separated lists of paths) within the `media` directory,
 * or just delete them.
 * @imageDir images
 * @audioDir audio
 * @videoDir video
 * @miscDir misc
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import { initJsPsych } from "jspsych";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import PreloadPlugin from "@jspsych/plugin-preload";

import produce_sequence from "./sequence";

import instructions from "./sections/instructions";
import trial from "./sections/trial";
import between_trial from "./sections/between_trial";
import post_trial from "./sections/post_trial";

function select_group() {
	const group_counts = jatos.batchSession.get("condition-counter");
	let min_count = Infinity;
	let possible_groups = []

	for (let i in group_counts) {
		if (group_counts[i] < min_count) {
			min_count = group_counts[i];
			possible_groups = [i];
		}
		else if (group_counts[i] === min_count) {
			possible_groups.push(i);
		}
	}

	let selected_group = possible_groups[Math.floor(Math.random() * possible_groups.length)];
	group_counts[selected_group]++;

	jatos.batchSession.set("condition-counter", group_counts).fail(() => {
		selected_group = select_group()
	});

	return selected_group;
}

/**
 * This method will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context in which the experiment is run: `development` for `jspsych run`, `production` for `jspsych build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];, misc: string[];}} options.assetPaths An object with lists of file paths for the respective `@...Dir` pragmas
 */
export async function run({ assetPaths, input = {}, environment }) {

	const jsPsych = initJsPsych({
		exclusions: {
			min_width: 625,
			min_height: 625,
		},
		on_finish: function() {
			jatos.submitResultData(jsPsych.data.get().json(), jatos.endStudy);
		}
	});

	const group_nr = select_group();

	const timeline = [];

	// Preload assets
	timeline.push({
		type: PreloadPlugin,
		images: assetPaths.images,
		audio: assetPaths.audio,
		video: assetPaths.video,
	});

	const sequences = [
		produce_sequence(group_nr),
		produce_sequence(group_nr),
		produce_sequence(group_nr),
		produce_sequence(group_nr),
		produce_sequence(group_nr),
	]

	// Switch to fullscreen
	timeline.push({
		type: FullscreenPlugin,
		fullscreen_mode: true,
	});

	// Welcome screen
	timeline.push(instructions);

	for (let sequence of sequences) {
		timeline.push(trial(jsPsych, sequence));
		timeline.push(between_trial)
	}

	const post = post_trial(jsPsych)
	timeline.push(
		post.post_trial_instructions,
		post.post_trial,
	)

	await jsPsych.run(timeline);
}
