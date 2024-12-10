import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import adminsAndUser from './access/adminsAndUser'
import { checkRole } from './checkRole'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { loginAfterCreate } from './hooks/loginAfterCreate'

const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Používateľ',
    plural: 'Používatelia',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
    group:'Ľudia',
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Meno',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'user',
          value: 'user',
        },
        {
          label: 'sportCoach',
          value: 'sportCoach',
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      access: {
        read: () => true, // anyone can read a user's roles
        create: () => true, // Allow anyone to set a role during registration
        update: ({ req: { user } }) => user?.roles?.includes('admin') || false, // Only admins can update this field
      },
    },
  ],
  timestamps: true,
}

export default Users
