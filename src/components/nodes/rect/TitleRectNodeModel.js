import { generateId } from '@/utils'

class TitleRectNodeModel {
    constructor(title = 'title', x = 400, y = 300, width = 200, height = 100, rx = 10, ry = 10) {
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
}

export default TitleRectNodeModel