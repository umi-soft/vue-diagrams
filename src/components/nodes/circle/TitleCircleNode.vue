<template>
    <g @mousedown.stop="mouseDownNode"
       @mouseup.stop="mouseUpNode"
       @mouseenter="mouseEnter"
       @mouseleave="mouseLeave">
        <circle class="node" :cx="model.cx" :cy="model.cy" :r="model.r"/>

        <template v-for="(port, index) in ports">
            <circle class="port" v-show="hover || isSelected" :ref="port.id" :key="port.id" :cx="port.cx" :cy="port.cy" :r="port.r" @mousedown.stop="mouseDownPort($event, index)" @mouseup.stop="mouseUpPort(index)"/>
        </template>

        <text class="text" v-show="!(hover || isSelected)" :x="portCenter.cx" :y="portCenter.cy">{{ model.title }}</text>
    </g>
</template>

<script>
    import TitleCircleNodeModel from './TitleCircleNodeModel'
    import common from '../common'

    export default {
        name: 'TitleCircleNode',
        mixins: [ common ],
        props: {
            node: {
                require: true,
                type: TitleCircleNodeModel,
                default: new TitleCircleNodeModel()
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
                    cx: this.node.cx,
                    cy: this.node.cy,
                    r: this.node.r
                },
                hover: false
            }
        },
        methods: {
            moving(mouseOffsetX = 0, mouseOffsetY = 0) {
                this.model.cx = this.node.cx + mouseOffsetX
                this.model.cy = this.node.cy + mouseOffsetY
            }
        },
        computed: {
            portLeft() {
                return {
                    id: this.node.id + '/portLeft',
                    cx: this.model.cx - this.model.r,
                    cy: this.model.cy,
                    r: 5
                }
            },
            portRight() {
                return {
                    id: this.node.id + '/portRight',
                    cx: this.model.cx + this.model.r,
                    cy: this.model.cy,
                    r: 5
                }
            },
            portTop() {
                return {
                    id: this.node.id + '/portTop',
                    cx: this.model.cx,
                    cy: this.model.cy - this.model.r,
                    r: 5
                }
            },
            portBottom() {
                return {
                    id: this.node.id + '/portBottom',
                    cx: this.model.cx,
                    cy: this.model.cy + this.model.r,
                    r: 5
                }
            },
            portCenter() {
                return {
                    id: this.node.id + '/portCenter',
                    cx: this.model.cx,
                    cy: this.model.cy,
                    r: 5
                }
            },
            ports() {
                return [this.portLeft, this.portRight, this.portTop, this.portBottom, this.portCenter]
            }
        }
    }
</script>