<template>
    <main class="recipe">
        <div v-if="error" class="error">
            erreur : {{ error }}
            <button @click="error = ''">
                <Icon class="cancel_edit" name="akar-icons:cross" size="30px"/>
            </button>
        </div>
        <div class="title">
            <div class="text">
                <textarea 
                    @input="autoResize"
                    :style="`width: ${recipeName.length > 0 ? recipeName.length + 2 : 15}ch`"
                    rows="1"
                    v-model="recipeName" 
                    :disabled="!edit" 
                    placeholder="Nom de la recette"
                />
                <span class="date">
                    {{ `${recipeDate.getDate()} ${months[recipeDate.getMonth()]} ${recipeDate.getFullYear()}` }}
                </span>
            </div>
            <div class="actions">
                <button v-if="!edit"
                    @click="enableEdit" 
                    class="action_button"
                >
                    <Icon  class="edit" name="streamline:interface-edit-pencil-change-edit-modify-pencil-write-writing" size="35px"/>
                </button>
                <button v-else 
                    @click="createOrEditRecipe"
                    class="action_button"
                >
                    <Icon class="validate_edit" name="fluent-mdl2:accept-medium" size="35px"/>
                </button>
                <button v-if="!edit"
                    @click="showValidateDeleteAlertBox = true"
                    class="action_button"
                >
                    <Icon class="delete" name="material-symbols:delete-outline" size="46px"/>
                </button>
                <button v-else
                    @click="handleEditCancel"
                    class="action_button">
                    <Icon class="cancel_edit" name="akar-icons:cross" size="35px"/>
                </button>
            </div>
        </div>


        <div class="recipe_content">

            <div class="recipe_image_container">
                <NuxtImg class="recipe_image" :src="inputImage ? inputImage : (recipeImageURL ? recipeImageURL : '/img/default-recipe-image.png')"/>
                <div v-if="edit" class="input_container">
                    <label @keydown.enter="targetClick" tabindex="0" for="image_upload">
                        Changer l'image
                    </label>
                    <input @change="changeImage" id="image_upload" type="file" accept="image/*">
                </div>
            </div>

            <div class="recipe_info">

                <textarea
                    class="recipe_description"
                    @input="autoResize"
                    rows="1"
                    v-model="recipeDescription"
                    :disabled="!edit"
                    placeholder="Description de la recette"
                />

                <section class="category">
                    <h2>Catégorie:</h2>
                    <span v-if="!edit">{{ recipeCategorieName }}</span>
                    <select v-else v-model="recipeCategoryId" name="category" id="category">
                        <option v-for="categoryName in categoriesName"
                            :key="categoryName.id"
                            :value="categoryName.id"
                        >
                            {{ categoryName.name }}
                        </option>
                        <option value="new">{{ newCategoryName() }}</option>
                    </select>
                </section>

                <section class="ingredients">
                    <h2>Ingrédients</h2>
                    <ul>
                        <li v-for="(ingredient, id) in recipeIngredients" :key="id">
                            <div class="li_flex_content">
                                <textarea
                                    rows="1"
                                    @input="autoResize"
                                    v-model="recipeIngredients[id]"
                                    :disabled="!edit"
                                    placeholder="Quantité et nom de l’ingrédient"
                                />
                                <button v-if="edit" @click="recipeIngredientDelete(id)" class="action_button">
                                    <Icon class="delete" name="material-symbols:delete-outline" size="33px"/>
                                </button>    
                            </div>
                        </li>
                    </ul>
                    <button v-if="edit" @click="recipeIngredients.push('')" class="add_button">
                        Ajouter un ingrédient
                    </button>
                </section>

                <section class="steps">
                    <h2>Étapes</h2>
                    <ol>
                        <li v-for="(step, id) in recipeSteps" :key="id">
                            <div class="li_flex_content">
                                <textarea
                                    rows="1"
                                    @input="autoResize"
                                    v-model="recipeSteps[id]"
                                    :disabled="!edit"
                                    placeholder="Description de l’étape"
                                />
                                <button v-if="edit" @click="recipeStepDelete(id)"  class="action_button">
                                    <Icon class="delete" name="material-symbols:delete-outline" size="33px"/>
                                </button>    
                            </div>
                        </li>
                    </ol>
                    <button v-if="edit" @click="recipeSteps.push('')" class="add_button">
                        Ajouter une étape
                    </button>
                </section>
            </div>

        </div>

    </main>

    <ValidateDeleteAlertBox v-if="showValidateDeleteAlertBox"
        @validate="deleteRecipe"
        @cancel="showValidateDeleteAlertBox = false"
        :description="`Êtes vous sûr de vouloir supprimer la recette « ${recipe.name} » ?`"
    />

    <div v-if="showLoader" class="loader">
        <NuxtImg class="loader_img" src="/img/loader.gif" />
    </div>
     
</template>

<script setup>
    //Props
    const { recipe, defaultEdit, fetchMethod } = defineProps(['recipe', 'defaultEdit', "fetchMethod"])

    //Data
    const {data: categoriesName} = await useFetch(`/api/get/categories/name`)

    const edit = ref(defaultEdit)

    const months = ref([
        'janvier',
        'février',
        'mars',
        'avril',
        'mai',
        'juin',
        'juillet',
        'août',
        'septembre',
        'octobre',
        'novembre',
        'décembre'
    ])

    const recipeName = ref(recipe.name)
    const recipeDescription = ref(recipe.description)
    const recipeIngredients = ref(recipe.ingredients)
    const recipeSteps = ref(recipe.steps)
    const recipeCategoryId = ref(recipe.category_id)
    const recipeImageURL = ref(recipe.imgUrl)

    const recipeDate = ref(new Date(recipe.creation_date))
    const inputImage = ref('')
    const recipeCategorieName = ref(categoriesName.value.find(item => item.id === recipe.category_id).name)


    const showValidateDeleteAlertBox = ref(false)

    const showLoader = ref(false)

    const error = ref('')

    //Emits

    const emit = defineEmits(['editCancel'])

    const handleEditCancel = () => {
        emit('editCancel');
    }

    //Methods

    const createOrEditRecipe = async () => {
        showLoader.value = true
        error.value = ''

        let isNewCategory = false
        let isNewImage = false

        // Create new category
        if (recipeCategoryId.value === "new") {
            let newName = newCategoryName()
            const { data: newCategory } = await useFetch('/api/post/category', {
                method: 'post',
                body: {
                    name: newName
                }
            })

            if (newCategory.value['error']) {
                error.value = newCategory.value['error']
                showLoader.value = false
                return
            }

            isNewCategory = true
            recipeCategoryId.value = newCategory.value.id
        }

        // Change/set image
        let imageFile = document.getElementById('image_upload').files[0]

        if (imageFile) {

            if (recipeImageURL.value) {
                const { data: deleteImageResponse } = await useFetch('/api/delete/image', {
                    method: 'delete',
                    headers: { 'Content-Type': 'application/json' },
                    body: {
                        "image": {
                            "url": recipeImageURL.value
                        }
                    }
                })

                if (deleteImageResponse.value['error']) {
                    if (isNewCategory) {
                        await useFetch(`/api/delete/category/${recipeCategoryId.value}`)
                    }
                    error.value = deleteImageResponse.value['error']
                    console.log('Erreur suppression image')
                    showLoader.value = false
                    return
                }
            }

            const base64Data = await toBase64(imageFile)
            const imageName = imageFile.name
            const imageContentType = imageName.split('.')[imageName.split('.').length - 1]
            
            const { data: url } = await useFetch('/api/post/image', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: {
                    "image": {
                        "img64" : base64Data,
                        "img_name" : imageName,
                        "content_type" : `image/${imageContentType}`
                    }
                }
            })
            
            if (url.value['error']) {
                if (isNewCategory) {
                    await useFetch(`/api/delete/category/${recipeCategoryId.value}`)
                }
                error.value = url.value['error']
                console.log('Erreur création image')
                showLoader.value = false
                return
            }

            isNewImage = true
            recipeImageURL.value = url.value[0].url
            console.log(recipeImageURL.value)
        }

        let recipeIDRoute = fetchMethod === 'put' ? `/${recipe.id}` : ''

        // change/set recipe
        const { data: recipeResponse } = await useFetch(`/api/${fetchMethod}/recipe${recipeIDRoute}`, {
            method: fetchMethod,
            body: {
                "recipe": {
                    "name": recipeName.value,
                    "description": recipeDescription.value,
                    "ingredients": recipeIngredients.value.join("\r\n"),
                    "steps": recipeSteps.value.join("\r\n"),
                    "imgUrl": recipeImageURL.value,
                    "category_id": recipeCategoryId.value
                }
            }
        })
            
        if (recipeResponse.value['error']) {
            if (isNewCategory) {
                await useFetch(`/api/delete/category/${recipeCategoryId.value}`)
            }
            if (isNewImage) {
                await useFetch('/api/delete/image', {
                    method: 'delete',
                    headers: { 'Content-Type': 'application/json' },
                    body: {
                        "image": {
                            "url": recipeImageURL.value
                        }
                    }
                })
            }
            error.value = recipeResponse.value['error']
            console.log('Erreur création recette')
            showLoader.value = false
            return
        }


        setTimeout(() => {
            if (fetchMethod === 'post') {
                navigateTo('/recettes/' + encodeURIComponent(recipeName.value.replace(/ /g, "-")))
            } else {
                window.location.reload(true)
            }
        }, 500)
        
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    })

    const recipeIngredientDelete = (id) => {
        recipeIngredients.value.splice(id, 1)
        setTimeout(autoResizeAll, 10)
    }

    const recipeStepDelete = (id) => {
        recipeSteps.value.splice(id, 1)
        setTimeout(autoResizeAll, 10)
    }

    const newCategoryName = () => {
        if (!categoriesName.value.some(name => name.name === 'Nouvelle Catégorie')) {
            return 'Nouvelle Catégorie'
        }

        let number = 1
        while (categoriesName.value.some(name => name.name === `Nouvelle Catégorie (${number})`)) {
            number++
        }
        return `Nouvelle Catégorie (${number})`
    }

    const autoResize = (e) => {
        e.target.style.height = "auto"
        e.target.style.height = e.target.scrollHeight + "px"
    }

    const autoResizeAll = () => {
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.style.height = "auto"
            textarea.style.height = textarea.scrollHeight + "px"
        })
    }

    const targetClick = (e) => {
        e.target.click()
    }

    const enableEdit = () => {
        edit.value = true
        setTimeout(autoResizeAll, 10)
    }

    const changeImage = (e) => {
        let file = e.target.files[0]

        if (file) {
            let reader = new FileReader()

            reader.onload = function (e) {
                inputImage.value = e.target.result
            }

            reader.readAsDataURL(file)    
        } 
    }

    const deleteRecipe = async () => {
        await useFetch(`/api/delete/recipe/${recipe.id}`)

        navigateTo('/')
    }

    //LifeCycle

    onMounted(() => {
        setTimeout(autoResizeAll, 100)

        window.addEventListener('resize', autoResizeAll)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', autoResizeAll)
    })

</script>

<style lang="sass" scoped>
    @import '~/assets/style/var.sass'
    .recipe
        max-width: 1500px
        margin: 0 auto
        padding-bottom: 100px
        textarea
            resize: none
            background-color: transparent
            border: none
        .action_button
            display: block
            background-color: transparent
            border: none
            padding: 0
        .delete
            color: $deleteColor
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
        .title
            display: flex
            flex-wrap: wrap
            gap: 10px
            padding: 30px 20px 35px
            margin: 0 auto
            width: fit-content
            max-width: 100%
            .text
                display: flex
                flex-direction: column
                margin-right: 50px
                max-width: 100%
                textarea
                    max-width: 700px
                    height: 46px
                    padding: 0
                    margin: 0
                    font-family: 'Roboto'
                    font-weight: 600
                    font-size: 40px
                    line-height: 44px
                    color: $textColor
                .date
                    font-family: 'Inter'
                    font-weight: 300
                    font-size: 18px
                    line-height: 22px
                    color: $textColor
            .actions
                display: flex
                gap: 25px
                .edit
                     color: $textColor
                .validate_edit
                     color: $textColor
                .cancel_edit
                     color: $textColor
        .recipe_content
            display: flex
            gap: 40px
            padding: 0 20px
            @media only screen and (max-width: 1000px)
                flex-direction: column
            .recipe_image_container
                flex-shrink: 0
                position: relative
                width: 50%
                max-height: 612px
                @media only screen and (max-width: 1000px)
                    width: 100%
                .recipe_image
                    display: block
                    object-fit: cover
                    width: 100%
                    height: 100%
                    max-height: 612px
                    border-radius: 10px
                .input_container
                    position: absolute
                    bottom: 10px
                    right: 10px
                    label
                        display: block
                        padding: 12px 15px
                        font-family: 'Roboto'
                        font-weight: 400
                        font-size: 24px
                        line-height: 24px
                        color: $textColor
                        background-color: $accentColor
                        border-radius: 5px
                    input
                        display: none
            .recipe_info
                width: 50%
                @media only screen and (max-width: 1000px)
                    width: 100%
                .recipe_description
                    width: 100%
                    height: auto
                    padding: 0 0 14px
                    margin-top: 0
                    font-family: 'Source Sans Pro'
                    font-weight: 400
                    font-size: 24px
                    line-height: 28px
                    text-align: justify
                    letter-spacing: 0.01em
                    color: $textColor
                section
                    padding-bottom: 14px
                    .add_button
                        display: block
                        padding: 7px 10px
                        margin-left: auto
                        font-family: 'Roboto'
                        font-weight: 400
                        font-size: 20px
                        line-height: 24px
                        color: $textColor
                        background-color: $accentColor
                        border-radius: 5px

                    h2
                        position: relative
                        width: fit-content
                        margin: 0
                        font-family: 'Roboto'
                        font-weight: 500
                        font-size: 26px
                        line-height: 35px
                        color: $textColor
                        &::after
                            content: ''
                            position: absolute
                            bottom: 0
                            left: 0
                            width: 100%
                            height: 2px
                            background-color: $accentColor
                    &.category
                        display: flex
                        gap: 6px
                        span, select
                            font-family: 'Roboto'
                            font-style: normal
                            font-weight: 400
                            font-size: 24px
                            line-height: 35px
                            color: $textColor
                        select
                            color: $textColor
                            background-color: transparent
                            border: none
                            option
                                color: #000
                    &.ingredients, &.steps
                        li
                            margin-bottom: 10px
                            font-family: 'Roboto'
                            font-weight: 400
                            font-size: 22px
                            line-height: 22px
                            text-align: justify
                            color: $textColor
                            &::marker
                                vertical-align: text-top
                            .li_flex_content
                                display: flex
                                gap: 20px
                                width: 100%
                                textarea
                                    width: 100%
                                    padding: 0
                                    font-family: 'Roboto'
                                    font-weight: 400
                                    font-size: 22px
                                    line-height: 28px
                                    text-align: justify
                                    color: $textColor
    .loader 
        position: absolute
        top: 0
        left: 0
        display: flex
        align-items: center
        justify-content: center
        width: 100%
        height: 100%
        backdrop-filter: blur(10px)
        .loader_img
            width: 100px
            height: 100px
</style>