import type RAPIER from '@dimforge/rapier3d-compat'

export const bodies = new Set<RAPIER.RigidBody>()
export const bodymap = new Map<number, RAPIER.RigidBody>()
