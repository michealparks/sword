import * as THREE from 'three'
import { scene } from 'three-kit'

const playerGeo = new THREE.BoxGeometry(2, 2, 2)
const playerMat = new THREE.MeshStandardMaterial({ color: 'lightblue' })

export const player = new THREE.Mesh(playerGeo, playerMat)

player.name = 'player'
scene.add(player)
player.position.set(0, 1, 0)
