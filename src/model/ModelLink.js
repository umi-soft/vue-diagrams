import generateId from '../utils'

class ModelLink {
    constructor(from, to, points = []) {
        this.id = generateId()
        this.from = from
        this.to = to
        this.points = points
        this.positionFrom = {}
        this.positionTo = {}
    }
}
export default ModelLink