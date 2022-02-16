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

/**
 * This method will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context in which the experiment is run: `development` for `jspsych run`, `production` for `jspsych build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];, misc: string[];}} options.assetPaths An object with lists of file paths for the respective `@...Dir` pragmas
 */

function record_group(group_nr) {
	const conditions = jatos.batchSession.get("condition-counter");
	conditions[group_nr]++;
	jatos.batchSession.set("condition-counter", conditions);
}

const abortStudy = () => jatos.endStudy(false);

export async function run({ assetPaths, input = {}, environment }) {
	
	const group_nr = jatos.studySessionData.group;

	const jsPsych = initJsPsych({
		exclusions: {
			min_width: 625,
			min_height: 625,
		},
		on_finish: function() {
			jatos.submitResultData(jsPsych.data.get().csv())
				.then(() => record_group(group_nr))
				.then(() => removeEventListener("unload", abortStudy))
				.then(() => jatos.endStudy());
		}
	});

	const timeline = [];

	// Preload assets
	timeline.push({
		type: PreloadPlugin,
		images: assetPaths.images,
		audio: assetPaths.audio,
		video: assetPaths.video,
	});

	const sequences = [
		// Practice
		produce_sequence(group_nr, "practice", 1).slice(0, 20),

		// Trial
		produce_sequence(group_nr, "trial", 1),
		produce_sequence(group_nr, "trial", 2),
		produce_sequence(group_nr, "trial", 3),
		produce_sequence(group_nr, "trial", 4),
		produce_sequence(group_nr, "trial", 5),
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
	
	jatos.onLoad(() => {
		jatos.showBeforeUnloadWarning();
		addEventListener("unload", abortStudy);
		jsPsych.data.addProperties({subject: jatos.studyResultId});
		jsPsych.run(timeline);
	})
}
