/** @type {HTMLInputElement} */ // @ts-ignore
const classSearchInput = document.getElementById('myInput')

/**
 * @param {string} url
 */
function navigateIframe(url) {
    const room = url.includes('#') ? url.split('#')[1] : null
    window['selectRoom'](room)
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
        window['selectRoom']('')
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
