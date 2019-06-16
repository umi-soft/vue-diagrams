import { generateId } from '@/utils'

class TitleCircleNodeModel {
    constructor(title = 'title', cx = 100, cy = 100, r = 50) {
        this.id = generateId()
        this.type = 'TitleCircleNode'
        this.title = title
        this.cx = cx
        this.cy = cy
        this.r = r
    }
}

export default TitleCircleNodeModel