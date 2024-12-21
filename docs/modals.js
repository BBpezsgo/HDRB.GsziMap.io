/** @type {HTMLElement} */ // @ts-ignore
const modalCreators = document.getElementById('modal-creators')

/** @type {HTMLElement} */ // @ts-ignore
const modalFeedback = document.getElementById('modal-feedback')

window.addEventListener('click', e => {
    if (e.target == modalCreators) {
        modalCreators.style.display = 'none'
    } else if (e.target == modalFeedback) {
        resetFeedback()
        modalFeedback.style.display = 'none'
    }
})
