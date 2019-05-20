<template>
    <g>
        <svg v-if="type == 'in'"
             :y="y + 55">
            <rect x="0" y="0" rx="3" ry="3"
                  width="10" height="10"
                  :fill="fill"
                  @mouseenter="mouseEnter"
                  @mouseleave="mouseLeave"
                  @mousedown="startDragNewLink"
                  @mouseup="mouseUp"/>
            <text x="12" y="9"
                  font-size="8pt" fill="#000000">
                {{name}}
            </text>
        </svg>
        <svg v-else
             :y="y + 55">
            <rect rx="3" ry="3" width="10" height="10"
                  :fill="fill"
                  :x="nodeWidth"
                  :y="0"
                  @mouseenter="mouseEnter"
                  @mouseleave="mouseLeave"
                  @mousedown="startDragNewLink"
                  @mouseup="mouseUp"/>
            <text text-anchor="end" font-size="8pt" fill="#000000"
                  :x="nodeWidth - 6"
                  :y="9">
                {{name}}
            </text>
        </svg>
    </g>
</template>
<script>
    export default {
        props: ['id', 'y', 'type', 'name', 'nodeWidth', 'nodeIndex'],
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
                this.$emit('mouseUpPort', this.id)
            },
            startDragNewLink() {
                this.$emit('onStartDragNewLink', this.id)
            }
        }
    }
</script>
