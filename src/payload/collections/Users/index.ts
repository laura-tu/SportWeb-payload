import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import adminsAndUser from './access/adminsAndUser'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { forgotPassword, forgotPasswordSubject } from './hooks/email'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { tCollection } from '../../utils/translations'
//import { verify, verifySubject, checkVerification, sendVerifiedEmail } from './hooks/email'
//import { checkUser } from '../../access/checkUser'
//import { Permission } from '../../access/checkPermission'
//import { updateOwnOrAdmin } from '../../access/updateOwnOrAdmin'

const translate = tCollection('users')

const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: translate('labels.singular'),
    plural: translate('labels.plural'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
    group: 'Ľudia',
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
  },
  hooks: {
    afterChange: [loginAfterCreate],
  },
  auth: {
    /*verify: {
      generateEmailHTML: verify,
      generateEmailSubject: verifySubject,
    },*/
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
    {
      name: 'avatar',
      label: 'Profilová fotka',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Nahraj obrázok, ktorý sa zobrazí ako profilová fotka.',
      },
      /*hooks: {
        beforeValidate: [
          ({ data }) => {
            if (!data.avatar) {
              data.avatar = '683ae5b3fec5504d68888ff7'
            }
            return data
          },
        ],
      },*/
    },
  ],
  timestamps: true,
}

export default Users
