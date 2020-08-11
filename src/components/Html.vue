<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <p v-if="description">{{ description }}</p>
    <div v-html="html"></div>
  </div>
</template>

<script>
export default {
  props: [
    'type',
    'name',
    'label',
    'html',
    'value',
    'description'
  ]
};
</script>
