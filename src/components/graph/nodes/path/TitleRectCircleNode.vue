<template>
    <g>
        <path class="node" :d="d"/>
        <text class="text" :x="portCenter.cx" :y="portCenter.cy">{{ node.title }}</text>
    </g>
</template>

<script>
    import TitleRectCircleNodeModel from './TitleRectCircleNodeModel'

    export default {
        name: 'TitleRectNode',
        props: {
            node: {
                require: true,
                type: TitleRectCircleNodeModel,
                default: new TitleRectCircleNodeModel()
            }
        },
        computed: {
            portTopLeft() {
                return {
                    id: this.node.id + '/portTopLeft',
                    cx: this.node.x,
                    cy: this.node.y,
                    r: 5
                }
            },
            portTopRight() {
                return {
                    id: this.node.id + '/portTopRight',
                    cx: this.node.x + this.node.width,
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
                    cx: this.node.x + this.node.width / 2,
                    cy: this.node.y + this.node.height / 2,
                    r: 5
                }
            },
            d() {
                return "M" + this.portTopLeft.cx + "," + this.portTopLeft.cy
                    + " L" + this.portTopRight.cx + "," + this.portTopRight.cy
                    + "A" + this.node.height/2 + "," + this.node.height/2 + " 0 1,1 " + this.portBottomRight.cx + "," + this.portBottomRight.cy
                    + " L" + this.portBottomLeft.cx + "," + this.portBottomLeft.cy
                    + "A" + this.node.height/2 + "," + this.node.height/2 + " 0 1,1 " + this.portTopLeft.cx + "," + this.portTopLeft.cy
            }
        }
    }
</script>