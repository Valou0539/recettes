<template>
    <div class="carousel">
        <button class="prev" v-if="sliderNeedPrev && sliderNeedTranslate" @click="prev">
            <Icon name="mdi:chevron-left" size="50px"/>
        </button>
        <button class="next" v-if="sliderNeedTranslate && sliderNeedNext" @click="next">
            <Icon name="mdi:chevron-right" size="50px"/>
        </button>
        <div class="slider" :style="`transform: translateX(${sliderTranslateX}px)`">
            <HomeCategoryCarouselCard v-for="recipe in recipes"
                :key="recipe.id"
                :title="recipe.name"
                :imgUrl="recipe.imgUrl"
            />
        </div>
    </div>
</template>

<script setup>
    const { recipes } = defineProps(['recipes'])

    const carouselIndex = ref(0)
    const carouselMaxIndex = ref(recipes.length)
    const sliderTranslateX = ref(0)
    const minTranslate = ref(process.client ? -(recipes.length * 370 + 60 - window.innerWidth) : 0)
    const numItemsToScroll  = ref(process.client ? (window.innerWidth <= 740 ? 1 : 2) : 2)
    const sliderNeedTranslate = ref(true)
    const sliderNeedPrev = ref(false)
    const sliderNeedNext = ref(true)

    onMounted(() => {
        sliderNeedNext.value = process.client ? (minTranslate.value < sliderTranslateX.value ? true : false) : true
        window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
    })

    function prev() {
        carouselIndex.value = minmax(0, carouselIndex.value-numItemsToScroll.value, carouselMaxIndex.value)
        sliderTranslateX.value = minmax(minTranslate.value, sliderTranslateX.value + 370 * numItemsToScroll.value, 0)
        sliderNeedPrev.value = sliderTranslateX.value < 0 ? true : false
        sliderNeedNext.value = true
    }

    function next() {
        carouselIndex.value = minmax(0, carouselIndex.value+numItemsToScroll.value, carouselMaxIndex.value)
        sliderTranslateX.value = minmax(minTranslate.value, sliderTranslateX.value - 370 * numItemsToScroll.value, 0)
        sliderNeedPrev.value = true
        sliderNeedNext.value = minTranslate.value < sliderTranslateX.value ? true : false
    }

    function minmax(min, value, max) {
        return Math.min(Math.max(value, min), max)
    } 

    const handleResize = () => {
        if (typeof window !== 'undefined') {
            minTranslate.value = -(recipes.length * 370 +  60 - window.innerWidth)
            sliderTranslateX.value = minmax(minTranslate.value, - 370 * numItemsToScroll.value * carouselIndex.value, 0)
            numItemsToScroll.value = window.innerWidth <= 740 ? 1 : 2
            sliderNeedTranslate.value = minTranslate.value < 0 ? true : false
            sliderNeedPrev.value = sliderTranslateX.value < 0 ? true : false
            sliderNeedNext.value = minTranslate.value < sliderTranslateX.value ? true : false
        }
    }


</script>

<style lang="sass" scoped>
    @import '~/assets/style/var.sass'
    
    .carousel
        position: relative
        padding: 20px 0
        width: 100%
        min-height: 60px
        overflow-x: hidden
        .slider
            display: flex
            align-items: center
            gap: 20px
            padding: 0 40px
            transition: all .3s
        button
            position: absolute
            top: 0px
            bottom: 0
            margin: auto 0
            width: 60px 
            height: 60px
            background-color: $accentColor
            border: none
            border-radius: 50%
            color: $textColor
            z-index: 10
            &.prev
                left: 20px
            &.next
                right: 20px

</style>