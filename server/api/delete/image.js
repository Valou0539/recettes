export default defineEventHandler(async (event) => {

    const { APIPassword, APIUrl } = useRuntimeConfig()

    const { token } = await $fetch(`${APIUrl}/token/${APIPassword}`)

    const { image } = await readBody(event)

    const response = await $fetch(`${APIUrl}/image`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: {
            "image": image
        }
    })

    return response
})