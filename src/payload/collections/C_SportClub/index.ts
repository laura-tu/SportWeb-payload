import type { CollectionConfig } from 'payload/types'
import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import { tCollection } from '../../utils/translations'

const translate = tCollection('c_sport_club')

const CSportClub: CollectionConfig = {
  slug: 'c_sport_club',
  labels: {
    singular: translate('labels.singular'),
    plural: translate('labels.plural'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sport', 'short_name'],
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
      name: 'short_name',
      label: translate('fields.short_name'),
      type: 'text',
    },
    {
      name: 'sport',
      label: translate('fields.sport'),
      type: 'relationship',
      relationTo: 'c_sport',
      required: true,
    },
  ],
}
export default CSportClub
