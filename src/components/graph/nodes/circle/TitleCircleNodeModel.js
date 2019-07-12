import { generateId } from '@/utils'

class TitleCircleNodeModel {
    constructor(title = 'title', cx = 100, cy = 100, r = 25) {
        this.id = generateId()
        this.type = 'TitleCircleNode'
        this.title = title
        this.cx = cx
        this.cy = cy
        this.r = r
    }
    getBoundingBox() {
        return {
            width: this.r * 2,
            height: this.r * 2
        }
    }
    setPosition(node) {
        this.cx = node.x
        this.cy = node.y
    }
}

export default TitleCircleNodeModel