import type { CollectionConfig } from 'payload/types'
import { admins } from '../../access/admins'
import { checkRole } from '../Users/checkRole'
import { anyone } from '../../access/anyone'

const UAthlete: CollectionConfig = {
  slug: 'u_athlete',
  labels: {
    singular: 'Športovec',
    plural: 'Športovci',
  },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: anyone,
    create: admins,
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
      required: true,
      validate: () => true,
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
      name: 'birth_date',
      label: 'Dátum narodenia',
      type: 'date',
      required: true,
    },
    {
      name: 'gender',
      label: 'Pohlavie',
      type: 'select',
      options: [
        { label: 'Muž', value: 'muz' },
        { label: 'Žena', value: 'zena' },
      ],
    },
    {
      name: 'sport',
      label: 'Šport',
      type: 'relationship',
      relationTo: 'c_sport',
    },
    {
      name: 'club',
      label: 'Športový klub',
      type: 'relationship',
      relationTo: 'c_sport_club',
    },
  ],
}

export default UAthlete
