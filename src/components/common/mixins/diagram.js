import { generateId } from '@/utils'
import Link from '@/model/ModelLink'

export default {

    props: {
        model: {
            required: true
        },
        width: {
            default: 500
        },
        height: {
            default: 500
        }
    },

    data() {
        return {
            links: [],
            nodes: [],

            diagramRoot: 'diagramRoot-' + generateId(),
            viewportId: 'viewportId' + generateId(),
            zoomEnabled: true,
            panEnabled: true,

            selectedItem: {},
            draggedItem: undefined,
            newLink: undefined,
            hoverItemId: null,

            mouseStartX: 0,
            mouseStartY: 0,
            mouseX: 0,
            mouseY: 0
        }
    },

    mounted() {
        this.initData()
    },

    methods: {
        initData() {
            this.selectedItem = {}
            this.draggedItem = undefined
            this.newLink = undefined

            this.links = JSON.parse(JSON.stringify(this.model.links))
            this.nodes = JSON.parse(JSON.stringify(this.model.nodes))

            this.$nextTick(() => {
                this.updateLinksPositions()
            })
        },

        startDragItem(item, clientX, clientY) {
            this.panEnabled = false
            this.draggedItem = item
            this.selectedItem = item
            const mousePosition = this.convertXYtoViewPort(clientX, clientY)
            this.mouseStartX = mousePosition.x
            this.mouseStartY = mousePosition.y
        },

        takeHoverItem(id) {
            this.hoverItemId = id
        },

        //开始绘制新的连接线
        startDragNewLink(startPortId, nodeId) {
            this.panEnabled = false
            this.newLink = { startPortId, nodeId }
        },

        // 结束绘制新的连接线
        endDragNewLink(endPortId, nodeId) {
            if(this.newLink && this.newLink.startPortId !== endPortId && this.newLink.nodeId !== nodeId) {
                this.links.push(new Link(this.newLink.startPortId, endPortId))
                this.updateLinksPositions()
            }
            this.newLink = undefined
        },

        // 更新Link两端连接点form、to对应的坐标信息
        updateLinksPositions() {
            for (let i = 0; i < this.links.length; i++) {
                let coords = this.getPortPosition(this.links[i].from)
                this.links[i].positionFrom = { x: coords.x, y: coords.y }
                coords = this.getPortPosition(this.links[i].to)
                this.links[i].positionTo = { x: coords.x, y: coords.y }
            }
        },

        // 根据连接点id获取连接点对应的坐标信息
        getPortPosition(portId) {
            let x = 0, y = 0
            const port = this.$refs["port-" + portId][0]
            if (!port) {
                return { x, y }
            }
            const node = this.$refs["node-" + port.nodeIndex][0]
            if (!node) {
                return { x, y }
            }
            x = node.x + port.cx
            y = node.y + port.cy
            return { x, y }
        },

        deleteHandler(type, index) {
            if (type === 'nodes') {
                this.nodes[index].ports.forEach(port => {
                    for(let i=0; i<this.links.length; i++) {
                        if (port.id === this.links[i].from || port.id === this.links[i].to) {
                            this.links.splice(i, 1)
                            i --
                        }
                    }
                })
                this.nodes.splice(index, 1)
            }
        },

        // 将坐标(x,y)转换为预设ViewPort内部坐标
        convertXYtoViewPort(x, y) {
            const root = document.getElementById(this.diagramRoot)
            const rec = document.getElementById(this.viewportId)
            const point = root.createSVGPoint()
            point.x = x
            point.y = y
            const ctm = rec.getScreenCTM().inverse()
            return point.matrixTransform(ctm)
        },

        beforePan() {
            return !(this.selectedItem.type || this.draggedItem || this.newLink)
        }
    },

    watch: {
        'model.links': function() {
            this.updateLinksPositions()
        },
        'model.nodes': function() {
            this.initData()
        }
    }
}