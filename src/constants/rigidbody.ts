/* eslint-disable no-shadow */
export const enum RigidBodyType {
  // A RigidBodyType::Dynamic body can be affected by all external forces.
  Dynamic,

  // A RigidBodyType::Fixed body cannot be affected by external forces.
  Fixed,

  /*
   * A RigidBodyType::KinematicPositionBased body cannot be affected
   * by any external forces but can be controlled by the user at the
   * position level while keeping realistic one-way interaction with dynamic bodies.
   *
   * One-way interaction means that a kinematic body can push a dynamic body,
   * but a kinematic body cannot be pushed by anything. In other words,
   * the trajectory of a kinematic body can only be modified by the user
   * and is independent from any contact or joint it is involved in.
   */
  KinematicPositionBased,

  /*
   * A RigidBodyType::KinematicVelocityBased body cannot be affected by
   * any external forces but can be controlled by the user at the velocity
   * level while keeping realistic one-way interaction with dynamic bodies.
   *
   * One-way interaction means that a kinematic body can push a dynamic body,
   * but a kinematic body cannot be pushed by anything. In other words,
   * the trajectory of a kinematic body can only be modified by the user and
   * is independent from any contact or joint it is involved in.
   */
  KinematicVelocityBased,

  // A RigidBodyType::Sensor is a fixed body with sensor flag set to true.
  Sensor,
}
