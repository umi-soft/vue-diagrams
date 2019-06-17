export default {
    methods: {
        mouseDownNode(event) {
            this.$emit('onStartDrag', event, {
                id: this.node.id,
                type: 'node'
            })
        },
        mouseUpNode() {
            this.$emit('onEndDragNode', this.model)
        },
        mouseDownPort(event, index) {
            let item = null
            const port = this.ports[index]
            // 当前选中了一个link连接线，且两端port与当前port相同，触发连接线的重新绘制
            if (this.dragItem && this.dragItem.type === 'link' && (this.dragItem.startPortId === port.id || this.dragItem.endPortId === port.id)) {
                // 避免修改父组件数据
                item = Object.assign({}, this.dragItem)
                // 识别根据哪一个port将被重新替换
                item.isReDrawingStartPortId = this.dragItem.startPortId === port.id
                // 开启连接线绘制
                item.enableDrawing = true
            } else {
                item = Object.assign({}, port)
                item.type = 'port'
            }
            this.$emit('onStartDrag', event, item)
        },
        mouseUpPort(index) {
            const port = Object.assign({}, this.ports[index])
            if ( !this.dragItem || this.dragItem.id === port.id ) return
            if (this.dragItem.type === 'link') {
                this.$emit('onEndReDrawingLink', port)
            } else if (this.dragItem.type === 'port'){
                this.$emit('onEndDragPort', port)
            }
        },
        mouseEnter() {
            this.hover = true
        },
        mouseLeave() {
            this.hover = false
        }
    }
}