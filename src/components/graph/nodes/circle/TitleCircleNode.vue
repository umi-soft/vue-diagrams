<template>
    <g>
        <circle class="node" :cx="node.cx" :cy="node.cy" :r="node.r"/>
        <text class="text" :x="node.cx" :y="node.cy">{{ node.title }}</text>
    </g>
</template>

<script>
    import TitleCircleNodeModel from './TitleCircleNodeModel'

    export default {
        name: 'TitleCircleNode',
        props: {
            node: {
                require: true,
                type: TitleCircleNodeModel,
                default: new TitleCircleNodeModel()
            }
        }
    }
</script>