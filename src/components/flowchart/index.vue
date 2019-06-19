<template>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMinYMin meet"
         :id="diagramRoot"
         :viewBox="viewBox"
         :width="width + 'px'"
         :height="height + 'px'"
         @mousemove="mouseMove" @mouseup="clear">

        <polyline-triangle-marker v-show="dragItem && dragItem.type === 'port'" :ref="tempLinkId" />

        <template v-for="link in links">
            <component :key="link.id" :ref="link.id" :is="link.category"
                       :link="link" :dragItem="dragItem" :isSelected="selectedItemId === link.id"
                       @onSelectLink="onStartDrag"
            />
        </template>

        <template v-for="node in nodes">
            <component :key="node.id" :ref="node.id" :is="node.type"
                       :node="node" :dragItem="dragItem" :isSelected="selectedItemId === node.id"
                       @onStartDrag="onStartDrag"
                       @onEndDragNode="onEndDragNode"
                       @onEndDragPort="onEndDragPort"
                       @onEndReDrawingLink="onEndReDrawingLink"
            />
        </template>
    </svg>
</template>

<script>
    import { generateId } from '@/utils'
    import './nodes'
    import './links'
    import Model from './nodes/model'

    export default {
        name: 'FlowChart',
        props: {
            diagramRoot: {
                require: false,
                type: String,
                default: generateId()
            },
            width: {
                require: false,
                type: Number,
                default: 1280
            },
            height: {
                require: false,
                type: Number,
                default: 960
            },
            model: {
                require: true,
                type: Object,
                default: () => { return { nodes: [], links: [] } }
            }
        },
        data() {
            return {
                nodes: this.model.nodes,
                links: this.model.links,
                tempLinkId: generateId(),
                dragItem: null,
                selectedItemId: null,
                mouse: {
                    x: 0, y: 0, startX: 0, startY: 0
                }
            }
        },
        mounted() {
            this.nodes.push(new Model.TitleCircleNodeModel('Circle'))
            this.nodes.push(new Model.TitleEllipseNodeModel('Ellipse'))
            this.nodes.push(new Model.TitleRectNodeModel('Rect'))
            this.nodes.push(new Model.TitleRectCircleNodeModel('RectCircle'))
            this.nodes.push(new Model.TitleParallelogramNodeModel('Parallelogram'))
            this.nodes.push(new Model.TitleDiamondNodeModel('Diamond'))
        },
        methods: {
            onStartDrag(event, dragItem) {
                const position = this.convertXYtoViewPort(event.clientX, event.clientY)
                this.mouse.x = position.x
                this.mouse.y = position.y
                this.mouse.startX = position.x
                this.mouse.startY = position.y
                this.dragItem = dragItem
                this.selectedItemId = this.dragItem.id
                // dragItem.type 1、port 类型，绘制新的连接线， 2、link 类型，重新绘制某个连接线，3、node 类型，移动某个node节点
                if (this.dragItem.type === 'port') {
                    this.$refs[this.tempLinkId].beforeDrawing(dragItem)
                }
            },
            mouseMove(event) {
                if ( !this.dragItem ) return

                const position = this.convertXYtoViewPort(event.clientX, event.clientY)
                this.mouse.x = position.x
                this.mouse.y = position.y
                if (this.dragItem.type === 'node') {    // 移动某个node节点
                    let item = this.$refs[this.dragItem.id]
                    if ( !item ) return
                    item = item[0]
                    item.moving(this.mouse.x - this.mouse.startX, this.mouse.y - this.mouse.startY)
                    this.updateLinks()
                } else if (this.dragItem.type === 'port') {     // 绘制新的连接线
                    this.$refs[this.tempLinkId].drawing(this.mouse.x - this.mouse.startX, this.mouse.y - this.mouse.startY)
                } else if (this.dragItem.type === 'link' && this.dragItem.enableDrawing) { //   重新绘制某个连接线
                    let item = this.$refs[this.dragItem.id]
                    if ( !item ) return
                    item = item[0]
                    item.reDrawing(this.mouse.x - this.mouse.startX, this.mouse.y - this.mouse.startY)
                } else if (this.dragItem.type === 'resize') {   // 缩放大小
                    let item = this.$refs[this.dragItem.id]
                    if ( !item ) return
                    item = item[0]
                    item.resizing(this.mouse.x - this.mouse.startX, this.mouse.y - this.mouse.startY)
                    this.updateLinks()
                }
            },
            onEndDragNode(endDragNode) {
                if ( !this.dragItem || this.dragItem.type !== 'node' ) return
                let item = this.$refs[this.dragItem.id]
                if ( !item ) return
                item = item[0]
                Object.assign(item.node, endDragNode)
                this.dragItem = null
            },
            onEndDragPort(endDragPort) {
                if ( !this.dragItem || this.dragItem.type !== 'port' ) return
                let exists = false
                this.links.forEach(link => {
                    if (this.dragItem.id === link.startPortId && endDragPort.id === link.endPortId) {
                        exists = true
                    }
                    if (this.dragItem.id === link.endPortId && endDragPort.id === link.startPortId) {
                        exists = true
                    }
                })
                if (!exists) {
                    const line = this.$refs[this.tempLinkId].endDrawing(this.dragItem.id, endDragPort.id)
                    this.links.push(line)
                }
                this.dragItem = null
            },
            onEndReDrawingLink(endDragPort) {
                if ( !this.dragItem || this.dragItem.type !== 'link' ) return
                let item = this.$refs[this.dragItem.id]
                if ( !item ) return
                item = item[0]

                let exists = false
                let temp = {}
                if (this.dragItem.isReDrawingStartPortId) {
                    temp.startPortId = endDragPort.id
                    temp.endPortId = this.dragItem.endPortId
                } else {
                    temp.startPortId = this.dragItem.startPortId
                    temp.endPortId = endDragPort.id
                }
                this.links.forEach(link => {
                    if (temp.startPortId === link.startPortId && temp.endPortId === link.endPortId) {
                        exists = true
                    }
                })
                if (!exists) {
                    Object.assign(
                        this.links.find(link => link.id === this.dragItem.id),
                        item.endReDrawing(endDragPort)
                    )
                }
                this.dragItem = null
            },
            updateLinks() {
                const dragNode = this.$refs[this.dragItem.id][0]
                const reg = new RegExp('^' + this.dragItem.id)
                this.links.forEach(link => {
                    if (reg.test(link.startPortId)) {
                        const port = dragNode.ports.find(p => link.startPortId === p.id)
                        link.x1 = port.cx
                        link.y1 = port.cy
                    } else if (reg.test(link.endPortId)) {
                        const port = dragNode.ports.find(p => link.endPortId === p.id)
                        link.x2 = port.cx
                        link.y2 = port.cy
                    }
                })
            },
            clear() {
                if (this.dragItem && this.dragItem.type === 'link') {
                    let item = this.$refs[this.dragItem.id]
                    if ( !item ) return
                    item = item[0]
                    item.backUp()
                }
                this.dragItem = null
                this.selectedItemId = null
            },
            convertXYtoViewPort(x, y) {
                const root = document.getElementById(this.diagramRoot)
                const rec = document.getElementById(this.diagramRoot)
                const point = root.createSVGPoint()
                point.x = x
                point.y = y
                const ctm = rec.getScreenCTM().inverse()
                return point.matrixTransform(ctm)
            }
        },
        computed: {
            viewBox() {
                return '0 0 ' + this.width + ' ' + this.height
            }
        }
    }
</script>
<style lang="scss">
    @import './theme/default.scss';
</style>