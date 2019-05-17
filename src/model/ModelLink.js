import { generateId } from '../utils'

class ModelLink {
    constructor(from, to) {
        this.id = generateId()
        this.from = from
        this.to = to
        this.positionFrom = {}
        this.positionTo = {}
    }
}
export default ModelLink