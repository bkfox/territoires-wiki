<template>
    <span :class="`oo-ui-iconElement-icon wiki-icon-embed oo-ui-icon-${value}`"/>
</template>
<script setup>
const {value} = defineProps({
    value: String
})
</script>

