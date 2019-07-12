import { generateId } from '@/utils'

class TitleEllipseNodeModel {
    constructor(title = 'title', cx = 300, cy = 300, rx = 50, ry = 25) {
        this.id = generateId()
        this.type = 'TitleEllipseNode'
        this.title = title
        this.cx = cx
        this.cy = cy
        this.rx = rx
        this.ry = ry
    }
    getBoundingBox() {
        return {
            width: this.rx * 2,
            height: this.ry * 2
        }
    }
    setPosition(node) {
        this.cx = node.x
        this.cy = node.y
    }
}

export default TitleEllipseNodeModel