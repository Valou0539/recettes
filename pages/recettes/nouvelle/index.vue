<template>
    <Recipe
        @editCancel="showValidateDeleteAlertBox = true"
        :recipe="newRecipe"
        :defaultEdit="true"
        fetchMethod="post"
    />

    <ValidateDeleteAlertBox v-if="showValidateDeleteAlertBox"
        @validate="cancelCreation"
        @cancel="showValidateDeleteAlertBox = false"
        :description="`Êtes vous sûr de vouloir abandonner la création de votre recette`"
    />
</template>

<script setup>
    // Props
    const newRecipe = ref({
        name: '',
        category_id: 19,
        creation_date: Date.now(),
        description: '',
        ingredients: [''],
        steps: [''],
        imgUrl: ''
    })

    // Data
    const showValidateDeleteAlertBox = ref(false)

    // Methods
    const cancelCreation = () => {
        navigateTo('/')
    }
</script>