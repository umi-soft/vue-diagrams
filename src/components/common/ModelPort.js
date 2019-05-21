import { generateId } from '@/utils'

class ModelPort {
    constructor(r, cx, cy) {
        this.id = generateId()
        this.r = r
        this.cx = cx
        this.cy = cy
    }
}

export default ModelPort