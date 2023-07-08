export default defineEventHandler(async (event) => {

    const { APIPassword, APIUrl } = useRuntimeConfig()

    const { token } = await $fetch(`${APIUrl}/token/${APIPassword}`)

    const { recipe } = await readBody(event)

    const response = await $fetch(`${APIUrl}/recipe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
        },
        body: {
            "recipe": recipe
        }
    })

    return response
})