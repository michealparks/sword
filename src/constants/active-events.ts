/* eslint-disable no-shadow */
/**
 * Flags indicating what events are enabled for colliders.
 */
export const enum ActiveEvents {
  // Enable collision events.
  COLLISION_EVENTS,
  // Enable collision events with contact data.
  CONTACT_EVENTS,
  // Enable contact force events.
  CONTACT_FORCE_EVENTS
}
