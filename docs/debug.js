function Debug_Init() {
    const mapimage = document.getElementById('mapimage')
    mapimage.addEventListener('mousedown', (e) => {
        console.log(e.offsetX + ' ' + e.offsetY)
    })
}

Debug_Init()