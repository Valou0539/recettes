<template>
    <div class="layout_default">
        <header class="topbar">
            <NuxtLink class="home_link" to="/">
                <Icon name="material-symbols:home-outline" size="60px"/>
                Accueil
            </NuxtLink>
            <nav>
                <div class="search_bar">
                    <input v-model="search" type="text">
                    <Icon class="" name="material-symbols:search" size="40px"/>
                </div>
                <NuxtLink class="new_recipe" to="/recettes/nouvelle">
                    <Icon name="gg:add" size="40px"/>
                    <span>Nouvelle recette</span>
                </NuxtLink>
            </nav>
        </header>

        <main class="main">
            <span v-if="search.length > 1 && searchResults.length === 0" class="no_result">Aucun Résultat</span>
            <div v-else-if="search.length > 1" class="results_container">
                <SearchCard @click="search = ''" v-for="recipe in searchResults"
                    :key="recipe.id"
                    :title="recipe.name"
                    :imgUrl="recipe.imgUrl"
                    :category="recipe.category"
                />
            </div>
            <slot v-else />
        </main>
        
    </div>
</template>

<script setup>
    // data
    const {data: recipes} = await useFetch(`/api/get/recipes`)

    const search = ref('')
    const searchResults = ref([])

    // Watchers
    watch(search, () => {
        searchResults.value = []
        if (search.value.length > 1) {
            recipes.value.forEach(recipe => {
                if (recipe.name.toLowerCase().includes(search.value.toLowerCase())) {
                    searchResults.value.push(recipe)
                }
            })
        }
    })
</script>

<style lang="sass" scoped>
    @import '~/assets/style/var.sass'

    .layout_default
        background-color: $mainColor
        min-height: 100vh
        min-height: 100dvh
        .topbar
            display: flex
            justify-content: space-between
            align-items: center
            gap: 20px
            width: 100%
            min-height: 100px
            padding: 20px 30px 0
            font-family: 'Roboto'
            @media only screen and (max-width: 760px)
                flex-direction: column
                align-items: center
                margin-bottom: 30px
            .home_link
                display: flex
                align-items: flex-end
                color: $secondaryColor
                font-size: 32px
                line-height: 48px
                font-weight: 700
                text-decoration: none
            nav
                display: flex
                justify-content: flex-end
                align-items: center
                gap: 30px
                max-width: 100%
                @media only screen and (max-width: 600px)
                    flex-direction: column
                    align-items: center
                .search_bar
                    position: relative
                    max-width: 100%
                    input
                        width: 420px
                        max-width: 100%
                        height: 50px
                        padding: 0 15px 0 65px
                        border: 2px solid $secondaryColor
                        border-radius: 25px
                        font-weight: 400
                        font-size: 24px
                        line-height: 24px
                        color: $textColor
                        background-color: transparent
                    .icon
                        position: absolute
                        top: 0
                        bottom: 0
                        margin: auto 0
                        left: 15px
                        color: $secondaryColor       
                .new_recipe
                    display: flex
                    align-items: center
                    gap: 10px
                    padding: 10px 20px
                    font-weight: 400
                    font-size: 32px
                    line-height: 24px
                    color: $textColor
                    text-decoration: none
                    background-color: $accentColor
                    border-radius: 10px
                    @media only screen and (max-width: 1030px)
                        padding: 10px
                        span
                            display: none
                    @media only screen and (max-width: 600px)
                        span
                            display: block
                    @media only screen and (max-width: 375px)
                        span
                            display: none
        .main
            .no_result
                display: block
                margin-left: 100px
                margin-top: 40px
                font-family: 'Roboto'
                font-size: 22px
                color: $textColor
            .results_container
                display: flex
                flex-wrap: wrap
                gap: 20px
                margin: 40px 90px 0
                @media only screen and (max-width: 1000px) 
                    margin: 40px 25px 0
                @media only screen and (max-width: 790px) 
                    justify-content: center
</style>