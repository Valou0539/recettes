export default defineEventHandler(async () => {

    const { APIPassword, APIUrl } = useRuntimeConfig()

    const { token } = await $fetch(`${APIUrl}/token/${APIPassword}`)

    if (!token) {
        return undefined
    }

    const categories = await $fetch(`${APIUrl}/categories`)

    return categories

})