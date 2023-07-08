export default defineEventHandler(async () => {

    const { APIUrl } = useRuntimeConfig()

    const recipes = await $fetch(`${APIUrl}/recipes`)

    return recipes

})