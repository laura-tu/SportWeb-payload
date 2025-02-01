import type { CollectionConfig } from 'payload/types'
import { admins } from '../../access/admins'
import { checkRole } from '../Users/checkRole'
import { anyone } from '../../access/anyone'
import { tCollection } from '../../utils/translations'

const translate = tCollection('c_sport_test')

const CSportTest: CollectionConfig = {
  slug: 'c_sport_test',
  labels: {
    singular: translate('labels.singular'),
    plural: translate('labels.plural'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'short_name'],
    group: 'Číselníky',
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
    //admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'name',
      label: translate('fields.name'),
      type: 'text',
      required: true,
    },
    {
      name: 'short_name',
      label: translate('fields.short_name'),
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: translate('fields.description'),
      type: 'textarea',
    },
  ],
}

export default CSportTest
