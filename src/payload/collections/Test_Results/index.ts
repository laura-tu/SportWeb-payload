import { CollectionConfig } from 'payload/types'
import { tCollection } from '../../utils/translations'
import ChartComponent from '../../components/ChartComponent'

const translate = tCollection('test_results')

const TestResults: CollectionConfig = {
  slug: 'test_results',
  labels: {
    singular: translate('labels.singular'),
    plural: translate('labels.plural'),
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
              name: 'coach',
              type: 'relationship',
              relationTo: 'u_coach',
              label: translate('fields.coach'),
              required: false,
            },
            {
              name: 'testType',
              type: 'text',
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
            },
            {
              name: 'date',
              type: 'date',
              label: translate('fields.date'),
              required: true,
            },
            {
              name: 'notes',
              type: 'textarea',
              label: translate('fields.notes'),
            },
          ],
        },
        {
          label: translate('tabs.graph'),
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
