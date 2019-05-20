<template>
    <SvgPanZoom :viewportSelector="'#' + diagramRoot"
                :style="{ width: width + 'px', height: height + 'px', border:'1px solid black'}"
                :zoomEnabled="zoomEnabled"
                :panEnabled="panEnabled"
                :controlIconsEnabled="true"
                :fit="false"
                :center="true"
                :preventMouseEventsDefault="false"
                :beforePan="beforePan">

        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
             class="svg-content"
             :id="diagramRoot"
             :viewBox="'0 0 ' + width + ' ' + height"
             :width="width"
             :height="height"
             @mousemove="mouseMove"
             @mouseup="mouseUp">

            <defs>
                <pattern id="smallGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="gray" stroke-width="0.5"/>
                </pattern>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <rect width="80" height="80" fill="url(#smallGrid)"/>
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
                </pattern>
            </defs>

            <rect x="-5000px" y="-5000px" width="10000px" height="10000px" fill="url(#grid)"
                  ref="grid" class="svg-pan-zoom-viewport"
                  @mousedown="mouseDown"/>

            <g x="50" y="50"
               :id="viewportId">
                <DiagramLink v-for="(link, index) in links"
                             :key="link.id"
                             :ref="'link-' + index"
                             :id="link.id"
                             :positionFrom="link.positionFrom"
                             :positionTo="link.positionTo"
                             :index="index"
                             @onStartDrag="startDragLinkPoint"/>

                <line stroke="rgb(255,0,0)" stroke-width="2"
                      v-if="newLink"
                      :x1="getPortHandlePosition(newLink.startPortId).x"
                      :y1="getPortHandlePosition(newLink.startPortId).y"
                      :x2="mouseX"
                      :y2="mouseY"/>
                <DiagramNode v-for="(node, nodeIndex) in nodes"
                             :key="node.id"
                             :ref="'node-' + nodeIndex"
                             :index="nodeIndex"
                             :title="node.title"
                             :x="node.x"
                             :y="node.y"
                             :width="node.width"
                             :height="node.height"
                             :color="node.color"
                             :deletable="node.deletable"
                             :ports="node.ports"
                             :selected="selectedItem.type === 'nodes' && selectedItem.index === nodeIndex"
                             @onStartDrag="startDragItem"
                             @onDelete="deleteHandler">
                    <text x="20" y="15" fill="red">{{'(' + node.x + ',' + node.x + ')'}}</text>
                    <DiagramPort v-for="(port, portIndex) in node.ports"
                                 :key="port.id"
                                 :ref="'port-' + port.id"
                                 :id="port.id"
                                 :nodeIndex="nodeIndex"
                                 :y="portIndex * 20"
                                 :nodeWidth="node.width"
                                 :type="port.type"
                                 :name="port.name"
                                 @onStartDragNewLink="startDragNewLink"
                                 @mouseUpPort="mouseUpPort"/>

                </DiagramNode>
            </g>

        </svg>
    </SvgPanZoom>
</template>

<script>
    import SvgPanZoom from 'vue-svg-pan-zoom'

    import DiagramNode from './DiagramNode'
    import DiagramLink from './DiagramLink'
    import DiagramPort from './DiagramPort'

    import ModelLink from '../model/ModelLink'

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
            },
            gridSnap: {
                default: 1
            }
        },
        components: {
            SvgPanZoom,
            DiagramNode,
            DiagramLink,
            DiagramPort
        },
        data() {
            return {
                links: [],
                nodes: [],

                diagramRoot: 'diagramRoot',
                viewportId: 'viewportId',
                zoomEnabled: true,
                panEnabled: true,

                selectedItem: {},
                draggedItem: undefined,
                newLink: undefined,

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
            },

            mouseDown() {
                this.selectedItem = {}
            },

            // 更新Link两端连接点form、to对应的坐标信息
            updateLinksPositions() {
                for (let i = 0; i < this.links.length; i++) {
                    let coords = this.getPortHandlePosition(this.links[i].from)
                    this.links[i].positionFrom = { x: coords.x, y: coords.y }
                    coords = this.getPortHandlePosition(this.links[i].to)
                    this.links[i].positionTo = { x: coords.x, y: coords.y }
                }
            },

            //开始绘制新的连接线
            startDragNewLink(startPortId) {
                this.panEnabled = false
                this.newLink = { startPortId }
            },

            // 根据连接点id获取连接点对应的坐标信息
            getPortHandlePosition(portId) {
                let x = 0, y = 0
                const port = this.$refs["port-" + portId][0]
                if (!port) {
                    return { x, y }
                }
                const node = this.$refs["node-" + port.nodeIndex][0]
                if (!node) {
                    return { x, y }
                }
                if (port.type === "in") {
                    x = node.x + 10
                    y = node.y + port.y + 64
                } else {
                    x = node.x + node.width + 10
                    y = node.y + port.y + 64
                }
                return { x, y }
            },

            mouseMove(pos) {
                if (!this.draggedItem) return
                const index = this.draggedItem.index
                const type = this.draggedItem.type
                const position = this.convertXYtoViewPort(pos.clientX, pos.clientY)
                this.mouseX = position.x
                this.mouseY = position.y
                let items = this.links
                if (type === 'nodes') {
                    items = this.nodes
                }
                items[index].x = this.draggedItem.x + this.mouseX - this.mouseStartX
                items[index].y = this.draggedItem.y + this.mouseY - this.mouseStartY

                this.updateLinksPositions()
            },

            mouseUp() {
                this.draggedItem = undefined
                this.newLink = undefined
            },

            mouseUpPort(portId) {
                if (this.draggedItem && this.draggedItem.type === 'points') {
                    var pointIndex = this.draggedItem.pointIndex
                    var linkIndex = this.draggedItem.linkIndex
                    if (this.$refs['port-' + portId][0].type === 'in') {
                        var l = this.links[linkIndex].points.length
                        this.links[linkIndex].points.splice(pointIndex, l - this.draggedItem.pointIndex)
                    } else {
                        this.links[linkIndex].points.splice(0, pointIndex + 1)
                    }
                    this.updateLinksPositions()
                }

                if (this.newLink !== undefined) {
                    var port1Id = this.newLink.startPortId
                    var port2Id = portId

                    var port1 = this.$refs["port-" + port1Id][0]
                    var port2 = this.$refs["port-" + port2Id][0]

                    if (port1.type === "in" && port2.type === "out") {
                        this.links.push(new ModelLink(port2.id, port1.id))
                    } else if (port2.type === "in" && port1.type === "out") {
                        this.links.push(new ModelLink(port1.id, port2.id))
                    }
                    this.updateLinksPositions()
                }
            },

            startDragLinkPoint(pointInfo) {
                this.draggedItem = pointInfo
            },

            startDragItem(item, clientX, clientY) {
                this.panEnabled = false
                this.draggedItem = item
                this.selectedItem = item
                const mousePosition = this.convertXYtoViewPort(clientX, clientY)
                this.mouseStartX = mousePosition.x
                this.mouseStartY = mousePosition.y
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
            }
        },

        watch: {
            'model.links': function() {
                this.updateLinksPositions()
            },
            'model.nodes': function() {
                this.updateLinksPositions()
            }
        }
    }
</script>

<style scoped>
  svg {
    user-select: none;
    font-family: Helvetica;
  }
</style>
