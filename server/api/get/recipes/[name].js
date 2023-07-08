export default defineEventHandler(async (event) => {

    const { APIUrl } = useRuntimeConfig()
    const { name } = event.context.params

    const recipes = await $fetch(`${APIUrl}/recipe/${name}`)

    return recipes[0]

})