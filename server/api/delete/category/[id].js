export default defineEventHandler(async (event) => {

    const { APIPassword, APIUrl } = useRuntimeConfig()

    const { token } = await $fetch(`${APIUrl}/token/${APIPassword}`)

    const { id } = event.context.params

    const response = await $fetch(`${APIUrl}/category/${id}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-Token': token,
        }
    })

    return response
})