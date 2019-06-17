import { generateId } from '@/utils'

class PolylineTriangleMarkerModel {
    constructor(title = '', startPortId = null, endPortId = null, x1 = 0, x2 = 0,  y1 = 0, y2 = 0) {
        this.id = generateId()
        this.category = 'PolylineTriangleMarker'
        this.title = title
        this.startPortId = startPortId
        this.endPortId = endPortId
        this.x1 = x1
        this.x2 = x2
        this.y1 = y1
        this.y2 = y2
    }
}

export default PolylineTriangleMarkerModel