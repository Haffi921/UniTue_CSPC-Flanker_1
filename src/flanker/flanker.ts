/**
 * @title Trial
 * @description 
 * @version 0.1.0
 */

import "../../styles/main.scss";

import { initJsPsych } from "jspsych";

import { select_group } from "./select_group";
import { produce_sequence } from "./sequence";

import { trial } from "./trial";
import { between_trial } from "./between_trial";

// import fullscreen from "@jspsych/plugin-fullscreen";

export async function run() {
    const jsPsych = initJsPsych();

    const group_nr = select_group();

    const sequences = produce_sequence(group_nr, 6);
    
    const timeline = [];

    for (let sequence in sequences) {
        if(sequence !== "0") {
            timeline.push(between_trial);
        }
        timeline.push(trial(jsPsych, sequences[sequence]));
    }

    // timeline.push({ type: fullscreen, delay_after: 300 });

    await jsPsych.run(timeline);
}