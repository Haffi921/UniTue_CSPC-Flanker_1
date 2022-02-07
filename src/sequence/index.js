const counterbalancer = require("./sequencer/counterbalancer");
const sequencer = require("./sequencer/sequencer");

const MOSTLY_CONGRUENT = [32, 8, 32, 8, 5, 5, 5, 5];
const MOSTLY_INCONGRUENT = [8, 32, 8, 32, 5, 5, 5, 5];
const EQUAL_SWITCHREP = [[50, 50], [50, 50]];
const MOSTLY_REPETITIONS = [[80, 20], [20, 80]];
const UPPER_POSITION = "top"
const LOWER_POSITION = "bottom"

const TRIAL_TYPES = [
    {
        distractor: "HH HH",
        target: "HHHHH",
        congruency: "congruent",
        type: "inducer",
        correct_key: "l",
    },
    {
        distractor: "HH HH",
        target: "HHSHH",
        congruency: "incongruent",
        type: "inducer",
        correct_key: "d",
    },
    {
        distractor: "SS SS",
        target: "SSSSS",
        congruency: "congruent",
        type: "inducer",
        correct_key: "d",
    },
    {
        distractor: "SS SS",
        target: "SSHSS",
        congruency: "incongruent",
        type: "inducer",
        correct_key: "l",
    },
    {
        distractor: "AA AA",
        target: "AAAAA",
        congruency: "congruent",
        type: "transfer",
        correct_key: "d",
    },
    {
        distractor: "AA AA",
        target: "AAFAA",
        congruency: "incongruent",
        type: "transfer",
        correct_key: "l",
    },
    {
        distractor: "FF FF",
        target: "FFFFF",
        congruency: "congruent",
        type: "transfer",
        correct_key: "l",
    },
    {
        distractor: "FF FF",
        target: "FFAFF",
        congruency: "incongruent",
        type: "transfer",
        correct_key: "d",
    },
];

const GROUPS = [
    {
        switch_rep: EQUAL_SWITCHREP,
        mostly_congruent: UPPER_POSITION,
        mostly_incongruent: LOWER_POSITION,
    },
    {
        switch_rep: EQUAL_SWITCHREP,
        mostly_congruent: LOWER_POSITION,
        mostly_incongruent: UPPER_POSITION,
    },
    {
        switch_rep: MOSTLY_REPETITIONS,
        mostly_congruent: UPPER_POSITION,
        mostly_incongruent: LOWER_POSITION,
    },
    {
        switch_rep: MOSTLY_REPETITIONS,
        mostly_congruent: LOWER_POSITION,
        mostly_incongruent: UPPER_POSITION,
    }
];

function produce_sequence(group_nr, trialtype, block) {
    const group = GROUPS[group_nr];

    const add_data = (pos, context) => (a) => {
        a.position = pos;
        a.context = context;
        a.group = group_nr;
        a.trial = trialtype;
        a.block = block;
        return a;
    };

    const context_zipper = () => {
        // Create mostly congruent and mostly incongruent sequences
        const context_sequences = [
            // Mostly congruent
            sequencer(MOSTLY_CONGRUENT, TRIAL_TYPES)
                // Odd nr participants get this as upper context; Even nr get this as lower context
                .map(add_data(group.mostly_congruent, "Mostly Congruent")),
            
            // Mostly incongruent
            sequencer(MOSTLY_INCONGRUENT, TRIAL_TYPES)
                // Odd nr participants get this as lower context; Even nr get this as upper context
                .map(add_data(group.mostly_incongruent, "Mostly Incongruent")),
        ];

        // Returns a map function zips together the context sequences based on the order of 0 and 1 in the array which is being mapped
        return (a) => context_sequences[a].shift();
    };

    // Return sequence is a counterbalanced amount of context repetition and switches
    return counterbalancer(group.switch_rep)
        // Populated with each context
        .map(context_zipper());
}

module.exports = produce_sequence