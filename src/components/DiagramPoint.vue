<template>
    <circle stroke-width="6" fill="black" r="5"
            :style="hover?'stroke:rgba(255,0,0,0.5);':'stroke:rgba(255,0,0,0.0);'"
            :cx="x" :cy="y"
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
            @mousedown="$emit('mousedown', $event)"/>
</template>
<script>
    export default {
        name: 'DiagramPoint',
        props: ['x', 'y'],
        data() {
            return {
                hover: false
            }
        },
        methods: {
            mouseEnter() {
                this.hover = true
            },
            mouseLeave() {
                this.hover = false
            }
        }
    }
</script>
