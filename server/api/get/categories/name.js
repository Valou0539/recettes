export default defineEventHandler(async () => {

    const { APIUrl } = useRuntimeConfig()

    const categoriesName = await $fetch(`${APIUrl}/categoriesNames`)

    return categoriesName

})