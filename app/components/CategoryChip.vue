<script setup lang="ts">
const props = defineProps<{ name: string; solid?: boolean }>()
const cat = computed(() => categoryOf(props.name))
</script>

<template>
  <span
    class="chip"
    :style="solid ? { background: cat.color, color: '#fff' } : { background: cat.soft, color: cat.color }"
  >{{ cat.icon }} {{ cat.name }}</span>
</template>
