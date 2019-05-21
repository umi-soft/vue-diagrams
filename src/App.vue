<template>
    <diagram :model="model" width="1080" height="720"></diagram>
</template>

<script>
    import Diagram from '@/components/dagrams/Diagram'
    import DiagramModel from './model'
    import TitleRectNode from '@/components/nodes/rect/TitleRectNode'

    export default {
        components: {
            Diagram
        },
        data() {
            const diagramModel = new DiagramModel()

            const node1 = diagramModel.addNode(new TitleRectNode("test", 10, 300, 144, 80))
            node1.color = "#00cc66"

            const node2 = diagramModel.addNode(new TitleRectNode("test3", 10, 100, 72, 100))
            node2.color = "#cc6600"

            diagramModel.addLink(node1.ports[2].id, node2.ports[3].id)

            return {
                model: diagramModel
            }
        }
    }
</script>

<style>

</style>
