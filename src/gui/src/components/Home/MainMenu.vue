<template>
    <main id="mainMenu" :style="{ transform: `translate(-50%, -50%) scale(${scale})` }">
        <img src="res/images/logo_light.svg" />
        <BlobLink to="/about" image="res/images/logo_light.svg" text="foo" />
        <BlobLink to="/about" image="" text="bar" />
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BlobLink from '@/components/Home/BlobLink.vue';

export default defineComponent({
    name: 'MainMenu',
    props: {
        msg: String,
    },
    data() {
        return {
            scale: 0,
        };
    },
    components: {
        BlobLink,
    },
    mounted() {
        window.addEventListener('resize', this.updateScale);
        this.updateScale();
    },
    methods: {
        updateScale() {
            this.scale = Math.min(document.documentElement.clientWidth / 1200, document.documentElement.clientHeight / 900);
        },
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#mainMenu {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 50%;
    top: 50%;
    padding: 0;
    width: 1200px;
    height: 900px;
    box-sizing: border-box;
    border: 5px solid red;
    transform: translate(-50%, -50%);
    transform-origin: center center;

    > img {
        width: 400px;
    }
    > .blob {
        position: absolute;

        &:nth-of-type(1) {
            top: 100px;
            left: 50px;
        }

        &:nth-of-type(2) {
            top: 0px;
            left: 250px;
        }
    }
}
</style>
