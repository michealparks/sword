import type RAPIER from '@dimforge/rapier3d-compat'

export const bodies: RAPIER.RigidBody[] = []
export const bodymap = new Map<number, RAPIER.RigidBody>()
export const collidermap = new Map<number, RAPIER.Collider>()
export const reportContact = new Map<number, boolean>()
export const handlemap = new Map<number, number>()
export const disabledmap = new Map<number, RAPIER.RigidBody>()
