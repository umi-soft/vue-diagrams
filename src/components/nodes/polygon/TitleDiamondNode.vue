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
    import TitleDiamondNodeModel from './TitleDiamondNodeModel'

    export default {
        name: 'TitleDiamondNode',
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
            mouseDownNode(event) {
                this.$emit('onStartDrag', event, {
                    id: this.node.id,
                    type: 'node'
                })
            },
            mouseUpNode() {
                this.$emit('onEndDragNode', this.model)
            },
            moving(mouseOffsetX = 0, mouseOffsetY = 0) {
                this.model.x = this.node.x + mouseOffsetX
                this.model.y = this.node.y + mouseOffsetY
            },
            mouseDownPort(event, index) {
                const port = Object.assign({}, this.ports[index])
                port.type = 'link'
                this.$emit('onStartDrag', event, port)
            },
            mouseUpPort(index) {
                const port = Object.assign({}, this.ports[index])
                if (!this.dragItem || this.dragItem.type !== 'link' || this.dragItem.id === port.id) return
                this.$emit('onEndDragLink', port)
            },
            mouseEnter() {
                this.hover = true
            },
            mouseLeave() {
                this.hover = false
            },
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
            }
        }
    }
</script>