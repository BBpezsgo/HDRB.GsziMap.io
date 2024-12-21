import * as THREE from 'three'
import { OBJLoader } from './OBJLoader.js'

const canvas = document.getElementsByTagName('canvas').item(0)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setAnimationLoop(animate)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x222222)
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)

scene.add(new THREE.AmbientLight(0x666666))

const directionalLight = new THREE.DirectionalLight(0xffffff)
scene.add(directionalLight)

directionalLight.position.x = 30
directionalLight.position.y = 30
directionalLight.lookAt(0, 0, 0)

const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.FrontSide,
    transparent: false,
    opacity: 1,
})

const selectionMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
})

const boom = new THREE.Group()
boom.add(camera)
scene.add(boom)

/** @type {null | THREE.Vector3} */
let target = null

const loader = new OBJLoader()

function lerp(from, to, v) {
    return from + (to - from) * v
}

function moveTowards(from, to, maxDelta) {
    const delta = Math.abs(to - from)
    const sign = Math.sign(to - from)
    const clampedDelta = Math.min(delta, maxDelta) * sign
    return from + clampedDelta
}

/** @type {null | THREE.Group} */
let o = null

loader.load('./model.obj', function(/** @type {THREE.Group} */ _o) {
    o = _o
    o.remove(o.children.find(v => v.name === 'ground'))
    o.traverse((mesh) => {
        // @ts-ignore
        mesh.material = material
        mesh.visible = mesh.name === 'school_model' || mesh.name === ''
    })
    scene.add(o)
}, undefined, console.error)

/** @type {THREE.Mesh} */
let selectedMesh = null

/**
 * @param {string} name
 */
function selectRoom(name) {
    if (selectedMesh) {
        selectedMesh.material = material
        selectedMesh.renderOrder = 0
        selectedMesh.visible = false
    }
    // @ts-ignore
    selectedMesh = name ? o.children.find(v => v.name === name) : null
    if (!selectedMesh) {
        target = null
        return
    }

    selectedMesh.geometry.computeBoundingBox()
    target = new THREE.Vector3()
    selectedMesh.geometry.boundingBox.getCenter(target)

    selectedMesh.renderOrder = 100
    selectedMesh.material = selectionMaterial
    selectedMesh.visible = true
}

function fadeMaterial(opacity) {
    material.opacity = lerp(material.opacity, opacity, 0.2)
    if (material.opacity < 0.99) {
        material.transparent = true
        material.side = THREE.DoubleSide
        material.depthWrite = false
        material.depthTest = false
    } else {
        material.opacity = 1
        material.transparent = false
        material.side = THREE.FrontSide
        material.depthWrite = true
        material.depthTest = true
    }
}

boom.position.x = 0
boom.position.y = 0
boom.position.z = 4
camera.position.x = 0
camera.position.y = 7
camera.position.z = 7
camera.lookAt(0, 0, 0)

function animate() {
    if (!target) {
        boom.rotation.y += 0.01
        boom.position.x = lerp(boom.position.x, 0, 0.01)
        boom.position.y = lerp(boom.position.y, 0, 0.01)
        boom.position.z = lerp(boom.position.z, 4, 0.01)

        camera.position.x = lerp(camera.position.x, 0, 0.01)
        camera.position.y = lerp(camera.position.y, 7, 0.01)
        camera.position.z = lerp(camera.position.z, 7, 0.01)

        const m = new THREE.Matrix4().lookAt(camera.position, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0))
        const q = new THREE.Quaternion().setFromRotationMatrix(m)
        camera.quaternion.rotateTowards(q, 0.1)

        fadeMaterial(1)
    } else {
        boom.rotation.y += 0.01
        boom.position.x = lerp(boom.position.x, target.x, 0.05)
        boom.position.y = lerp(boom.position.y, target.y, 0.05)
        boom.position.z = lerp(boom.position.z, target.z, 0.05)

        camera.position.x = lerp(camera.position.x, 3, 0.03)
        camera.position.y = lerp(camera.position.y, 1.5, 0.03)
        camera.position.z = lerp(camera.position.z, 0, 0.03)

        const m = new THREE.Matrix4().lookAt(camera.position, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0))
        const q = new THREE.Quaternion().setFromRotationMatrix(m)
        camera.quaternion.rotateTowards(q, 0.1)

        fadeMaterial(0.5)
    }
    renderer.render(scene, camera)
}

function tryResizeCanvas() {
    const width = renderer.domElement.clientWidth
    const height = renderer.domElement.clientHeight

    if (width === renderer.domElement.width &&
        height === renderer.domElement.height) { return }

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
}

window.addEventListener('DOMContentLoaded', () => {
    tryResizeCanvas()
    setInterval(() => tryResizeCanvas(), 500)
})

window['selectRoom'] = selectRoom
