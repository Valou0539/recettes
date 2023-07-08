<template>
    <div>
        <NuxtLink class="card" :to="cardLink">
            <img :src="recette.imgUrl" :alt="recette.title">
            {{ recette.title }}
            <span class="category">{{ recette.category }}</span>
        </NuxtLink>    
    </div>
    
</template>

<script setup>
    const recette = defineProps({
        title: String,
        imgUrl: String,
        category: String
    })
    const cardLink = ref(`/recettes/${encodeURIComponent(recette.title.replace(/ /g, "-"))}`)
</script>

<style lang="sass" scoped>
    @import '~/assets/style/var.sass'
    .card
        display: flex
        flex-direction: column
        align-items: center
        gap: 10px
        min-height: 300px
        width: 350px
        padding: 10px
        background-color: $cardsColor
        border-radius: 10px
        font-family: 'Roboto'
        font-weight: 400
        font-size: 24px
        line-height: 32px
        text-align: center
        color: $textColor
        text-decoration: none
        img
            display: block
            width: 100%
            height: 206px
            object-fit: cover
        .category
            align-self: flex-end
            font-family: 'Inter'
            font-weight: 300
            font-size: 21px
            line-height: 22px
            color: $secondaryColor
</style>