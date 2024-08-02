import React, { useEffect, useState } from 'react';
// import jsPDF from 'jspdf';

// import 'jspdf-autotable';

import apiService from '@/services/api-service';
import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface ViewResponsesProps {
  formId: string;
}

const ViewResponses: React.FC<ViewResponsesProps> = ({ formId }) => {
  const [responses, setResponses] = useState<any[]>([]);

  useEffect(() => {
    apiService.getResponsesByFormId(formId).then((response) => {
      const { data } = response.data;
      setResponses(data);
    });
  }, [formId]);

  const columns: GridColDef[] = [
    { field: 'formId', headerName: 'Form ID', width: 150 },
    { field: 'responses', headerName: 'Responses', width: 500 },
  ];

  //   const handleDownloadPdf = () => {
  //     const doc = new jsPDF();
  //     doc.autoTable({ html: '#responses-table' });
  //     doc.save('responses.pdf');
  //   };

  return (
    <div>
      <Button variant="contained">Download PDF</Button>
      <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
        {/* <DataGrid rows={responses} columns={columns} getRowId={() => formId} /> */}
      </div>
    </div>
  );
};

export default ViewResponses;
