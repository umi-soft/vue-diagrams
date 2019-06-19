import { generateId } from '@/utils'

class TitleDiamondNodeModel {
    constructor(title = 'title', x = 700, y = 300, width = 100, height = 50) {
        this.id = generateId()
        this.type = 'TitleDiamondNode'
        this.title = title
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}

export default TitleDiamondNodeModel