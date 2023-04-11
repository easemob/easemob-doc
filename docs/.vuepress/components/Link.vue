<script>
export default {
    props: ['title', 'to']
}
</script>

<template>
    <router-link :to="to">{{ title }}</router-link>
</template>