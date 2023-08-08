<template>
    <main id="mainMenu" :style="{ transform: `translate(-50%, -50%) scale(${scale})` }">
        <img data-depth="0.2" src="res/images/logo_light.svg" />
        <BlobLink data-depth="0.1" to="/about" image="res/images/logo_light.svg" text="foo" />
        <BlobLink data-depth="0.1" to="/about" image="" text="bar" />
        <audio src="res/sounds/New York, 1924.mp3"></audio>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Parallax from 'parallax-js';
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

        new Parallax(document.getElementById('mainMenu'), {
            pointerEvents: true,
        });
        var theme = new Audio('res/sounds/New York, 1924.mp3');
        theme.loop = true;
        theme.volume = 0.2;
        theme.play().catch();
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

        // !important is a dirty hack because parallax.js won't tell me why it overwrites the display attribute
        &:nth-of-type(1) {
            top: 100px !important;
            left: 50px !important;
        }

        &:nth-of-type(2) {
            top: 0px !important;
            left: 250px !important;
        }
    }
}
</style>
