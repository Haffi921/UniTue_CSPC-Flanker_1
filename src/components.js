function display_base () {
    return "<div class='display'>" + Array.from(arguments).join("") + "</div>"
}

function instruction_screen() {
    return `<p>${Array.from(arguments).join("</p><p>")}</p>`
} 

const context_boxes = "<div class='top'></div><div class='bottom'></div>";
const center_text = (text) => `<div class='center-text'><p>${text}</p></div>`
const box_text = (text, classes) => {
    return `<div class='${classes.join(" ")}'><p>${text}</p>`
}

const display = display_base.bind(null, context_boxes)

module.exports = {
    instruction_screen,
    display,
    center_text,
    box_text,
}