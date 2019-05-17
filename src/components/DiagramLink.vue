<template>
    <g @mouseenter="mouseEnter"
       @mouseleave="mouseLeave"
       @mousedown="mouseDown($event, 0)">
        <path stroke-width="8" fill="none"
              :d="curve"
              :style="largeStrokeStyle"/>
        <path style="stroke:rgb(0,0,0);" stroke-width="2" fill="none"
              :d="curve"/>
    </g>
</template>
<script>
    export default {
        props: ['positionFrom', 'positionTo', 'id', 'index'],

        data() {
            return {
                largeStrokeStyle: 'stroke:rgba(255,0,0,0.0);'
            }
        },
        methods: {
            mouseEnter() {
                this.largeStrokeStyle = 'stroke:rgba(255,0,0,0.5);'
            },
            mouseLeave() {
                this.largeStrokeStyle = 'stroke:rgba(255,0,0,0.0);'
            },
            mouseDown(pos, segmentIndex) {
                // this.$emit('onStartDrag', {
                //     type: 'points',
                //     linkIndex: this.index,
                //     segmentIndex
                // })
            }
        },
        computed: {
            x1() {
                return this.positionFrom.x
            },

            y1() {
                return this.positionFrom.y - 4
            },

            x2() {
                return this.positionTo.x - 4
            },

            y2() {
                return this.positionTo.y - 4
            },

            curve() {
                const x1 = Math.trunc(this.positionFrom.x)
                const y1 = Math.trunc(this.positionFrom.y - 4)
                const x2 = Math.trunc(this.positionTo.x - 4)
                const y2 = Math.trunc(this.positionTo.y - 4)

                const distance = Math.trunc(4 * Math.sqrt(Math.abs(x1 - x2)))
                return `M${x1},${y1} C${x1 + distance},${y1} ${x2 - distance},${y2} ${x2},${y2}`
            }
        }
    }
</script>
