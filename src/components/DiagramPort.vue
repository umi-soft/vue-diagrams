<template>
    <g>
        <svg v-if="type == 'in'"
             :y="y + 55">
            <rect x="0" y="0" rx="3" ry="3"
                  width="10" height="10"
                  :fill="fill"
                  @mouseenter="mouseEnter"
                  @mouseleave="mouseLeave"
                  @mousedown="mouseDown"
                  @mouseup="mouseUp"/>
        </svg>
        <svg v-else
             :y="y + 55">
            <rect rx="3" ry="3" width="10" height="10"
                  :fill="fill"
                  :x="nodeWidth"
                  :y="0"
                  @mouseenter="mouseEnter"
                  @mouseleave="mouseLeave"
                  @mousedown="mouseDown"
                  @mouseup="mouseUp"/>
        </svg>
    </g>
</template>
<script>
    export default {
        props: ['id', 'y', 'type', 'nodeWidth', 'nodeIndex'],
        data() {
            return {
                fill: '#444444'
            }
        },
        methods: {
            mouseEnter() {
                this.fill = '#888888'
            },
            mouseLeave() {
                this.fill = '#444444'
            },
            mouseUp() {
                this.$emit('mouseUp', this.id)
            },
            mouseDown() {
                this.$emit('onStartDragNewLink', this.id)
            }
        }
    }
</script>
