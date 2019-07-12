<template>
    <g>
        <polyline class="line" :points="link.points"/>
    </g>
</template>

<script>
    import SimplePolylineModel from './SimplePolylineModel'

    export default {
        name: 'SimplePolyline',
        props: {
            link: {
                require: false,
                type: SimplePolylineModel,
                default: () => new SimplePolylineModel()
            }
        }
    }
</script>