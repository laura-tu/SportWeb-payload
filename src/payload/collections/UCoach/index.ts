import type { CollectionConfig } from 'payload/types'
import { admins } from '../../access/admins'
import { checkRole } from '../Users/checkRole'
import { anyone } from '../../access/anyone'
import { tCollection } from '../../utils/translations'

const translate = tCollection('u_coach')

const UCoach: CollectionConfig = {
  slug: 'u_coach',
  labels: {
    singular: translate('labels.singular'),
    plural: translate('labels.plural'),
  },
  admin: {
    useAsTitle: 'user',
    defaultColumns: ['user', 'sport', 'club'],
    group: 'Ľudia',
  },
  access: {
    read: anyone,
    create: anyone,
    //update: ({ req: { user } }) => checkRole(['sportCoach'], user),
    update: anyone,
    delete: admins,
   // admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'user',
      label: translate('fields.user'),
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        /* readOnly: true,*/
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
        // readOnly: true, // Make it read-only if it should be auto-filled
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
    {
      name: 'athletes',
      label: translate('fields.athletes'),
      type: 'relationship',
      relationTo: 'u_athlete',
      hasMany: true,
    },
  ],
}

export default UCoach
