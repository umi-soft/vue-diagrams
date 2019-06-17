<template>
    <g @mousedown.stop="mouseDownNode"
       @mouseup.stop="mouseUpNode"
       @mouseenter="mouseEnter"
       @mouseleave="mouseLeave">
        <polygon class="node" :points="points"/>

        <template v-for="(port, index) in ports">
            <circle class="port" v-show="hover || isSelected" :ref="port.id" :key="port.id" :cx="port.cx" :cy="port.cy" :r="port.r" @mousedown.stop="mouseDownPort($event, index)" @mouseup.stop="mouseUpPort(index)"/>
        </template>

        <text class="text" v-show="!(hover || isSelected)" :x="portCenter.cx" :y="portCenter.cy">{{ model.title }}</text>
    </g>
</template>

<script>
    import TitleParallelogramNodeModel from './TitleParallelogramNodeModel'
    import common from '../common'

    export default {
        name: 'TitleParallelogramNode',
        mixins: [ common ],
        props: {
            node: {
                require: true,
                type: TitleParallelogramNodeModel,
                default: new TitleParallelogramNodeModel()
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
            }
        },
        computed: {
            offset() {
                return this.model.width / 5
            },
            portTopLeft() {
                return {
                    id: this.node.id + '/portTopLeft',
                    cx: this.model.x + this.offset,
                    cy: this.model.y,
                    r: 5
                }
            },
            portTopMiddle() {
                return {
                    id: this.node.id + '/portTopMiddle',
                    cx: this.model.x + this.model.width / 2 + this.offset,
                    cy: this.model.y,
                    r: 5
                }
            },
            portTopRight() {
                return {
                    id: this.node.id + '/portTopRight',
                    cx: this.model.x + this.model.width + this.offset,
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
                    cx: this.model.x + this.offset / 2,
                    cy: this.model.y + this.model.height / 2,
                    r: 5
                }
            },
            portRightMiddle() {
                return {
                    id: this.node.id + '/portRightMiddle',
                    cx: this.model.x + this.model.width + this.offset / 2,
                    cy: this.model.y + this.model.height / 2,
                    r: 5
                }
            },
            portCenter() {
                return {
                    id: this.node.id + '/portCenter',
                    cx: this.model.x + this.model.width / 2 + this.offset / 2,
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
            points() {
                return "" + this.portTopLeft.cx + "," + this.portTopLeft.cy + " " + this.portTopRight.cx + "," + this.portTopRight.cy + " " + this.portBottomRight.cx + "," + this.portBottomRight.cy + " " + this.portBottomLeft.cx + "," + this.portBottomLeft.cy
            }
        }
    }
</script>