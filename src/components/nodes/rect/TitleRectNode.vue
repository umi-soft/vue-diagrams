<template>
    <svg :x="x" :y="y"
         @mouseenter="mouseEnter"
         @mouseleave="mouseLeave">
        <rect stroke="#fff" x="0" y="0" rx="3" ry="3"
              :fill="color"
              :width="width"
              :height="height"/>
        <svg @mousedown="mouseDown">
            <rect fill="#000000"
                  rx="3" ry="3"
                  :x="rectPaddingL" :y="rectPaddingL"
                  :fill-opacity="fillOpacityState"
                  :height="height - 2 * rectPaddingL"
                  :width="width - 2 * rectPaddingL"/>
            <svg x="8" y="8"
                 :height="height - 3 * rectPaddingL"
                 :width="width - 3 * rectPaddingL">
                <text font-size="24" font-weight="bold" fill="#000000"
                      x="50%" y="50%" dy=".1em" text-anchor="middle">
                    {{title}}
                </text>
            </svg>
        </svg>
        <slot/>
    </svg>
</template>
<script>
    export default {
        props: {
            id: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
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
            ports: {
                type: Array,
                default: () => {
                    return []
                }
            },
            color: {
                type: String,
                default: '#66cc00'
            },
            deletable: {
                type: Boolean,
                default: true
            },
            index: Number,
            selected: Boolean
        },
        data() {
            return {
                rectPaddingL: 4,
                rectPaddingR: 4,
                fillOpacity: 0.25
            }
        },
        created() {

        },
        methods: {
            deleteNode() {
                this.$emit('onDelete', 'nodes', this.index)
            },

            mouseDown(event) {
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
                this.fillOpacity = 0.3
                this.$emit('onHover', this.id)
            },

            mouseLeave() {
                this.fillOpacity = 0.2
                this.$emit('onHover', null)
            }
        },
        computed: {
            fillOpacityState() {
                return this.selected ? 0.4 : this.fillOpacity
            }
        }
    }
</script>
