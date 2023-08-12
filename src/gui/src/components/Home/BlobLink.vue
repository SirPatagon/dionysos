<template>
    <router-link :to="to" class="blob" :style="gradientInfo" @mouseover="mouseOver" @mouseleave="mouseLeave">
        <!-- Draw everything relative to a 200x200 canvas, this will then scale to any resolution -->
        <svg viewBox="0 0 200 200" preserve-aspect-ratio="none">
            <defs>
                <!-- Our gradient fill #gradient -->
                <linearGradient :id="'gradient' + id" gradientTransform="rotate(90)">
                    <!-- Use CSS custom properties for the start / stop colors of the gradient -->
                    <stop :id="'gradientStop1' + id" offset="0%" :stop-color="'var(--startColor' + id + ')'" />
                    <stop :id="'gradientStop2' + id" offset="100%" :stop-color="'var(--stopColor' + id + ')'" />
                </linearGradient>
                <pattern :id="'img1' + id" patternUnits="userSpaceOnUse" width="200" height="200">
                    <g>
                        <rect :fill="`url(\'#gradient${id}\')`" width="200" height="200"></rect>
                        <g id="content">
                            <image v-if="image" :href="image" x="0" y="0" width="200" height="200" />
                            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                                style="color: white; font-weight: bold; font-size: 2em">
                                {{ text }}
                            </text>
                        </g>
                    </g>
                </pattern>
            </defs>
            <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feComponentTransfer in="SourceAlpha">
                    <feFuncA type="table" tableValues="1 0" />
                </feComponentTransfer>
                <feGaussianBlur stdDeviation="4" />
                <feOffset dx="5" dy="5" result="offsetblur" />
                <feFlood flood-color="rgb(0, 0, 0)" result="color" />
                <feComposite in2="offsetblur" operator="in" />
                <feComposite in2="SourceAlpha" operator="in" />
                <feMerge>
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode />
                </feMerge>
            </filter>
            <path :d="path" :fill="`url(\'#img1${id}\')`" filter="url(#inset-shadow)"></path>
        </svg>
    </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { spline } from '@georgedoescode/spline';
import { createNoise2D } from 'simplex-noise';

export default defineComponent({
    name: 'BlobLink',
    props: ['to', 'image', 'text'],
    data() {
        return {
            id: NaN,
            path: '',
            gradientInfo: '',
            noiseStep: 0.005,
        };
    },
    mounted() {
        this.id = this.$.uid;

        let hueNoiseOffset = 0;

        const noise2D = createNoise2D();
        const points = this.createPoints();

        (function animate(_t: any) {
            _t.path = spline(points, 1, true);
            const noiseStep: number = _t.noiseStep;

            // for every point...
            for (let i = 0; i < points.length; i++) {
                const point = points[i];

                // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
                const nX = noise2D(point.noiseOffsetX, point.noiseOffsetX);
                const nY = noise2D(point.noiseOffsetY, point.noiseOffsetY);
                // map this noise value to a new value, somewhere between it's original location -15 and it's original location + 15
                const x = _t.map(nX, -1, 1, point.originX - 15, point.originX + 15);
                const y = _t.map(nY, -1, 1, point.originY - 15, point.originY + 15);

                // update the point's current coordinates
                point.x = x;
                point.y = y;

                // progress the point's x, y values through "time"
                point.noiseOffsetX += noiseStep;
                point.noiseOffsetY += noiseStep;
            }

            const hueNoise = noise2D(hueNoiseOffset, hueNoiseOffset);
            const hue = _t.map(hueNoise, -1, 1, 0, 360);

            _t.gradientInfo = `--startColor${_t.id}: hsl(${hue}, 100%, 75%); --stopColor${_t.id}: hsl(${hue + 60}, 100%, 75%)`;
            // document.body.style.background = `hsl(${hue + 60}, 75%, 5%)`;

            hueNoiseOffset += noiseStep / 6;

            requestAnimationFrame(() => animate(_t));
        })(this);
    },
    methods: {
        map(n: number, start1: number, end1: number, start2: number, end2: number) {
            return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
        },
        createPoints() {
            const points: any[] = [];
            // how many points do we need
            const numPoints = 6;
            // used to equally space each point around the circle
            const angleStep = (Math.PI * 2) / numPoints;
            // the radius of the circle
            const rad = 85;

            for (let i = 1; i <= numPoints; i++) {
                // x & y coordinates of the current point
                const theta = i * angleStep;

                const x = 100 + Math.cos(theta) * rad;
                const y = 100 + Math.sin(theta) * rad;

                // store the point's position
                points.push({
                    x: x,
                    y: y,
                    // we need to keep a reference to the point's original point for when we modulate the values later
                    originX: x,
                    originY: y,
                    // more on this in a moment!
                    noiseOffsetX: Math.random() * 1000,
                    noiseOffsetY: Math.random() * 1000,
                });
            }

            return points;
        },
        mouseOver() {
            this.noiseStep = 0.01;
        },
        mouseLeave() {
            this.noiseStep = 0.005;
        },
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.blob {
    display: inline-flex !important; // !important is a dirty hack because parallax.js won't tell me why it overwrites the display attribute
    width: 250px;
    height: 250px;
    justify-content: center;
    align-items: center;
    overflow: visible;
    position: relative;

    svg {
        width: 200px;
        height: 200px;
        transition: all 0.2s ease;

        #content {
            transition: all 0.2s ease;
        }
    }

    &:hover {
        svg {
            width: 250px;
            height: 250px;

            #content {
                transform: translate(20px, 20px) scale(0.8);
            }
        }
    }

    &:active {
        z-index: 999;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translate(-50%, -50%);
        height: 100%;
        width: 100%;

        svg {
            width: 600vw;
            height: 600vh;
        }
    }
}
</style>
