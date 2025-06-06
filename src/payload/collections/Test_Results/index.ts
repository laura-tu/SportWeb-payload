import { CollectionConfig } from 'payload/types'
import { tCollection } from '../../utils/translations'
import ChartComponent from '../../components/ChartComponent'
import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import { dateDisplayFormat } from '../../constants'

const translate = tCollection('test_results')

const TestResults: CollectionConfig = {
  slug: 'test_results',
  labels: {
    singular: translate('labels.singular'),
    plural: translate('labels.plural'),
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  admin: {
    useAsTitle: 'testType',
    defaultColumns: ['date', 'athlete', 'testType'],
  },
  fields: [
    {
      type: 'tabs',
      admin: {
        className: 'custom-tabs',
      },
      tabs: [
        {
          label: translate('tabs.data'),
          fields: [
            {
              name: 'athlete',
              type: 'relationship',
              relationTo: 'u_athlete',
              required: true,
              label: translate('fields.athlete'),
            },
            {
              name: 'testType',
              type: 'relationship',
              relationTo: 'c_sport_test',
              label: translate('fields.testType'),
              required: true,
            },
            {
              name: 'resultData',
              type: 'upload',
              label: translate('fields.resultData'), // This will store the Excel/Text file
              required: true,
              relationTo: 'media',
              admin: {
                description: translate('fields.resultDescription'),
              },
              filterOptions: {
                mimeType: {
                  in: [
                    'application/pdf',
                    'text/csv',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  ],
                },
              },
            },
            {
              name: 'date',
              type: 'date',
              label: translate('fields.date'),
              required: true,
              defaultValue: new Date().toISOString(),
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: dateDisplayFormat.sk,
                },
              },
            },
            {
              name: 'notes',
              type: 'textarea',
              label: translate('fields.notes'),
            },
          ],
        },
        {
          label: translate('tabs.table'),
          fields: [
            {
              name: 'chart',
              type: 'ui', // Use the 'ui' field type to embed custom React components
              admin: {
                components: {
                  Field: ChartComponent, // Reference your custom Chart.js component here
                },
              },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}

export default TestResults
