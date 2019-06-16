<template>
    <g>
        <defs>
            <marker :id="markerId"
                    markerWidth="10" markerHeight="10"
                    refX="0" refY="3"
                    orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
                <path class="marker" d="M0,0 L0,6 L9,3 z"/>
            </marker>
        </defs>
        <line class="line" :x1="model.x1" :y1="model.y1" :x2="model.x2" :y2="model.y2" :marker-end="'url(#' + markerId + ')'" />
    </g>
</template>

<script>
    import { generateId } from '@/utils'
    import SimpleLineTriangleMarkerModel from './SimpleLineTriangleMarkerModel'

    export default {
        name: 'SimpleLineTriangleMarker',
        props: {
            link: {
                require: false,
                type: SimpleLineTriangleMarkerModel,
                default: () => new SimpleLineTriangleMarkerModel()
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
                    x2: this.link.x2,
                    y1: this.link.y1,
                    y2: this.link.y2
                },
                markerId: generateId()
            }
        },
        methods: {
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
                return new SimpleLineTriangleMarkerModel('', startPortId, endPortId, this.model.x1, this.model.x2, this.model.y1, this.model.y2)
            }
        },
        watch: {
            link: {
                deep: true,
                immediate: true,
                handler: function() {
                    this.model.x1 = this.link.x1
                    this.model.x2 = this.link.x2
                    this.model.y1 = this.link.y1
                    this.model.y2 = this.link.y2
                }
            }
        }
    }
</script>