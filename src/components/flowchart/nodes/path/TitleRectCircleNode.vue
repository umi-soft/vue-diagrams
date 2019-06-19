<template>
    <g @mousedown.stop="mouseDownNode"
       @mouseup.stop="mouseUpNode"
       @mouseenter="mouseEnter"
       @mouseleave="mouseLeave">

        <path :class="['node', { 'selected': isSelected }]" :d="d"/>

        <template v-for="(port, index) in ports">
            <circle class="port" v-show="hover" :ref="port.id" :key="port.id" :cx="port.cx" :cy="port.cy" :r="port.r" @mousedown.stop="mouseDownPort($event, index)" @mouseup.stop="mouseUpPort(index)"/>
        </template>

        <text class="text" v-show="!(hover || isSelected)" :x="portCenter.cx" :y="portCenter.cy">{{ model.title }}</text>

        <resize-rect v-if="isSelected" :model="resizeModel" @onStartResize="startResize" />
    </g>
</template>

<script>
    import TitleRectCircleNodeModel from './TitleRectCircleNodeModel'
    import common from '../common'

    export default {
        name: 'TitleRectNode',
        mixins: [ common ],
        props: {
            node: {
                require: true,
                type: TitleRectCircleNodeModel,
                default: new TitleRectCircleNodeModel()
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
                    title: this.node.title,
                    x: this.node.x,
                    y: this.node.y,
                    width: this.node.width,
                    height: this.node.height
                },
                hover: false
            }
        },
        methods: {
            moving(mouseOffsetX = 0, mouseOffsetY = 0) {
                this.model.x = this.node.x + mouseOffsetX
                this.model.y = this.node.y + mouseOffsetY
            },
            resizing(mouseOffsetX = 0, mouseOffsetY = 0) {
                if (this.dragItem.direction === 'top-left') {
                    this.model.x = this.node.x + mouseOffsetX
                    this.model.y = this.node.y + mouseOffsetY
                    this.model.width = this.node.width - mouseOffsetX
                    this.model.height = this.node.height - mouseOffsetY

                } else if (this.dragItem.direction === 'top-middle') {
                    this.model.y = this.node.y + mouseOffsetY
                    this.model.height = this.node.height - mouseOffsetY

                } else if (this.dragItem.direction === 'top-right') {
                    this.model.y = this.node.y + mouseOffsetY
                    this.model.width = this.node.width + mouseOffsetX
                    this.model.height = this.node.height - mouseOffsetY

                } else if (this.dragItem.direction === 'bottom-left') {
                    this.model.x = this.node.x + mouseOffsetX
                    this.model.width = this.node.width - mouseOffsetX
                    this.model.height = this.node.height + mouseOffsetY

                } else if (this.dragItem.direction === 'bottom-middle') {
                    this.model.height = this.node.height + mouseOffsetY

                } else if (this.dragItem.direction === 'bottom-right') {
                    this.model.width = this.node.width + mouseOffsetX
                    this.model.height = this.node.height + mouseOffsetY

                } else if (this.dragItem.direction === 'left-middle') {
                    this.model.x = this.node.x + mouseOffsetX
                    this.model.width = this.node.width - mouseOffsetX

                } else if (this.dragItem.direction === 'right-middle') {
                    this.model.width = this.node.width + mouseOffsetX

                }
            }
        },
        computed: {
            portTopLeft() {
                return {
                    id: this.node.id + '/portTopLeft',
                    cx: this.model.x,
                    cy: this.model.y,
                    r: 5
                }
            },
            portTopMiddle() {
                return {
                    id: this.node.id + '/portTopMiddle',
                    cx: this.model.x + this.model.width / 2,
                    cy: this.model.y,
                    r: 5
                }
            },
            portTopRight() {
                return {
                    id: this.node.id + '/portTopRight',
                    cx: this.model.x + this.model.width,
                    cy: this.model.y,
                    r: 5
                }
            },
            portBottomLeft() {
                return {
                    id: this.node.id + '/portBottomLeft',
                    cx: this.model.x,
                    cy: this.model.y + this.model.height,
                    r: 5
                }
            },
            portBottomMiddle() {
                return {
                    id: this.node.id + '/portBottomMiddle',
                    cx: this.model.x + this.model.width / 2,
                    cy: this.model.y + this.model.height,
                    r: 5
                }
            },
            portBottomRight() {
                return {
                    id: this.node.id + '/portBottomRight',
                    cx: this.model.x + this.model.width,
                    cy: this.model.y + this.model.height,
                    r: 5
                }
            },
            portLeftMiddle() {
                return {
                    id: this.node.id + '/portLeftMiddle',
                    cx: this.model.x - this.model.height / 2,
                    cy: this.model.y + this.model.height / 2,
                    r: 5
                }
            },
            portRightMiddle() {
                return {
                    id: this.node.id + '/portRightMiddle',
                    cx: this.model.x + this.model.width + this.model.height / 2,
                    cy: this.model.y + this.model.height / 2,
                    r: 5
                }
            },
            portCenter() {
                return {
                    id: this.node.id + '/portCenter',
                    cx: this.model.x + this.model.width / 2,
                    cy: this.model.y + this.model.height / 2,
                    r: 5
                }
            },
            ports() {
                return [
                    this.portTopLeft, this.portTopMiddle, this.portTopRight,
                    this.portBottomLeft, this.portBottomMiddle, this.portBottomRight,
                    this.portLeftMiddle, this.portRightMiddle, this.portCenter
                ]
            },
            d() {
                return "M" + this.portTopLeft.cx + "," + this.portTopLeft.cy
                    + " L" + this.portTopRight.cx + "," + this.portTopRight.cy
                    + "A" + this.model.height/2 + "," + this.model.height/2 + " 0 1,1 " + this.portBottomRight.cx + "," + this.portBottomRight.cy
                    + " L" + this.portBottomLeft.cx + "," + this.portBottomLeft.cy
                    + "A" + this.model.height/2 + "," + this.model.height/2 + " 0 1,1 " + this.portTopLeft.cx + "," + this.portTopLeft.cy
            },
            resizeModel() {
                return {
                    x: this.portLeftMiddle.cx  - 20,
                    y: this.portTopLeft.cy - 20,
                    width: this.model.width + this.model.height + 20 * 2,
                    height: this.model.height + 20 * 2
                }
            }
        }
    }
</script>