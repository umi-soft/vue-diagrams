<template>
    <svg :x="x" :y="y">
        <rect stroke="#000000" x="5" y="15" rx="3" ry="3" class="node-dark-background"
              :fill="color"
              :stroke-width="selected ? 2 : 0"
              :width="width"
              :height="height">
        </rect>
        <svg x="0" y="0"
             @mousedown="mouseDown"
             @mouseenter="mouseEnter"
             @mouseleave="mouseLeave">
            <rect fill="#000000"
                  x="7" y="17" rx="3" ry="3"
                  class="node-dark-background"
                  height="16"
                  :fill-opacity="titleFillOpacity"
                  :width="width-4"/>
            <text font-size="14" font-weight="bold" fill="#000000"
                  :x="10"
                  :y="30">
                {{title}}
            </text>
            <g v-if="deletable" @click="deleteNode">
                <rect y="18" width="14" height="14" rx="2" ry="2" fill="#ffffff"
                      :x="width - 12"
                      :fill-opacity="0.25"/>
                <line stroke="rgb(0,0,0)" stroke-width="2"
                      :x1="width"
                      :y1="20"
                      :x2="width - 10"
                      :y2="30"/>
                <line stroke="rgb(0,0,0)" stroke-width="2"
                      :x1="width - 10"
                      :y1="20"
                      :x2="width"
                      :y2="30"/>
            </g>
        </svg>
        <rect fill="#ffffff"
              x="7" y="35" rx="3" ry="3"
              class="node-light-background"
              :width="width-4"
              :height="height - 22"/>
        <slot></slot>
    </svg>
</template>
<script>
    export default {
        props: {
            title: {
                type: String,
                required: true
            },
            index: Number,
            ports: {
                type: Array,
                default: () => {
                    return []
                }
            },
            x: Number,
            y: Number,
            width: {
                type: Number,
                default: 72
            },
            height: {
                type: Number,
                default: 100
            },
            color: {
                type: String,
                default: '#66cc00'
            },
            deletable: {
                type: Boolean,
                default: true
            },
            selected: Boolean
        },

        data() {
            return {
                nodeStrokeWidth: 0,
                titleFillOpacity: 0.25
            }
        },

        methods: {
            deleteNode: function () {
                this.$emit('onDelete', 'nodes', this.index)
            },

            mouseDown: function (event) {
                this.$emit(
                    'onStartDrag',
                    {
                        type: 'nodes',
                        index: this.index,
                        x: this.x,
                        y: this.y
                    },
                    event.clientX,
                    event.clientY
                )
            },

            mouseEnter() {
                this.titleFillOpacity = 0.5
            },

            mouseLeave() {
                this.titleFillOpacity = 0.25
            }
        }
    }
</script>
