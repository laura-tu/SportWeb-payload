import type { CollectionConfig } from 'payload/types'
import { admins } from '../../access/admins'
import { checkRole} from '../Users/checkRole'
import { anyone } from '../../access/anyone'

const CSportClub: CollectionConfig = {
    slug: 'c_sport_club',
    labels: {
        singular: 'Číselník športových klubov',
        plural: 'Číselníky športových klubov',
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
      fields:[
        {
            name: 'name',
            label: 'Názov športového klubu',
            type: 'text',
            required: true,
        },
        {
            name: 'short_name',
            label: 'Skratka športového klubu',
            type: 'text',
        },
        {
            name: 'sport',
            label: 'Šport',
            type: 'relationship',
            relationTo: 'c_sport',
            required: true,
        }
    ]
}
export default CSportClub