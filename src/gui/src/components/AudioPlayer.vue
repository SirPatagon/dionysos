<template>
    <div class="audio-player">
        <button @click="pauseUnpause">{{ paused ? 'play_arrow' : 'pause' }}</button>
        <button @click="muteUnmute" style="text-align: left;">{{ volumeIcon }}</button>
        <input type="range" min="0" max="1" step="0.05" v-model="volume" :disabled="muted"
            :style="{ 'background': sliderBackground }" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AudioPlayer',
    props: {
        src: String,
        autoplay: Boolean,
    },
    data() {
        return {
            player: new Audio(this.src),
            fvolume: 0.2,
            paused: true,
            muted: false,
        };
    },
    mounted() {
        this.player.loop = true;
        this.volume = 0.2;

        if (this.autoplay) {
            window.focus();
            this.play();
        }
    },
    methods: {
        play() {
            this.player.play()
                .then(() => (this.paused = false))
                .catch(() => {
                    this.paused = true;
                });
        },
        pause() {
            this.player.pause();
            this.paused = true;
        },
        pauseUnpause() {
            if (this.paused)
                this.play();
            else
                this.pause();
        },
        muteUnmute() {
            this.player.muted = this.muted = !this.muted;
        },
    },
    computed: {
        volume: {
            get() {
                return this.fvolume;
            },
            set(value: number) {
                this.player.volume = this.fvolume = value;
            },
        },
        sliderBackground() {
            return `linear-gradient(to right, #fff ${this.volume * 100}%, #ffffff7f ${this.volume * 100}%)`;
        },
        volumeIcon() {
            if (this.muted)
                return 'volume_off';
            if (this.volume < 0.05)
                return 'volume_mute';
            if (this.volume < 0.5)
                return 'volume_down';
            return 'volume_up';
        },
    },
});
</script>

<style scoped lang="scss">
@import '../styles/material-icons.scss';

.audio-player {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    margin: .2rem .5rem;

    button {
        font-family: 'Material Icons';
        font-size: 2rem;
        color: white;
        background: none;
        border: 0;
        outline: none;
        cursor: pointer;
    }

    input[type='range'] {
        background: transparent;
        height: 2px;
        border-radius: 1px;
        width: 100px;

        &::-webkit-sider-thumb,
        &::-moz-range-thumb {
            appearance: none;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: white;
            border: 0;
            cursor: pointer;
            transition: all .2s ease;
        }

        &:active:not(:disabled) {

            &::-webkit-sider-thumb,
            &::-moz-range-thumb {
                width: 20px;
                height: 20px;
            }
        }

        &:disabled {
            filter: brightness(.75);

            &::-webkit-sider-thumb,
            &::-moz-range-thumb {
                cursor: default;
            }
        }
    }
}
</style>
