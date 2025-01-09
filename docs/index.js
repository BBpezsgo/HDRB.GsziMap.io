/** @type {HTMLInputElement} */ // @ts-ignore
const classSearchInput = document.getElementById('myInput')

function showMainBuildingChilds() {
    document.getElementById('sideButtonGroupMainbuilding').style.height = '210px'
}

/**
 * @param {string} url
 */
function navigateIframe(url) {
    document.getElementsByTagName('iframe')[0].src = url
    resetButtons(url)
    document.getElementById('sidebar').classList.add('sideHidden')
}
window.navigateIframe = navigateIframe

/**
 * @param {string} buildingUrl
 * @param {string | undefined} classroomId
 */
function navigateToClassroom(buildingUrl, classroomId) {
    if (classroomId) {
        buildingUrl += '#' + classroomId
    }
    navigateIframe(buildingUrl)
}
window.navigateToClassroom = navigateToClassroom

document.addEventListener('DOMContentLoaded', () => {
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
        }
    }
})

/**
 * @param {string} url
 */
function resetButtons(url) {
    if (url.includes('buildingMain')) {
        document.getElementById('sideButtonGroupMainbuilding').style.height = '210px'
    } else {
        document.getElementById('sideButtonGroupMainbuilding').style.height = '0px'
    }
}
window.resetButtons = resetButtons

function search() {
    searchName(classSearchInput.value)
}
window.search = search

/**
 * @param {string} query
 */
function searchName(query) {
    query = query.trim().toUpperCase()

    const searchList = document.getElementById('SearchList')
    const searchListItems = searchList.getElementsByTagName('li')

    if (query.length == 0) {
        document.getElementById('SearchList').style.display = 'none'
        document.getElementById('sidebarButtons').classList.remove('sideButtonsHidden')
        resetButtons(document.getElementsByTagName('iframe')[0]?.contentWindow.location.href ?? '')
    } else {
        document.getElementById('SearchList').style.display = 'block'
        document.getElementById('sidebarButtons').classList.add('sideButtonsHidden')
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
                                <button onclick="window.navigateToClassroom('${item.building}', '${item.id}')">
                                    <span>${item.name}</span>
                                </button>
                            </div>
                    `.trim()
                    newElement.style.display = 'none'
                }
            })
            .catch(() => alert(`Nem sikerült letölteni a termek listáját. A keresés funkció nem fog működni!`))
    })
    .catch(() => alert(`Nem sikerült letölteni a termek listáját. A keresés funkció nem fog működni!`))

document.getElementsByTagName('iframe')[0]?.addEventListener('change', e => {
    resetButtons(document.getElementsByTagName('iframe')[0].contentWindow.location.href)
})
