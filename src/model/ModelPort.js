import { generateId } from '../utils'

class ModelPort {
    constructor(type) {
        this.id = generateId()

        this.type = type
    }
}

export default ModelPort