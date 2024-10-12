
//#region Feedback

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
    xhr.onreadystatechange = function () {
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

function resetFeedback() {
    feedbackDoneContainer.style.display = 'none'
    feedbackFormContainer.style.display = 'block'
    feedbackDescription.value = ''
}

//#endregion

//#region Modals

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

//#endregion

/** @type {HTMLInputElement} */ // @ts-ignore
const classSearchInput = document.getElementById('myInput')

function showMainBuildingChilds() {
    document.getElementById('sideButtonGroupMainbuilding').style.height = '210px'
}

function navigateIframe(url) {
    document.getElementsByTagName('iframe')[0].src = url
    resetButtons(url)
    document.getElementById('sidebar').classList.add('sideHidden')
}

/**
 * @param {string} buildingUrl
 * @param {string | undefined} classroomId
 */
function navigateToClassroom(buildingUrl, classroomId) {
    if (classroomId) {
        buildingUrl += '#' + classroomId
    }
    navigateIframe(buildingUrl)
    searchName('')
}

function onLoad() {
    const url = window.location.href
    if (url.includes('#')) {
        const hash = url.split('#')[1]
        if (hash === 'buildingMain') {
            navigateIframe('buildings/buildingMain.html')
        } else if (hash === 'buildingB') {
            navigateIframe('buildings/buildingB.html')
        } else if (hash === 'buildingC') {
            navigateIframe('buildings/buildingC.html')
        } else if (hash === 'buildingD') {
            navigateIframe('buildings/buildingD.html')
        } else if (hash === 'buildingE') {
            navigateIframe('buildings/buildingE.html')
        } else if (hash === 'buildingMain.0a') {
            navigateIframe('buildings/buildingMain0a.html')
        } else if (hash === 'buildingMain.0b') {
            navigateIframe('buildings/buildingMain0b.html')
        } else if (hash === 'buildingMain.1') {
            navigateIframe('buildings/buildingMain1.html')
        } else if (hash === 'buildingMain.2') {
            navigateIframe('buildings/buildingMain2.html')
        } else {
            //Suburl not found
        }
    } else {
        //Simple navigate
    }


    const ul = document.getElementById('SearchList')
    const li = ul.getElementsByTagName('li')
    for (let i = 0; i < li.length; i++) {
        li[i].style.display = 'none'
    }
}

function resetButtons(url) {
    if (url.includes('buildingMain')) {
        document.getElementById('sideButtonGroupMainbuilding').style.height = '210px'
    } else {
        document.getElementById('sideButtonGroupMainbuilding').style.height = '0px'
    }
}

function search() {
    searchName(classSearchInput.value)
}

/**
 * @param {string} query
 */
function searchName(query) {
    query = query.trim().toUpperCase()

    const searchList = document.getElementById('SearchList')
    const searchListItems = searchList.getElementsByTagName('li')

    if (query.length == 0) {
        document.getElementById('SearchList').style.display = 'none'
    } else {
        document.getElementById('SearchList').style.display = 'block'
    }

    for (const searchItem of searchListItems) {
        const itemValue = searchItem.textContent || searchItem.innerText
        if (itemValue.toUpperCase().indexOf(query) > -1) {
            searchItem.style.display = ''
        } else {
            searchItem.style.display = 'none'
        }
    }
}

fetch('./searchlist.json')
    .then(res => {
        res.json()
            .then(items => {
                const searchList = document.getElementById('SearchList')
                searchList.innerHTML = ''
                for (const item of items) {
                    const newElement = searchList.appendChild(document.createElement('li'))
                    newElement.innerHTML = `
                            <div class="sideListButton">
                                <button onclick="navigateToClassroom('${item.building}', '${item.id}')">
                                    <span>${item.name}</span>
                                </button>
                            </div>
                    `.trim()
                }
            })
            .catch(() => alert(`Nem sikerült letölteni a termek listáját. A keresés funkció nem fog működni!`))
    })
    .catch(() => alert(`Nem sikerült letölteni a termek listáját. A keresés funkció nem fog működni!`))

document.getElementsByTagName('iframe')[0].addEventListener('change', e => {
    resetButtons(document.getElementsByTagName('iframe')[0].contentWindow.location.href)
})
