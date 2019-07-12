import { generateId } from '@/utils'

class TitleParallelogramNodeModel {
    constructor(title = 'title', x = 400, y = 300, width = 100, height = 50) {
        this.id = generateId()
        this.type = 'TitleParallelogramNode'
        this.title = title
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
    offset() {
        return this.width / 5
    }
    getBoundingBox() {
        return {
            width: this.width + this.offset(),
            height: this.height
        }
    }
    setPosition(node) {
        this.x = node.x - (this.width + this.offset()) / 2
        this.y = node.y - this.height / 2
    }
}

export default TitleParallelogramNodeModel