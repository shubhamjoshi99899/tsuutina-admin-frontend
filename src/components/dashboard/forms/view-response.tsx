import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import apiService from '@/services/api-service';
import { useParams } from 'next/navigation';

interface ResponseData {
  _id: string;
  formId: string;
  responses: Record<string, string>;
  createdAt: string;
}

const ResponsesTable: React.FC = () => {
  const [data, setData] = useState<ResponseData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const params = useParams();
  const formId = params.id as string;


  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await apiService.getResponsesByFormId(formId); // Replace with your actual API endpoint
        const responseData: any[] =  response.data.data;
        setData(responseData);

        if (responseData.length > 0) {
          const dynamicColumns = Object.keys(responseData[0].responses).concat([ 'createdAt']);
          setColumns(dynamicColumns);
        }
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
    };

    fetchResponses();
  }, []);

  return (
    <Container>
      <Typography variant="h4" my={2}>
        Responses
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  {column.replace(/_/g, ' ')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                {columns.map((column) => (
                  <TableCell key={column}>
                  {column === 'createdAt' && new Date(row[column as keyof ResponseData] as string).toLocaleString()}
                  {column !== '_id' && column !== 'formId' && column !== 'createdAt' && (row.responses[column] ?? '')}
                </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ResponsesTable;
