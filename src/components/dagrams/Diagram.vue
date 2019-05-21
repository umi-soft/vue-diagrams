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

        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
             preserveAspectRatio="xMinYMin meet"
             viewBox="0 0 1280 960"
             :id="diagramRoot"
             :width="width"
             :height="height"
             @mousemove="mouseMove"
             @mouseup="mouseUp">

            <defs>
                <pattern id="smallGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="gray" stroke-width="0.5"/>
                </pattern>
                <pattern id="grid" width="160" height="160" patternUnits="userSpaceOnUse">
                    <rect width="160" height="160" fill="url(#smallGrid)"/>
                    <path d="M 160 0 L 0 0 0 160" fill="none" stroke="gray" stroke-width="1"/>
                </pattern>
                <pattern id="page" width="960" height="1280" patternUnits="userSpaceOnUse">
                    <rect width="960" height="1280" fill="url(#grid)"/>
                    <path d="M 960 0 L 0 0 0 1280" fill="none" stroke="black" stroke-width="2"/>
                </pattern>
            </defs>

            <rect x="-9600" y="-12800" width="19200" height="25600" fill="url(#page)"
                  ref="grid" class="svg-pan-zoom-viewport"
                  @mousedown="mouseDown"/>

            <g x="50" y="50"
               :id="viewportId">
                <diagram-link v-for="(link, index) in links"
                             :key="link.id"
                             :ref="'link-' + index"
                             :id="link.id"
                             :positionFrom="link.positionFrom"
                             :positionTo="link.positionTo"
                             :index="index" />

                <diagram-link v-if="newLink"
                              :positionFrom="getPortPosition(newLink.startPortId)"
                              :positionTo="{ x: mouseX, y: mouseY }" />

                <template v-for="(node, nodeIndex) in nodes">
                    <title-rect-node :key="node.id"
                                     :ref="'node-' + nodeIndex"
                                     :index="nodeIndex"
                                     :id="node.id"
                                     :title="node.title"
                                     :x="node.x"
                                     :y="node.y"
                                     :width="node.width"
                                     :height="node.height"
                                     :color="node.color"
                                     :deletable="node.deletable"
                                     :selected="selectedItem.type === 'nodes' && selectedItem.index === nodeIndex"
                                     @onStartDrag="startDragItem"
                                     @onDelete="deleteHandler"
                                     @onHover="takeHoverItem">
                        <diagram-port v-for="(port) in node.ports"
                                      v-show="hoverItemId == node.id || selectedItem.type === 'nodes' && selectedItem.index === nodeIndex"
                                      :key="port.id"
                                      :ref="'port-' + port.id"
                                      :id="port.id"
                                      :r="port.r"
                                      :cx="port.cx"
                                      :cy="port.cy"
                                      :nodeId="node.id"
                                      :nodeIndex="nodeIndex"
                                      @onStartDrag="startDragNewLink"
                                      @onEndDrag="endDragNewLink"/>
                    </title-rect-node>
                </template>
            </g>

        </svg>
    </SvgPanZoom>
</template>

<script>
    import SvgPanZoom from 'vue-svg-pan-zoom'

    import DiagramPort from '@/components/common/DiagramPort'
    import DiagramLink from '@/components/common/DiagramLink'

    import TitleRectNode from '../nodes/rect/TitleRectNode'
    import diagram from '@/components/common/mixins/diagram'

    export default {
        components: {
            SvgPanZoom,
            TitleRectNode,
            DiagramPort,
            DiagramLink
        },
        mixins: [ diagram ],

        methods: {

            mouseDown() {
                this.selectedItem = {  }
            },


            mouseMove(event) {
                const position = this.convertXYtoViewPort(event.clientX, event.clientY)
                this.mouseX = position.x
                this.mouseY = position.y
                if (this.draggedItem) {
                    const index = this.draggedItem.index
                    const type = this.draggedItem.type
                    let items = this.links
                    if (type === 'nodes') {
                        items = this.nodes
                    }
                    items[index].x = this.draggedItem.x + this.mouseX - this.mouseStartX
                    items[index].y = this.draggedItem.y + this.mouseY - this.mouseStartY

                    this.updateLinksPositions()
                }
            },

            mouseUp() {
                this.draggedItem = undefined
                this.newLink = undefined
            }
        }
    }
</script>

<style scoped>
    svg {
        user-select: none;
        font-family: Helvetica;
        cursor: pointer;
    }
</style>
