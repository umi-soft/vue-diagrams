import { generateId } from '@/utils'

class TitleRectNodeModel {
    constructor(title = 'title', x = 400, y = 300, width = 100, height = 50, rx = 10, ry = 10) {
        this.id = generateId()
        this.type = 'TitleRectNode'
        this.title = title
        this.x = x
        this.y = y
        this.rx = rx
        this.ry = ry
        this.width = width
        this.height = height
    }
    getBoundingBox() {
        return {
            width: this.width,
            height: this.height
        }
    }
    setPosition(node) {
        this.x = node.x - this.width / 2
        this.y = node.y - this.height / 2
    }
}

export default TitleRectNodeModel