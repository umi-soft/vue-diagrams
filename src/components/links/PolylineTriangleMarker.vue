<template>
    <g>
        <defs>
            <marker :id="midMarker"
                    markerWidth="10" markerHeight="10" refX="3" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="5" stroke="none" fill="#f00"/>
            </marker>
            <marker :id="endMarker"
                    markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
                <path class="marker" d="M0,0 L0,6 L9,3 z"/>
            </marker>
        </defs>
        <polyline :class="{ 'line': true, 'selected': isSelected }" :points="points" :marker-mid="'url(#' + midMarker + ')'" :marker-end="'url(#' + endMarker + ')'" @click.stop="mouseClick"/>
    </g>
</template>

<script>
    import { generateId } from '@/utils'
    import PolylineTriangleMarkerModel from './PolylineTriangleMarkerModel'

    export default {
        name: 'PolylineTriangleMarker',
        props: {
            link: {
                require: false,
                type: PolylineTriangleMarkerModel,
                default: () => new PolylineTriangleMarkerModel()
            },
            dragItem: {
                require: false,
                type: Object,
                default: null
            },
            isSelected: {
                require: true,
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                model: {
                    x1: this.link.x1,
                    y1: this.link.y1,
                    x2: this.link.x2,
                    y2: this.link.y2
                },
                midMarker: generateId(),
                endMarker: generateId()
            }
        },
        methods: {
            init() {
                this.model.x1 = this.link.x1
                this.model.x2 = this.link.x2
                this.model.y1 = this.link.y1
                this.model.y2 = this.link.y2
            },
            backUp() {
                this.init()
            },
            mouseClick(event) {
                const dragItem = {
                    id: this.link.id,
                    startPortId: this.link.startPortId,
                    endPortId: this.link.endPortId,
                    type: 'link',
                    enableDrawing: false,
                    isReDrawingStartPortId: false
                }
                this.$emit('onSelectLink', event, dragItem)
            },
            // beforeDrawing，endDrawing，drawing 是用于绘制新的link
            beforeDrawing(port) {
                this.model.x1 = port.cx
                this.model.y1 = port.cy
                this.model.x2 = port.cx
                this.model.y2 = port.cy
            },
            drawing(mouseOffsetX = 0, mouseOffsetY = 0) {
                this.model.x2 = this.model.x1 + mouseOffsetX
                this.model.y2 = this.model.y1 + mouseOffsetY
            },
            endDrawing(startPortId, endPortId) {
                return new PolylineTriangleMarkerModel('', startPortId, endPortId, this.model.x1, this.model.x2, this.model.y1, this.model.y2)
            },
            // reDrawing, endReDrawing 是用于重新绘制当前link
            reDrawing(mouseOffsetX = 0, mouseOffsetY = 0) {
                if ( !this.dragItem ) return
                if (this.dragItem.isReDrawingStartPortId) {
                    this.model.x1 = this.link.x1 + mouseOffsetX
                    this.model.y1 = this.link.y1 + mouseOffsetY
                } else {
                    this.model.x2 = this.link.x2 + mouseOffsetX
                    this.model.y2 = this.link.y2 + mouseOffsetY
                }
            },
            endReDrawing(port) {
                if ( !this.dragItem ) return
                let changes = {}
                if (this.dragItem.isReDrawingStartPortId) {
                    changes.startPortId = port.id
                    changes.x1 = port.cx
                    changes.y1 = port.cy
                } else {
                    changes.endPortId = port.id
                    changes.x2 = port.cx
                    changes.y2 = port.cy
                }
                return changes
            }
        },
        computed: {
            points() { // TODO 整合 A-star算法
                return  '' + this.model.x1 + ',' + this.model.y1
                        + ' ' + this.model.x2 + ',' + this.model.y2
            }
        },
        watch: {
            link: {
                deep: true,
                immediate: true,
                handler: function() {
                    this.init()
                }
            }
        }
    }
</script>