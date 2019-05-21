import { generateId } from '@/utils'
import ModelPort from '@/components/common/ModelPort'

/**
 * @class DiagramNode
 */
class ModelNode {
    /**
     * @param {String} title，节点主题
     * @param {Integer} x，x坐标
     * @param {Integer} y，y坐标
     * @param {Integer} width，宽度
     * @param {Integer} height，高度
     * @param {String} portMode，port类型， [edge | center]
     */
    constructor(title, x, y, width, height, portMode = 'edge') {
        this.id = generateId()
        this.type = 'TitleRectNode'
        this.title = title
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.portMode = portMode
        this.ports = []
        const r = 5
        if (portMode == 'edge') {
            this.ports.push(new ModelPort(r, width/2, r)) // 上
            this.ports.push(new ModelPort(r, width/2, height - r)) // 下
            this.ports.push(new ModelPort(r, r, height/2))   // 左
            this.ports.push(new ModelPort(r, width - r, height/2))   // 右
        } else {
            this.ports.push(new ModelPort(r, width/2, height/2))
        }
    }

    getCenterPort() {
        return this.ports(0)
    }

    getTopPort() {
        return this.ports(0)
    }

    getBottomPort() {
        return this.ports(1)
    }

    getLeftPort() {
        return this.ports(2)
    }

    getRightPort() {
        return this.ports(3)
    }
}

export default ModelNode