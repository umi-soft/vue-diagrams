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
}

export default TitleParallelogramNodeModel