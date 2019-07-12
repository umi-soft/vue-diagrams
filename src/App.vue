<template>
    <graph :model="model"/>
</template>

<script>
    // import FlowChart from '@/components/flowchart'
    import Graph from '@/components/graph/dagre'

    export default {
        components: { Graph },
        data() {
            return {
                model: {
                    nodes: [],
                    links: []
                }
            }
        }
    }
</script>
