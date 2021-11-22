function display () {
    return "<div class='display'>" + Array.from(arguments).join("") + "</div>"
}

function paragraphs() {
    return `<p>${Array.from(arguments).join("</p><p>")}</p>`;
} 

const context_boxes = "<div class='top'></div><div class='bottom'></div>";
// const center_text = (text) => `<div class='center-text'><p>${text}</p></div>`
function center_text() {
    return `<div class='center-text'><p>${Array.from(arguments).join("</p><p>")}</p></div>`;
}

const box_text = (text, classes) => {
    if (classes === undefined) {
        classes = []
    }
    return `<div class='${classes.join(" ")}'><p>${text}</p></div>`
}

const trial_display = display.bind(null, context_boxes)

module.exports = {
    display,
    paragraphs,
    trial_display,
    center_text,
    box_text,
}