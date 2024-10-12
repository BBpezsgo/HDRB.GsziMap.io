function higlightClassroom(id) {
    for (const element of document.getElementsByClassName('selected')) {
        element.classList.remove('selected')
    }

    if (!id) { return }
    const selectedClassroom = document.getElementById(id)
    if (!selectedClassroom) {
        console.warn(`Element #${id} not found`)
        return
    }

    selectedClassroom.classList.add('selected')
}

window.addEventListener('DOMContentLoaded', e => {
    const hash = window.location.hash.replace('#', '')
    higlightClassroom(hash)
})

window.addEventListener('hashchange', e => {
    const hash = window.location.hash.replace('#', '')
    higlightClassroom(hash)
})
