<template>
    <g>
        <ellipse class="node" :cx="node.cx" :cy="node.cy" :rx="node.rx" :ry="node.ry"/>
        <text class="text" :x="node.cx" :y="node.cy">{{ node.title }}</text>
    </g>
</template>

<script>
    import TitleEllipseNodeModel from './TitleEllipseNodeModel'

    export default {
        name: 'TitleEllipseNode',
        props: {
            node: {
                require: true,
                type: TitleEllipseNodeModel,
                default: new TitleEllipseNodeModel()
            }
        }
    }
</script>