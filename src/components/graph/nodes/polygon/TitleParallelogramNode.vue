<template>
    <g>
        <polygon class="node" :points="points"/>
        <text class="text" :x="portCenter.cx" :y="portCenter.cy">{{ node.title }}</text>
    </g>
</template>

<script>
    import TitleParallelogramNodeModel from './TitleParallelogramNodeModel'

    export default {
        name: 'TitleParallelogramNode',
        props: {
            node: {
                require: true,
                type: TitleParallelogramNodeModel,
                default: new TitleParallelogramNodeModel()
            }
        },
        computed: {
            offset() {
                return this.node.width / 5
            },
            portTopLeft() {
                return {
                    id: this.node.id + '/portTopLeft',
                    cx: this.node.x + this.offset,
                    cy: this.node.y,
                    r: 5
                }
            },
            portTopRight() {
                return {
                    id: this.node.id + '/portTopRight',
                    cx: this.node.x + this.node.width + this.offset,
                    cy: this.node.y,
                    r: 5
                }
            },
            portBottomLeft() {
                return {
                    id: this.node.id + '/portBottomLeft',
                    cx: this.node.x,
                    cy: this.node.y + this.node.height,
                    r: 5
                }
            },
            portBottomRight() {
                return {
                    id: this.node.id + '/portBottomRight',
                    cx: this.node.x + this.node.width,
                    cy: this.node.y + this.node.height,
                    r: 5
                }
            },
            portCenter() {
                return {
                    id: this.node.id + '/portCenter',
                    cx: this.node.x + this.node.width / 2 + this.offset / 2,
                    cy: this.node.y + this.node.height / 2,
                    r: 5
                }
            },
            points() {
                return "" + this.portTopLeft.cx + "," + this.portTopLeft.cy + " " + this.portTopRight.cx + "," + this.portTopRight.cy + " " + this.portBottomRight.cx + "," + this.portBottomRight.cy + " " + this.portBottomLeft.cx + "," + this.portBottomLeft.cy
            }
        }
    }
</script>