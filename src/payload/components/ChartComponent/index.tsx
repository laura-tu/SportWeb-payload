import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import ExcelCsvParser from '../ExcelParser'
import { useTestResultsQuery } from '../../api/hooks/test-results'
import type { Media } from '../../payload-types'
import { useDocumentInfo } from 'payload/dist/admin/components/utilities/DocumentInfo'

const ChartComponent: React.FC = () => {
  const [parsedData, setParsedData] = useState<any[]>([])
  const doc = useDocumentInfo()
  const { data: testResults } = useTestResultsQuery({
    limit: 1,
    where: {
      id: {
        equals: doc.id,
      },
    },
  })

  const fileUrl = (testResults?.docs[0].resultData as Media)?.url

  const handleParse = useMemo(
    () => (data: any[]) => {
      setParsedData(data)
    },
    [], // Dependencies array, ensures the function is memoized and doesn't recreate on every render
  )

  return (
    <div>
      {fileUrl && <ExcelCsvParser fileUrl={fileUrl} onParse={handleParse} />}

      {/* Render the chart only if there is parsed data */}
      {parsedData.length > 0 ? (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={parsedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  )
}

export default ChartComponent
