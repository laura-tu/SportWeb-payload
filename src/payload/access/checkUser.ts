import type { AccessResult } from 'payload/config'
import type { AccessArgs, Where } from 'payload/types'
import type { User } from '../payload-types'
import { Permission } from './checkPermission'

export const checkUser = (
  { req: { user } }: AccessArgs<unknown, User>,
  permission: Permission,
  field = 'id_user',
): AccessResult => {
  const filters: Where[] = []
  if (user) {
    filters.push({
      [field]: {
        equals: user.id,
      },
    })
  }

  if (permission === Permission.READ) {
    filters.push({
      [field]: {
        exists: false,
      },
    })
  }

  return {
    or: filters,
  }
}
