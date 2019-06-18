<template>
    <g @mousedown.stop="mouseDownNode"
       @mouseup.stop="mouseUpNode"
       @mouseenter="mouseEnter"
       @mouseleave="mouseLeave">
        <polygon :class="['node', { 'selected': isSelected }]" :points="points"/>

        <template v-for="(port, index) in ports">
            <circle class="port" v-show="hover" :ref="port.id" :key="port.id" :cx="port.cx" :cy="port.cy" :r="port.r" @mousedown.stop="mouseDownPort($event, index)" @mouseup.stop="mouseUpPort(index)"/>
        </template>

        <text class="text" v-show="!(hover || isSelected)" :x="portCenter.cx" :y="portCenter.cy">{{ model.title }}</text>

        <resize-rect v-if="isSelected" :model="resizeModel" @onStartResize="startResize" />
    </g>
</template>

<script>
    import TitleDiamondNodeModel from './TitleDiamondNodeModel'
    import common from '../common'

    export default {
        name: 'TitleDiamondNode',
        mixins: [ common ],
        props: {
            node: {
                require: true,
                type: TitleDiamondNodeModel,
                default: new TitleDiamondNodeModel()
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
            portTop() {
                return {
                    id: this.node.id + '/portTop',
                    cx: this.model.x + this.model.width / 2,
                    cy: this.model.y,
                    r: 5
                }
            },
            portBottom() {
                return {
                    id: this.node.id + '/portBottom',
                    cx: this.model.x + this.model.width / 2,
                    cy: this.model.y + this.model.height,
                    r: 5
                }
            },
            portLeft() {
                return {
                    id: this.node.id + '/portLeft',
                    cx: this.model.x,
                    cy: this.model.y + this.model.height / 2,
                    r: 5
                }
            },
            portRight() {
                return {
                    id: this.node.id + '/portRight',
                    cx: this.model.x + this.model.width,
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
                return [this.portTop, this.portBottom, this.portLeft, this.portRight, this.portCenter]
            },
            points() {
                return "" + this.portTop.cx + "," + this.portTop.cy + " " + this.portRight.cx + "," + this.portRight.cy + " " + this.portBottom.cx + "," + this.portBottom.cy + " " + this.portLeft.cx + "," + this.portLeft.cy
            },
            resizeModel() {
                return {
                    x: this.model.x - 20,
                    y: this.model.y - 20,
                    width: this.model.width + 20 * 2,
                    height: this.model.height + 20 * 2
                }
            }
        }
    }
</script>