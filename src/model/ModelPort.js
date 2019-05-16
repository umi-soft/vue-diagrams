import generateId from '../utils'

class ModelPort {
    constructor(type, name) {
        this.id = generateId()
        this.type = type
        this.name = name
    }
}

export default ModelPort