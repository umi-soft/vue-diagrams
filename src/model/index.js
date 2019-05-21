import Link from './ModelLink'

class Model {

    constructor() {
        this.nodes = []
        this.links = []
    }

    /**
     * 增加节点
     * @param {Node}，node
     */
    addNode(node) {
        this.nodes.push(node)
        return node
    }

    /**
     * 删除节点
     * @param {Node}，node，根据节点对象进行删除，并删除相关联的连接线信息
     */
    deleteNode(node) {
        const index = this.nodes.indexOf(node)
        for (var j = 0; j < this.links.length; j++) {
            const link = this.links[j]
            for (var i = 0; i < node.ports.length; i++) {
                const port = node.ports[i]
                if (link.from === port.id || link.to === port.id) {
                    this.deleteLink(link)
                    j--
                }
            }
        }
        this.nodes.splice(index, 1)
    }

    /**
     * 删除连接点信息
     * @param {Link}，link
     */
    deleteLink(link) {
        const index = this.links.indexOf(link)
        this.links.splice(index, 1)
    }

    /**
     * 在两点之间增加一个连接线信息
     * @param {Integer} from，起始Port id
     * @param {Integer} to，结束Port id
     */
    addLink(from, to) {
        this.links.push(new Link(from, to))
    }

    /**
     * 序列化为JSON字符串
     * @return {String} DiagramModel对应的JSON字符串
     */
    serialize() {
        return JSON.stringify(this)
    }

    /**
     * 根据JSON String，构建Model
     * @param  {String} serializedModel
     */
    deserialize(serializedModel) {
        const model = JSON.parse(serializedModel)
        this.nodes = model.nodes
        this.links = model.links
    }
}

export default Model