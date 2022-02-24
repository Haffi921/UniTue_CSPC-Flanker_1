import { initJsPsych } from "jspsych";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";

import { produce_sequence } from "./sequence";

import instructions from "./sections/instructions";
import trial from "./sections/trial";
import between_trial from "./sections/between_trial";
import post_trial from "./sections/post_trial";

function record_group(group_nr) {
  const conditions = jatos.batchSession.get("condition-counter");
  conditions[group_nr]++;
  jatos.batchSession.set("condition-counter", conditions);
}

function run(group) {
  const group_nr = group ? 0 : jatos.studySessionData.group;

  const jsPsych = initJsPsych({
    exclusions: {
      min_width: 625,
      min_height: 625,
    },
    on_finish: function () {
      jatos
        .submitResultData(jsPsych.data.get().csv())
        .then(() => record_group(group_nr))
        .then(() => jatos.endStudy());
    },
  });

  const timeline = [];

  const sequences = [
    // Practice
    produce_sequence(group_nr, "practice", 1, 0).slice(0, 20),
    // Trial
    produce_sequence(group_nr, "trial", 1, 0),
    produce_sequence(group_nr, "trial", 2, 0),
    produce_sequence(group_nr, "trial", 3, 1),
    produce_sequence(group_nr, "trial", 4, 1),
  ];

  // Switch to fullscreen
  timeline.push({
    type: FullscreenPlugin,
    fullscreen_mode: true,
  });

  // Welcome screen
  timeline.push(instructions);

  for (let sequence of sequences) {
    timeline.push(trial(jsPsych, sequence));
    timeline.push(between_trial);
  }

  timeline.push(
    post_trial(
      jsPsych,
      5,
      (group_nr === 0) | (group_nr === 2)
        ? "Mostly Congruent"
        : "Mostly Incongruent",
      (group_nr === 0) | (group_nr === 2)
        ? "Mostly Incongruent"
        : "Mostly Congruent"
    )
  );

  jsPsych.data.addProperties({
    subject: jatos.studyResultId,
    workerID: jatos.workerId,
    prolificPID: jatos.urlQueryParameters.PROLIFIC_PID,
    prolificSID: jatos.urlQueryParameters.STUDY_ID,
    prolificSEID: jatos.urlQueryParameters.SESSION_ID,
  });

  jsPsych.run(timeline);
}

jatos.onLoad(() => {
  jatos.showBeforeUnloadWarning(true);
  run();
});
