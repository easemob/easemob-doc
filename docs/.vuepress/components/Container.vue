<script>
    export default {
        props: ['type', 'title']
    }
</script>

<template>
    <div v-if="type==='details'">
        <details class="custom-details">
            <summary>{{title}}</summary>
            <p>
                <slot></slot>
            </p>
        </details>
    </div>
    <div v-else>
        <div :class="'custom-block ' + type">
            <p class="custom-block-title">{{title}}</p>
            <p>
                <slot></slot>
            </p>
        </div>
    </div>
</template>