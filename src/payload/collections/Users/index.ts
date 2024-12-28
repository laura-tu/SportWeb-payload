import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import adminsAndUser from './access/adminsAndUser'
import { checkRole } from './checkRole'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { forgotPassword, forgotPasswordSubject } from './hooks/email'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { tCollection } from '../../utils/translations'

const translate = tCollection('users')

const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: translate('labels.singular'),
    plural: translate('labels.plural'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
    group: 'Ľudia',
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    afterChange: [loginAfterCreate],
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: forgotPassword,
      generateEmailSubject: forgotPasswordSubject,
    },
    cookies: {
      secure: true,
      sameSite: 'none',
    },
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: translate('fields.email'),
    },
    {
      name: 'name',
      type: 'text',
      label: translate('fields.name'),
    },
    {
      name: 'roles',
      label: translate('fields.roles'),
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        {
          label: translate('values.admin'),
          value: 'admin',
        },
        {
          label: translate('values.user'),
          value: 'user',
        },
        {
          label: translate('values.sportCoach'),
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
    /*{
      name: 'hashedCode', //CRC32 hash of the user's example password
      type: 'text',
      label: translate('fields.hashedCode'),
      required: false,
      unique: true,
      access: {
        read: () => true, // anyone can read a user's roles
        create: ({ req: { user } }) => user?.roles?.includes('admin') || false, // Only admins can create this field
        update: ({ req: { user } }) => user?.roles?.includes('admin') || false, // Only admins can update this field
      },
      hooks: {
        beforeChange: [
          ({ data, originalDoc }) => {
            if (data.email && !originalDoc.email) {
              // If email is being added for the first time, invalidate hashedCode
              data.hashedCode = null
              data.status = 'active' // Transition user to active
            }
            return data
          },
        ],
      },
    },*/
  ],
  timestamps: true,
}

export default Users
