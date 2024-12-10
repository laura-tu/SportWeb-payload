import type { CollectionConfig } from 'payload/types'
import { admins } from '../../access/admins'
import { checkRole } from '../Users/checkRole'
import { anyone } from '../../access/anyone'

const CSport: CollectionConfig = {
  slug: 'c_sport',
  labels: {
    singular: 'Číselník športov',
    plural: 'Číselníky športov',
  },
  admin: {
    useAsTitle: 'name',
    group:'Číselníky',
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
      name: 'name',
      label: 'Názov športu',
      type: 'text',
      required: true,
    },
    {
      name: 'info',
      label: 'Popis',
      type: 'textarea',
    },
  ],
}
export default CSport
