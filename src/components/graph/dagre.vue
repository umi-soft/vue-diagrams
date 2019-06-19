<template>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMinYMin meet"
         :id="diagramRoot"
         :viewBox="viewBox"
         :width="width + 'px'"
         :height="height + 'px'">

        <template v-for="link in links">
            <component :key="link.id" :ref="link.id" :is="link.category" :link="link"/>
        </template>

        <template v-for="node in nodes">
            <component :key="node.id" :ref="node.id" :is="node.type" :node="node"/>
        </template>
    </svg>
</template>

<script>
    import Dagre from 'dagre'
    import { generateId } from '@/utils'
    import './nodes'
    import './links'
    import Model from './nodes/model'
    import SimplePolylineModel from './links/SimplePolylineModel'

    export default {
        name: 'Graph',
        mounted() {
            this.nodes.push(new Model.TitleCircleNodeModel('1'))
            this.nodes.push(new Model.TitleEllipseNodeModel('2'))
            this.nodes.push(new Model.TitleRectNodeModel('3'))
            this.nodes.push(new Model.TitleRectCircleNodeModel('4'))
            this.nodes.push(new Model.TitleParallelogramNodeModel('5'))
            this.nodes.push(new Model.TitleDiamondNodeModel('6'))

            const graph = new Dagre.graphlib.Graph()
            graph.setGraph({ directed: false, multigraph: false, rankdir: 'BT' })
            graph.setDefaultEdgeLabel(function() {return {}})

            graph.setEdge(this.nodes[0].id, this.nodes[1].id)
            graph.setEdge(this.nodes[0].id, this.nodes[2].id)
            graph.setEdge(this.nodes[0].id, this.nodes[3].id)
            graph.setEdge(this.nodes[0].id, this.nodes[4].id)
            graph.setEdge(this.nodes[0].id, this.nodes[5].id)

            this.nodes.forEach(node => graph.setNode(node.id, node.getRect()))
            this.links.forEach(link => graph.setEdge(link.startPortId, link.endPortId))
            Dagre.layout(graph)
            this.nodes.forEach(node => {
                node.setPosition(graph.node(node.id))
            })
            graph.edges().forEach(edge => {
                let points = null
                graph.edge(edge).points.forEach(point => {
                    if (points) {
                        points = points + ' ' + point.x + ',' + point.y
                    } else {
                        points = '' + point.x + ',' + point.y
                    }
                    return points
                })
                this.links.push(new SimplePolylineModel('', points))
            })

        },
        props: {
            diagramRoot: {
                require: false,
                type: String,
                default: generateId()
            },
            width: {
                require: false,
                type: Number,
                default: 1280
            },
            height: {
                require: false,
                type: Number,
                default: 960
            },
            model: {
                require: true,
                type: Object,
                default: () => { return { nodes: [], links: [] } }
            }
        },
        data() {
            return {
                nodes: this.model.nodes,
                links: this.model.links
            }
        },
        computed: {
            viewBox() {
                return '0 0 ' + this.width + ' ' + this.height
            }
        }
    }
</script>

<style lang="scss">
    @import './theme/default.scss';
</style>