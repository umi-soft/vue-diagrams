import { generateId } from '../utils'
import ModelPort from './ModelPort'

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
     */
    constructor(title, x, y, width, height) {
        this.id = generateId()
        this.title = title
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.ports = []
    }

    /**
     * 增加一个type为"in"类型的连接端点
     * @param {String} name端点名称
     * @return {Integer} 返回新创建的连接端点id
     */
    addInPort(name) {
        const port = new ModelPort('in', name)
        this.ports.push(port)
        return port.id
    }

    /**
     * 增加一个type为"out"类型的连接端点
     * @param {String} name端点名称
     * @return {Integer} 返回新创建的连接端点id
     */
    addOutPort(name) {
        const port = new ModelPort('out', name)
        this.ports.push(port)
        return port.id
    }
}

export default ModelNode