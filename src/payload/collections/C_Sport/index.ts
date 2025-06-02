import type { CollectionConfig } from 'payload/types'
import { admins } from '../../access/admins'
import { checkRole } from '../Users/checkRole'
import { anyone } from '../../access/anyone'
import { tCollection } from '../../utils/translations'

const translate = tCollection('c_sport')

const CSport: CollectionConfig = {
  slug: 'c_sport',
  labels: {
    singular: translate('labels.singular'),
    plural: translate('labels.plural'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'info'],
    group: 'Číselníky',
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      label: translate('fields.name'),
      type: 'text',
      required: true,
    },
    {
      name: 'info',
      label: translate('fields.info'),
      type: 'textarea',
    },
  ],
}
export default CSport
