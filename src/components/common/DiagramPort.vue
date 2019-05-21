<template>
    <circle :r="r * enlarge"
            :fill="fill"
            :cx="cx"
            :cy="cy"
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
            @mousedown="mouseDown"
            @mouseup="mouseUp" />
</template>
<script>
    export default {
        props: ['id', 'r', 'cx', 'cy', 'nodeId', 'nodeIndex'],
        data() {
            return {
                fill: '#444444',
                enlarge: 1
            }
        },
        methods: {
            mouseEnter() {
                this.fill = '#888888'
                this.enlarge = 1.5
            },
            mouseLeave() {
                this.fill = '#444444'
                this.enlarge = 1
            },
            mouseUp() {
                this.$emit('onEndDrag', this.id, this.nodeId)
            },
            mouseDown() {
                this.$emit('onStartDrag', this.id, this.nodeId)
            }
        }
    }
</script>
