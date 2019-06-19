import { generateId } from '@/utils'

class SimplePolylineModel {
    constructor(title = '', points = '0,0 0,0') {
        this.id = generateId()
        this.category = 'SimplePolyline'
        this.title = title
        this.points = points
    }


}

export default SimplePolylineModel