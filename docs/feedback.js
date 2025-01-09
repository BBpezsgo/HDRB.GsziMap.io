/** @type {HTMLFormElement} */ // @ts-ignore
const feedbackForm = document.getElementById('feedback-form')

/** @type {HTMLElement} */ // @ts-ignore
const feedbackDoneContainer = document.getElementById('feedback-done-container')

/** @type {HTMLElement} */ // @ts-ignore
const feedbackFormContainer = document.getElementById('feedback-form-container')

/** @type {HTMLInputElement} */ // @ts-ignore
const feedbackDescription = document.getElementById('feedback-form-desc')

/** @type {HTMLElement} */ // @ts-ignore
const feedbackSpinner = document.getElementById('feedback-upload-spinner')

feedbackForm.addEventListener('submit', e => {
    e.preventDefault()
    feedbackDoneContainer.style.display = 'block'
    feedbackFormContainer.style.display = 'none'
})

function sendFeedback() {
    const title = 'Visszajelzés'
    const desc = feedbackDescription.value

    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        const state = {
            0: 'UNSENT',
            1: 'OPENED',
            2: 'HEADERS_RECEIVED',
            3: 'LOADING',
            4: 'DONE'
        }
        //stateElement.innerText = 'readyState:' + state[xhr.readyState] + ' statusText: ' + xhr.statusText + ' status: ' + xhr.status
        if (xhr.readyState == 4) {
            feedbackSpinner.style.display = 'none'
        } else {
            feedbackSpinner.style.display = 'block'
        }
    }
    xhr.open('POST', 'https://api.trello.com/1/cards/?idList=631c1b304028e8138251b52e&token=84de6f5cbc9e3fb5df77596358352cc839e1dea58d8dbb0857919f39b6143acf&key=16160910964e82904e57646c84c9fb69&name=' + title + '&desc=' + desc, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send()
}
window.sendFeedback = sendFeedback

function resetFeedback() {
    feedbackDoneContainer.style.display = 'none'
    feedbackFormContainer.style.display = 'block'
    feedbackDescription.value = ''
}
window.resetFeedback = resetFeedback
