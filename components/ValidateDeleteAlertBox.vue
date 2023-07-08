<template>
    <div class="blurred_background">
        <div class="alert_box">
            <p>{{ description }}</p>
            <div class="buttons_container">
                <button class="cancel" @click="handleCancel">Annuler</button>
                <button class="validate" @click="handleValidate">Valider</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    const alertInfo = defineProps({
        description: String
    })

    const emit = defineEmits(['cancel', 'validate'])

    const handleCancel = () => {
        emit('cancel');
    }

    const handleValidate = () => {
        emit('validate');
    }
</script>

<style lang="sass" scoped>
    @import '~/assets/style/var.sass'

    .blurred_background
        position: absolute
        top: 0
        left: 0
        display: flex
        justify-content: center
        align-items: center
        width: 100%
        height: 100%
        z-index: 100
        backdrop-filter: blur(7px)
        .alert_box
            width: 90%
            max-width: 660px
            padding: 30px
            background-color: $mainColor
            border: 5px solid $secondaryColor
            border-radius: 10px
            font-family: 'Roboto'
            p
                font-weight: 600
                font-size: 28px
                color: $textColor
            .buttons_container
                display: flex
                align-items: center
                gap: 10px
                width: fit-content
                margin-left: auto
                .cancel
                    font-size: 20px
                    color: $textColor
                    background-color: transparent
                    border: none
                    &:hover
                        text-decoration: underline
                .validate
                    padding: 5px 7px
                    font-weight: 600
                    font-size: 24px
                    color: $deleteColor
                    background-color: transparent
                    border: 3px solid $deleteColor
                    border-radius: 5px
</style>    