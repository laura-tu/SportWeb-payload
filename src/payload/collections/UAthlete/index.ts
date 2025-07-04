import type { CollectionConfig } from 'payload/types'
import { admins } from '../../access/admins'
import { checkRole } from '../Users/checkRole'
import { anyone } from '../../access/anyone'
import { tCollection } from '../../utils/translations'

const translate = tCollection('u_athlete')

const UAthlete: CollectionConfig = {
  slug: 'u_athlete',
  labels: {
    singular: translate('labels.singular'),
    plural: translate('labels.plural'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['user', 'sport', 'club'],
    group: 'Ľudia',
  },
  access: {
    read: ({ req }) =>
      checkRole(['sportCoach'], req.user) || checkRole(['user'], req.user) || admins({ req }), //just users
    create: anyone,
    update: ({ req }) => checkRole(['user'], req.user) || admins({ req }), //because of FE
    delete: admins,
  },
  fields: [
    {
      name: 'user',
      label: translate('fields.user'),
      type: 'relationship',
      relationTo: 'users',
      //required: true,
      //validate: () => true,
      admin: {
        position: 'sidebar',
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
      label: translate('fields.name'),
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      /*hooks: {
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
      },*/
    },
    {
      name: 'birth_date',
      label: translate('fields.birth_date'),
      type: 'date',
      required: true,
    },
    {
      name: 'gender',
      label: translate('fields.gender'),
      type: 'select',
      options: [
        { label: translate('values.muz'), value: 'muz' },
        { label: translate('values.zena'), value: 'zena' },
      ],
    },
    {
      name: 'sport',
      label: translate('fields.sport'),
      type: 'relationship',
      relationTo: 'c_sport',
      required: true,
      hasMany: true,
    },
    {
      name: 'club',
      label: translate('fields.club'),
      type: 'relationship',
      relationTo: 'c_sport_club',
    },
  ],
}

export default UAthlete
