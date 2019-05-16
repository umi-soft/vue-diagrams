export function generateId() {
    return Math.trunc(Math.random() * 10000)
}

export function getAbsoluteXY(element) {
    var viewportElement = document.documentElement
    var box = element.getBoundingClientRect()
    var scrollLeft = viewportElement.scrollLeft
    var scrollTop = viewportElement.scrollTop
    var x = box.left + scrollLeft
    var y = box.top + scrollTop
    return { x: x, y: y }
}

export function snapToGrip(val, gridSize) {
    return gridSize * Math.round(val / gridSize)
}