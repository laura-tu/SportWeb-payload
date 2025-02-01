import type { CollectionConfig } from 'payload/types'
import { admins } from '../access/admins'
import { checkRole } from './Users/checkRole'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: admins,
    // only users with the "admin" role will be able to see or manage this collection in the Payload admin dashboard
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}

export default Categories
