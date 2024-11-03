import type { CollectionConfig } from 'payload/types'
import { admins } from '../../access/admins'
import { checkRole } from '../Users/checkRole'
import { anyone } from '../../access/anyone'

const UCoach: CollectionConfig = {
  slug: 'u_coach',
  labels: {
    singular: 'Tréner',
    plural: 'Tréneri',
  },
  admin: {
    useAsTitle: 'user',
    defaultColumns: ['user', 'sport', 'club'],
  },
  access: {
    read: anyone,
    create: anyone,
    update: admins,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'user',
      label: 'Užívateľ',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ req, operation }) => {
            if (operation === 'create') {
              if (req.user) {
                // undefined when seeding
                return req.user.id
              }
            }
          },
        ],
      },
    },
    {
      name: 'sport',
      label: 'Šport',
      type: 'relationship',
      relationTo: 'c_sport',
      required: true,
      hasMany: true,
    },
    {
      name: 'club',
      label: 'Športový klub',
      type: 'relationship',
      relationTo: 'c_sport_club',
    },
    {
      name: 'athlete',
      label: 'Športovci vedený trénerom',
      type: 'relationship',
      relationTo: 'u_athlete',
      hasMany: true,
    },
  ],
}

export default UCoach
