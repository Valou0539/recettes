<template>
    <div class="category">

        <div v-if="error" class="error">
            erreur : {{ error }}
            <button @click="error = ''">
                <Icon class="cancel_edit" name="akar-icons:cross" size="30px"/>
            </button>
        </div>

        <div class="category_header">
            <input 
                class="category_title"
                type="text"
                v-model="categoryName"
                :style="`width: ${categoryName.length > 0 ? categoryName.length + 1 : 17}ch`" 
                :disabled="!edit"
                placeholder="Nom de la catégorie"
            >
            <div v-if="category.id !== 19" class="actions">
                <button @click="edit = true" class="action_button" v-if="!edit">
                    <Icon  class="edit" name="streamline:interface-edit-pencil-change-edit-modify-pencil-write-writing" size="30px"/>
                </button>
                <button @click="validateEdit" class="action_button" v-else>
                    <Icon class="validate_edit" name="fluent-mdl2:accept-medium" size="35px"/>
                </button>
                <button @click="showValidateDeleteAlertBox = true" class="action_button" v-if="!edit">
                    <Icon class="delete" name="material-symbols:delete-outline" size="40px"/>
                </button>
                <button @click="cancelModification" class="action_button" v-else>
                    <Icon class="cancel_edit" name="akar-icons:cross" size="35px"/>
                </button>
            </div>
        </div>
        <HomeCategoryCarousel :recipes="category.recipes"/>

        <ValidateDeleteAlertBox v-if="showValidateDeleteAlertBox"
            @validate="deleteCategory"
            @cancel="showValidateDeleteAlertBox = false"
            :description="`Êtes vous sûr de vouloir supprimer la catégorie « ${category.name} » ?`"
        />
    </div>
</template>

<script setup>
    // data
    const { category } = defineProps(['category'])

    const categoryName = ref(category.name)

    const edit = ref(false)

    const showValidateDeleteAlertBox = ref(false)

    const error = ref('')

    const cancelModification = () => {
        edit.value = false
        categoryName.value = category.name
    }

    const validateEdit = async () => {
        const { data: categoryResponse } = await useFetch(`/api/put/category/${category.id}`, {
            method: 'put',
            body: {
                name: categoryName.value
            }
        })

        console.log(categoryResponse.value)

        if (categoryResponse.value['error']) {
            console.log('test')
            error.value = categoryResponse.value['error']
            return
        }

        edit.value = false
    } 

    const deleteCategory = async () => {
        await useFetch(`/api/delete/category/${category.id}`)
        window.location.reload(true)
    }
</script>

<style lang="sass" scoped>
    @import '~/assets/style/var.sass'

    .category
        padding: 20px 0
        .error
            display: flex
            align-items: flex-start
            gap: 25px
            width: 100%
            padding: 20px 20px
            font-family: 'Roboto'
            font-weight: 600
            font-size: 20px
            text-align: justify
            color: $errorColor
            border-top: 2px solid $textColor
            border-bottom: 2px solid $textColor
            button
                display: block
                background-color: transparent
                border: none
                color: $textColor
        .category_header
            display: flex
            align-items: center
            flex-wrap: wrap
            gap: 10px
            padding-left: 70px
            margin-bottom: 10px
            .category_title
                resize: none
                max-width: 100%
                padding: 0
                margin: 0
                font-family: 'Roboto'
                font-weight: 400
                font-size: 28px
                line-height: 28px
                color: $textColor
                background-color: transparent
                border: none
                margin-right: 15px
            .actions
                display: flex
                gap: 20px
                button
                    display: block
                    background-color: transparent
                    border: none
                    padding: 0
                    .edit, .validate_edit, .cancel_edit
                        color: $textColor
                    .delete
                        color: $deleteColor
</style>