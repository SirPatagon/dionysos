<template>
    <div class="home">
        <MainMenu />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MainMenu from '@/components/Home/MainMenu.vue';

export default defineComponent({
    name: 'HomeView',
    components: {
        MainMenu,
    },
});
</script>
