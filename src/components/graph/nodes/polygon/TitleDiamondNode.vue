<template>
    <g>
        <polygon class="node" :points="points"/>
        <text class="text" :x="portCenter.cx" :y="portCenter.cy">{{ node.title }}</text>
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
            }
        },
        computed: {
            portTop() {
                return {
                    id: this.node.id + '/portTop',
                    cx: this.node.x + this.node.width / 2,
                    cy: this.node.y,
                    r: 5
                }
            },
            portBottom() {
                return {
                    id: this.node.id + '/portBottom',
                    cx: this.node.x + this.node.width / 2,
                    cy: this.node.y + this.node.height,
                    r: 5
                }
            },
            portLeft() {
                return {
                    id: this.node.id + '/portLeft',
                    cx: this.node.x,
                    cy: this.node.y + this.node.height / 2,
                    r: 5
                }
            },
            portRight() {
                return {
                    id: this.node.id + '/portRight',
                    cx: this.node.x + this.node.width,
                    cy: this.node.y + this.node.height / 2,
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
            points() {
                return "" + this.portTop.cx + "," + this.portTop.cy + " " + this.portRight.cx + "," + this.portRight.cy + " " + this.portBottom.cx + "," + this.portBottom.cy + " " + this.portLeft.cx + "," + this.portLeft.cy
            }
        }
    }
</script>