<template>
    <Recipe
        @editCancel="cancelEdit"
        :recipe="recipe"
        :defaultEdit="false"
        fetchMethod="put"
    />
</template>

<script setup>
    // data

    const { name :recipeNameInRoute } = useRoute().params

    const { data: recipe } = await useFetch(`/api/get/recipes/${recipeNameInRoute.replace(/-/g, "%20")}`)

    // methods

    const cancelEdit = () => {
        window.location.reload(true)
    }
</script>