import { generateId } from '@/utils'

class TitleEllipseNodeModel {
    constructor(title = 'title', cx = 300, cy = 300, rx = 70, ry = 50) {
        this.id = generateId()
        this.type = 'TitleEllipseNode'
        this.title = title
        this.cx = cx
        this.cy = cy
        this.rx = rx
        this.ry = ry
    }
}

export default TitleEllipseNodeModel