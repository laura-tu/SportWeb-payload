import React, { useState, useCallback } from 'react'
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
import ExcelParser from '../ExcelParser'
import { useTestResultsQuery } from '../../api/hooks/test-results'
import type { Media } from '../../payload-types'

const ChartComponent: React.FC = () => {
  const [parsedData, setParsedData] = useState<any[]>([])

  const { data: testResults } = useTestResultsQuery({ limit: 5 })

  const fileUrl = (testResults?.docs[0].resultData as Media)?.url

  const handleParse = useCallback((data: any[]) => {
    setParsedData(data)
  }, [])

  return (
    <div>
      {/* Render ExcelParser to parse data */}
      {fileUrl && <ExcelParser fileUrl={fileUrl} onParse={handleParse} />}

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
