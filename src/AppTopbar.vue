<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img alt="Logo" :src="topbarImage()" />
      <span>ku66.org</span>
    </router-link>
    <button
      class="p-link layout-menu-button layout-topbar-button"
      @click="onMenuToggle"
    >
      <i class="pi pi-bars"></i>
    </button>

    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true,
      }"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <li class="flex align-items-center">
        <div class="field-radiobutton mb-0 mr-2">
          <RadioButton
            id="dark"
            name="type"
            value="dark"
            v-model="type"
            @change="handleChangeType"
          />
          <label for="city1">dark</label>
        </div>
        <div class="field-radiobutton mb-0 mr-6">
          <RadioButton
            id="light"
            name="type"
            value="light"
            v-model="type"
            @change="handleChangeType"
          />
          <label for="city2">light</label>
        </div>
      </li>
      <li class="flex align-items-center">
        <span class="font-bold text-xl text-primary">{{ name }}</span>
      </li>
      <li>
        <Avatar />
      </li>
    </ul>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import EventBus from './AppEventBus';
import Avatar from '@/components/avatar';
export default {
  components: {
    Avatar,
  },
  setup() {
    const store = useStore();
    const name = computed(() => store.getters.name);
    const type = ref('dark');

    function handleChangeType(event) {
      if (type.value === 'dark') {
        EventBus.emit('theme-change', {
          theme: 'bootstrap4-dark-blue',
          dark: true,
        });
      } else {
        EventBus.emit('theme-change', {
          theme: 'bootstrap4-light-blue',
          dark: false,
        });
      }
      event.preventDefault();
    }
    return {
      name,
      type,
      handleChangeType,
    };
  },
  methods: {
    onMenuToggle(event) {
      this.$emit('menu-toggle', event);
    },
    onTopbarMenuToggle(event) {
      this.$emit('topbar-menu-toggle', event);
    },
    topbarImage() {
      return this.$appState.darkTheme
        ? 'images/logo/logo.png'
        : 'images/logo/logo.png';
    },
  },
  computed: {
    darkTheme() {
      return this.$appState.darkTheme;
    },
  },
};
</script>
<style lang="scss">
@media screen and (max-width: 960px) {
  .layout-topbar-menu {
    li {
      margin-bottom: 16px;
    }
  }
}
</style>
