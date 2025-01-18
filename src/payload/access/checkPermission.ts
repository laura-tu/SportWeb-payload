/* eslint-disable @typescript-eslint/prefer-literal-enum-member */

import type { User } from '../payload-types'

export enum Permission {
  NONE = 0,
  READ = 1 << 0,
  CREATE = 1 << 1,
  UPDATE = 1 << 2,
  DELETE = 1 << 3,
  WRITE = CREATE | UPDATE | DELETE,
  READ_WRITE = READ | WRITE,
  ADMIN = 1 << 10,
}
