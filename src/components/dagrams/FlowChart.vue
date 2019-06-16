<template>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMinYMin meet"
         :id="diagramRoot"
         :viewBox="viewBox"
         :width="width + 'px'"
         :height="height + 'px'"
         @mousemove="mouseMove" @mousedown="mouseDown">

        <simple-line-triangle-marker v-show="dragItem && dragItem.type === 'link'" :ref="tempLinkId"/>

        <template v-for="link in links">
            <component :key="link.id" :ref="link.id" :is="link.type" :link="link" :dragItem="dragItem" :isSelected="selectedItemId === link.id" />
        </template>

        <template v-for="node in nodes">
            <component :key="node.id" :ref="node.id" :is="node.type" :node="node" :dragItem="dragItem" :isSelected="selectedItemId === node.id" @onStartDrag="onStartDrag" @onEndDragNode="onEndDragNode" @onEndDragLink="onEndDragLink"/>
        </template>
    </svg>
</template>

<script>
    import { generateId } from '@/utils'
    import '@/components/nodes'
    import '@/components/links'

    import TitleCircleNodeModel from '@/components/nodes/circle/TitleCircleNodeModel'
    import TitleEllipseNodeModel from '@/components/nodes/ellipse/TitleEllipseNodeModel'
    import TitleRectNodeModel from '@/components/nodes/rect/TitleRectNodeModel'
    import TitleRectCircleNodeModel from '@/components/nodes/path/TitleRectCircleNodeModel'
    import TitleParallelogramNodeModel from '@/components/nodes/polygon/TitleParallelogramNodeModel'
    import TitleDiamondNodeModel from '@/components/nodes/polygon/TitleDiamondNodeModel'

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
            }
        },
        data() {
            const nodes = []
            nodes.push(new TitleCircleNodeModel('Circle', 100, 100, 50))
            nodes.push(new TitleEllipseNodeModel('Ellipse'))
            nodes.push(new TitleRectNodeModel('Rect'))
            nodes.push(new TitleRectCircleNodeModel('RectCircle'))
            nodes.push(new TitleParallelogramNodeModel('Parallelogram'))
            nodes.push(new TitleDiamondNodeModel('Diamond'))
            return {
                nodes: nodes,
                links: [],
                tempLinkId: generateId(),
                dragItem: null,
                selectedItemId: null,
                mouse: {
                    x: 0, y: 0, startX: 0, startY: 0
                }
            }
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
                if (this.dragItem.type === 'link') {
                    this.$refs[this.tempLinkId].beforeDrawing(dragItem)
                }
            },
            mouseMove(event) {
                if ( !this.dragItem ) return

                const position = this.convertXYtoViewPort(event.clientX, event.clientY)
                this.mouse.x = position.x
                this.mouse.y = position.y
                if (this.dragItem.type === 'node') {
                    let item = this.$refs[this.dragItem.id]
                    if ( !item ) return
                    item = item[0]
                    item.moving(this.mouse.x - this.mouse.startX, this.mouse.y - this.mouse.startY)
                    this.updateLinks()
                } else if (this.dragItem.type === 'link') {
                    this.$refs[this.tempLinkId].drawing(this.mouse.x - this.mouse.startX, this.mouse.y - this.mouse.startY)
                }
            },
            onEndDragNode(dragResult) {
                if ( !this.dragItem || this.dragItem.type !== 'node' ) return
                let item = this.$refs[this.dragItem.id]
                if ( !item ) return
                item = item[0]
                Object.assign(item.node, dragResult)
                this.dragItem = null
            },
            onEndDragLink(dragResult) {
                if ( !this.dragItem || this.dragItem.type !== 'link' ) return
                let exists = false
                this.links.forEach(link => {
                    if (this.dragItem.id === link.startPortId && dragResult.id === link.endPortId) {
                        exists = true
                    }
                    if (this.dragItem.id === link.endPortId && dragResult.id === link.startPortId) {
                        exists = true
                    }
                })
                if (exists) return
                const line = this.$refs[this.tempLinkId].endDrawing(this.dragItem.id, dragResult.id)
                this.links.push(line)
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
            mouseDown() {
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