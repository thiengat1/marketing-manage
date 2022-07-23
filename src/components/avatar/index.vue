<template>
  <div>
    <Avatar
      :label="name.substring(0, 1).toUpperCase()"
      class="avatar ml-3"
      style="background-color: #2196f3; color: #ffffff"
      shape="circle"
      @click="toggle"
    />
    <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
    <UpdatePassword ref="UpdatePasswordRef" :is-me="true" />
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import UpdatePassword from '@/pages/user/manage/components/UpdatePassword.vue';

export default {
  components: {
    UpdatePassword,
  },
  setup() {
    const menu = ref();
    const items = ref([
      {
        items: [
          {
            label: 'Thay đổi mật khẩu',
            icon: 'pi pi-lock',
            command: () => handleChangePassword(),
          },
          {
            label: 'Đăng xuất',
            icon: 'pi pi-power-off',
            command: () => handleLogout(),
          },
        ],
      },
    ]);
    const store = useStore();
    const router = useRouter();
    const name = computed(() => store.getters.name);

    const UpdatePasswordRef = ref('');

    function handleLogout() {
      store.dispatch('auth/logout').then(() => {
        router.go('/login');
        window.location.reload();
      });
    }
    const toggle = (event) => {
      menu.value.toggle(event);
    };

    function handleChangePassword() {
      UpdatePasswordRef.value.displayModal = true;
    }

    return {
      items,
      menu,
      toggle,
      handleLogout,
      name,
      handleChangePassword,
      UpdatePasswordRef,
    };
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}
</style>
