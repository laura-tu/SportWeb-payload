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
    useAsTitle: 'user',
    defaultColumns: ['user', 'sport', 'club'],
    group:'Ľudia',
  },
  access: {
    read: anyone,
    create: anyone,
    update: ({ req: { user } }) => checkRole(['user'], user),
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'user',
      label: 'Užívateľ',
      type: 'relationship',
      relationTo: 'users',
      //required: true,
      //validate: () => true,
      admin: {
        position: 'sidebar',
        //readOnly: true,
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
      name: 'name',
      label: 'Meno',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true, // Make it read-only if it should be auto-filled
      },
      hooks: {
        beforeChange: [
          async ({ data, req, operation }) => {
            if (operation === 'create' || operation === 'update') {
              if (data.user) {
                const userId = data.user // ID of the related user
                const user = await req.payload.findByID({
                  collection: 'users',
                  id: userId,
                })
                if (user?.name) {
                  return user.name
                }
              }
              return ''
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
      required: true,
      hasMany: true,
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
