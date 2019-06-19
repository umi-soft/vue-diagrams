<template>
    <g>
        <defs>
            <clipPath v-for="(port, index) in universalPorts" :key="'universal-clip-path-' + index" :id="'universal-clip-path-' + index">
                <rect :x="port.cx - port.r * Math.sqrt(2) / 2" :y="port.cy - port.r * Math.sqrt(2) / 2" :width="port.r * Math.sqrt(2)" :height="port.r * Math.sqrt(2)" />
            </clipPath>
            <template v-if="enableDiagonal">
                <clipPath v-for="(port, index) in diagonalPorts" :key="'diagonal-clip-path-' + index" :id="'diagonal-clip-path-' + index">
                    <rect :x="port.cx - port.r * Math.sqrt(2) / 2" :y="port.cy - port.r * Math.sqrt(2) / 2" :width="port.r * Math.sqrt(2)" :height="port.r * Math.sqrt(2)" />
                </clipPath>
            </template>
        </defs>

        <path class="resize" stroke-width="1" stroke-dasharray="5,5" fill="none" :d="d"/>

        <template v-for="(port, index) in universalPorts">
            <circle class="port" :key="'universal-port-' + index" :cx="port.cx" :cy="port.cy" :r="port.r" :clip-path="'url(#universal-clip-path-' + index + ')'" @mousedown.stop="startResize($event, port)"/>
        </template>

        <template v-for="(port, index) in diagonalPorts">
            <circle class="port" v-if="enableDiagonal" :key="'diagonal-port-' + index" :cx="port.cx" :cy="port.cy" :r="port.r" :clip-path="'url(#diagonal-clip-path-' + index + ')'" @mousedown.stop="startResize($event, port)"/>
        </template>
    </g>
</template>

<script>
    export default {
        name: 'ResizeRect',
        props: {
            enableDiagonal: {
                required: false,
                type: Boolean,
                default: true
            },
            model: {
                required: true,
                type: Object
            }
        },
        methods: {
            startResize(event, port) {
                const direction = {
                    direction: port.direction
                }
                this.$emit('onStartResize', event, direction)
            }
        },
        computed: {
            topLeft() {
                return {
                    direction: 'top-left',
                    cx: this.model.x,
                    cy: this.model.y,
                    r: 5
                }
            },
            topMiddle() {
                return {
                    direction: 'top-middle',
                    cx: this.model.x + this.model.width / 2,
                    cy: this.model.y,
                    r: 5
                }
            },
            topRight() {
                return {
                    direction: 'top-right',
                    cx: this.model.x + this.model.width,
                    cy: this.model.y,
                    r: 5
                }
            },
            bottomLeft() {
                return {
                    direction: 'bottom-left',
                    cx: this.model.x,
                    cy: this.model.y + this.model.height,
                    r: 5
                }
            },
            bottomMiddle() {
                return {
                    direction: 'bottom-middle',
                    cx: this.model.x + this.model.width / 2,
                    cy: this.model.y + this.model.height,
                    r: 5
                }
            },
            bottomRight() {
                return {
                    direction: 'bottom-right',
                    cx: this.model.x + this.model.width,
                    cy: this.model.y + this.model.height,
                    r: 5
                }
            },
            leftMiddle() {
                return {
                    direction: 'left-middle',
                    cx: this.model.x,
                    cy: this.model.y + this.model.height / 2,
                    r: 5
                }
            },
            rightMiddle() {
                return {
                    direction: 'right-middle',
                    cx: this.model.x + this.model.width,
                    cy: this.model.y + this.model.height / 2,
                    r: 5
                }
            },
            universalPorts() {
                return [ this.topMiddle, this.bottomMiddle, this.leftMiddle, this.rightMiddle ]
            },
            diagonalPorts() {
                return [ this.topLeft, this.topRight, this.bottomLeft,  this.bottomRight]
            },
            d() {
                return  'M' + this.model.x + ',' + this.model.y + ' '
                        + 'L' + this.model.x + ',' + (this.model.y + this.model.height) + ' '
                        + 'L' + (this.model.x + this.model.width) + ',' + (this.model.y + this.model.height) + ' '
                        + 'L' + (this.model.x + this.model.width) + ',' + this.model.y + ' z'
            }
        }
    }
</script>

<style scoped>

</style>