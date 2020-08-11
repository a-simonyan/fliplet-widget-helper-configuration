<template>
  <div class="interface">
    <h3>{{ configuration.title }}</h3>

    <form class="fields">
      <template v-for="field in configuration.fields">
        <component :is="field.type" v-bind="field" v-bind:key="field.name"></component>
      </template>
    </form>
  </div>
</template>

<script>
import Text from './components/Text';
import Html from './components/Html';

Vue.component('flText', Text);
Vue.component('flHtml', Html);

export default {
  data() {
    return Fliplet.Widget.getData();
  }
};
</script>
