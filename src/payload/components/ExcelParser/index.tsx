import React, { useEffect, useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import axios from 'axios'
import Table from 'payload/dist/admin/components/elements/Table'
import { format } from 'date-fns'

interface ParsedData {
  [key: string]: string | number
}

interface ExcelCsvParserProps {
  fileUrl: string
  onParse: (data: ParsedData[]) => void
}

const ExcelCsvParser: React.FC<ExcelCsvParserProps> = ({ fileUrl, onParse }) => {
  const [data, setData] = useState<ParsedData[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isParsed = useRef(false)

  const fetchAndParseFile = async () => {
    if (isParsed.current) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(fileUrl, {
        responseType: 'arraybuffer',
      })

      const fileType = fileUrl.endsWith('.csv') ? 'csv' : 'excel'
      let jsonData: ParsedData[] = []

      if (fileType === 'csv') {
        const csvData = new TextDecoder().decode(response.data)
        const workbook = XLSX.read(csvData, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        jsonData = XLSX.utils.sheet_to_json<ParsedData>(sheet)
      } else {
        const workbook = XLSX.read(response.data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        jsonData = XLSX.utils.sheet_to_json<ParsedData>(sheet)
      }

      const validKeys = Object.keys(jsonData[0] || {}).filter(key =>
        jsonData.some(row => row[key] !== '-' && row[key] !== ' '),
      )

      const filteredData = jsonData
        .map(row => {
          const filteredRow: ParsedData = {}
          validKeys.forEach(key => {
            filteredRow[key] = row[key]
          })
          return filteredRow
        })
        .filter(row => {
          return Object.values(row).some(
            value =>
              value !== '-' &&
              value !== ' ' &&
              value !== null &&
              value !== undefined &&
              value !== '',
          )
        })

      setData(filteredData)
      onParse(filteredData)

      if (filteredData.length > 0) {
        const generatedColumns = validKeys.map(key => ({
          accessor: key,
          active: true,
          components: {
            Heading: <>{key}</>,
            renderCell: (row: ParsedData) => {
              if (key === 'dátum narodenia') {
                const date = new Date(row[key] as string)
                return <>{isNaN(date.getTime()) ? row[key] : format(date, 'dd.MM.yyyy')}</>
              }
              return <>{row[key]}</>
            },
          },
          label: key,
          name: key,
        }))
        setColumns(generatedColumns)
      }

      isParsed.current = true
    } catch (err) {
      setError('Failed to fetch or parse the file.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (fileUrl) {
      fetchAndParseFile()
    }
  }, [fileUrl]) // Trigger fetchAndParseFile when fileUrl changes

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h3>Parsed Excel Data</h3>
      {data.length > 0 ? <Table columns={columns} data={data} /> : <p>No data available</p>}
    </div>
  )
}

export default ExcelCsvParser
