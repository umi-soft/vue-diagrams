<template>
    <div>
        <SvgPanZoom id="svgroot" xmlns="http://www.w3.org/2000/svg" viewportSelector="#svgroot2"
                    :style="{ width: width + 'px', height: height + 'px', border:'1px solid black'}"
                    :zoomEnabled="zoomEnabled"
                    :panEnabled="panEnabled"
                    :controlIconsEnabled="true"
                    :fit="false"
                    :center="true"
                    :preventMouseEventsDefault="false"
                    :beforePan="beforePan">

            <svg id="svgroot2" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 preserveAspectRatio="xMinYMin meet"
                 class="svg-content"
                 ref="dragramRoot"
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

                <rect x="-5000px" y="-5000px" width="10000px" height="10000px" fill="url(#grid)" @mousedown="clearSelection" ref="grid" class="svg-pan-zoom_viewport"/>

                <g ref="viewPort" id="viewport" x="50" y="50">
                    <DiagramLink :ref="'link-' + index"
                                 :positionFrom="link.positionFrom"
                                 :positionTo="link.positionTo"
                                 :points="link.points"
                                 :id="link.id"
                                 :index="index"
                                 v-for="(link, index) in model.links"
                                 @onStartDrag="startDragPoint"
                                 @onCreatePoint="createPoint"/>
                    <line style="stroke:rgb(255,0,0); stroke-width:2;"
                          :x1="getPortHandlePosition(newLink.startPortId).x"
                          :y1="getPortHandlePosition(newLink.startPortId).y"
                          :x2="convertXYtoViewPort(mouseX, 0).x"
                          :y2="convertXYtoViewPort(0, mouseY).y"
                          v-if="newLink"/>
                    <DiagramNode v-for="(node, nodeIndex) in model.nodes"
                                 :ref="'node-' + nodeIndex"
                                 :title="node.title"
                                 :x="node.x"
                                 :y="node.y"
                                 :width="node.width"
                                 :height="node.height"
                                 :color="node.color"
                                 :deletable="node.deletable"
                                 :ports="node.ports"
                                 :selected="selectedItem.type === 'nodes' && selectedItem.index === nodeIndex"
                                 :index="nodeIndex"
                                 @onStartDrag="startDragItem"
                                 @delete="model.deleteNode(node)">
                        <DiagramPort v-for="(port, portIndex) in node.ports"
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
    </div>
</template>

<script>
    import SvgPanZoom from 'vue-svg-pan-zoom'

    import DiagramNode from './DiagramNode'
    import DiagramLink from './DiagramLink'
    import DiagramPort from './DiagramPort'

    import { getAbsoluteXY, snapToGrip } from '../utils'
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

        data() {
            this.updateLinksPositions()
            return {
                zoomEnabled: true,
                panEnabled: true,
                draggedItem: undefined,
                selectedItem: {},
                initialDragX: 0,
                initialDragY: 0,
                newLink: undefined,
                mouseX: 0,
                mouseY: 0
            }
        },

        components: {
            SvgPanZoom,
            DiagramNode,
            DiagramLink,
            DiagramPort
        },

        methods: {
            convertXYtoViewPort(x, y) {
                let rootelt = document.getElementById("svgroot2")
                let rec = document.getElementById("viewport")
                let point = rootelt.createSVGPoint()
                let rooteltPosition = getAbsoluteXY(rootelt)
                point.x = x - rooteltPosition.x
                point.y = y - rooteltPosition.y
                let ctm = rec.getCTM().inverse()
                return point.matrixTransform(ctm)
            },

            beforePan() {
                return !(this.selectedItem.type || this.draggedItem || this.newLink)
            },

            createPoint(x, y, linkIndex, pointIndex) {
                let coords = this.convertXYtoViewPort(x, y)
                let links = this.model.links
                if (!links[linkIndex].points) links[linkIndex].points = []
                let points = links[linkIndex].points
                points.splice(pointIndex, 0, coords)
                links[linkIndex].points = points
            },

            clearSelection() {
                this.selectedItem = {}
            },

            updateLinksPositions() {
                var links = []
                if (this.model) links = this.model.links
                this.$nextTick(() => {
                    setTimeout(() => {
                        for (var i = 0; i < links.length; i++) {
                            var coords = this.getPortHandlePosition(links[i].from)
                            links[i].positionFrom = { x: coords.x, y: coords.y }
                            coords = this.getPortHandlePosition(links[i].to)
                            links[i].positionTo = { x: coords.x, y: coords.y }
                        }
                    }, 100)
                })
            },

            startDragNewLink(startPortId) {
                this.panEnabled = false
                this.newLink = { startPortId }
            },

            getPortHandlePosition(portId) {
                let x = 0, y = 0
                if (this.$refs["port-" + portId]) {
                    const port = this.$refs["port-" + portId][0]
                    const node = this.$refs["node-" + port.nodeIndex][0]
                    if (port.type === "in") {
                        x = node.x + 10
                        y = node.y + port.y + 64
                    } else {
                        x = node.x + node.width + 10
                        y = node.y + port.y + 64
                    }
                }
                return { x, y }
            },

            mouseMove(pos) {
                var links = this.model.links
                this.mouseX = pos.x
                this.mouseY = pos.y
                if (this.draggedItem) {
                    var index = this.draggedItem.index
                    var type = this.draggedItem.type
                    if (type === 'points') {
                        let coords = this.convertXYtoViewPort(this.mouseX, this.mouseY)
                        coords.x = snapToGrip(coords.x, this.gridSnap) - this.gridSnap / 2
                        coords.y = snapToGrip(coords.y, this.gridSnap)
                        links[this.draggedItem.linkIndex].points[this.draggedItem.pointIndex].x = coords.x
                        links[this.draggedItem.linkIndex].points[this.draggedItem.pointIndex].y = coords.y
                        this.updateLinksPositions()
                    } else {
                        let coords = this.convertXYtoViewPort(this.mouseX, this.mouseY)
                        coords.x = snapToGrip(coords.x, this.gridSnap) - this.gridSnap / 2
                        coords.y = snapToGrip(coords.y, this.gridSnap)
                        this.model[type][index].x = coords.x - 30
                        this.model[type][index].y = coords.y - 30
                        this.updateLinksPositions()
                    }
                }
            },

            mouseUp() {
                this.draggedItem = undefined
                this.newLink = undefined
            },

            mouseUpPort(portId) {
                var links = this.model.links
                if (this.draggedItem && this.draggedItem.type === 'points') {
                    var pointIndex = this.draggedItem.pointIndex
                    var linkIndex = this.draggedItem.linkIndex
                    if (this.$refs['port-' + portId][0].type === 'in') {
                        var l = links[linkIndex].points.length
                        links[linkIndex].points.splice(pointIndex, l - this.draggedItem.pointIndex)
                    } else {
                        links[linkIndex].points.splice(0, pointIndex + 1)
                    }
                    this.updateLinksPositions()
                }

                if (this.newLink !== undefined) {
                    var port1Id = this.newLink.startPortId
                    var port2Id = portId

                    var port1 = this.$refs["port-" + port1Id][0]
                    var port2 = this.$refs["port-" + port2Id][0]

                    if (port1.type === "in" && port2.type === "out") {
                        links.push(new ModelLink(port2.id, port1.id))
                    } else if (port2.type === "in" && port1.type === "out") {
                        links.push(new ModelLink(port1.id, port2.id))
                    }

                    this.model.links = links
                    this.updateLinksPositions()
                }
            },

            startDragPoint(pointInfo) {
                this.draggedItem = pointInfo
            },

            startDragItem(item, x, y) {
                this.panEnabled = false
                this.draggedItem = item
                this.selectedItem = item
                this.initialDragX = x
                this.initialDragY = y
            }
        },

        computed: {
            querySelector: function() {
                return document.querySelector("#viewport")
            }
        },

        watch: {
            'model.links': function() {
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
