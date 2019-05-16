<template>
    <g>
        <svg :y="y + 55" v-if="type === 'in'">
            <rect ref="handle" x="0" y="0" rx="3" ry="3" width="10" height="10"
                  :fill="fill"
                  @mouseenter="enter" @mouseleave="leave"
                  @mousedown="startDragNewLink"
                  @mouseup="mouseup"/>
            <text x="12" y="9" font-size="8pt" fill="#000000">{{name}}</text>
        </svg>
        <svg :y="y + 55" v-else>
            <rect ref="handle" rx="3" ry="3" width="10" height="10"
                  :fill="fill"
                  :x="nodeWidth" y="0"
                  @mouseenter="enter" @mouseleave="leave" @mousedown="startDragNewLink" @mouseup="mouseup">
            </rect>
            <text y="9" text-anchor="end" font-size="8pt" fill="#000000"
                  :x="nodeWidth - 6">
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
            mouseup() {
                this.$emit('mouseUpPort', this.id)
            },

            enter() {
                this.fill = '#888888'
            },

            leave() {
                this.fill = '#444444'
            },
            startDragNewLink() {
                this.$emit('onStartDragNewLink', this.id)
            }
        }
    }
</script>
