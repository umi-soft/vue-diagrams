<template>
    <g>
        <rect class="node" :x="node.x" :y="node.y" :rx="node.rx" :ry="node.ry" :width="node.width" :height="node.height"/>
        <text class="text" :x="portCenter.cx" :y="portCenter.cy">{{ node.title }}</text>
    </g>
</template>

<script>
    import TitleRectNodeModel from './TitleRectNodeModel'

    export default {
        name: 'TitleRectNode',
        props: {
            node: {
                require: true,
                type: TitleRectNodeModel,
                default: new TitleRectNodeModel()
            }
        },
        computed: {
            portCenter() {
                return {
                    id: this.node.id + '/portCenter',
                    cx: this.node.x + this.node.width / 2,
                    cy: this.node.y + this.node.height / 2,
                    r: 5
                }
            }
        }
    }
</script>