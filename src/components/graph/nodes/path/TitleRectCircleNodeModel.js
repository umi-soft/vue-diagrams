import { generateId } from '@/utils'

class TitleRectCircleNodeModel {
    constructor(title = 'title', x = 400, y = 300, width = 50, height = 50) {
        this.id = generateId()
        this.type = 'TitleRectCircleNode'
        this.title = title
        this.x = x
        this.y = y
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

export default TitleRectCircleNodeModel