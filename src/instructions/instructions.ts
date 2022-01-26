/**
 * @title Instructions
 * @description 
 * @version 0.1.0
 */

import "../../styles/main.scss";

import { initJsPsych } from "jspsych";

import fullscreen from "@jspsych/plugin-fullscreen";

import instructions from "./instruction_pages";

export async function run() {
	const jsPsych = initJsPsych();

	const timeline = [];

	timeline.push({ type: fullscreen, delay_after: 300 });

	timeline.push(instructions);

	await jsPsych.run(timeline);
}
