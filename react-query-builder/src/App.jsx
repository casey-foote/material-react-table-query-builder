import React, { useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Typography } from '@mui/material';
import * as duckdb from '@duckdb/duckdb-wasm';

// ...rest of the file unchanged

const DUCKDB_BUNDLE = duckdb.getJsDelivrBundles().find(b => b.mainWorker);
const PARQUET_URL = "https://storage.googleapis.com/ba-duckdb/train.parquet";

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const logger = new duckdb.ConsoleLogger();
      const db = new duckdb.AsyncDuckDB(logger);
      await db.instantiate(DUCKDB_BUNDLE.mainModule, DUCKDB_BUNDLE.mainWorker);
      const conn = await db.connect();

      const result = await conn.query(`SELECT * FROM '${PARQUET_URL}' LIMIT 100`);
      const rows = result.toArray();
      const cols = result.schema.fields.map(f => ({ accessorKey: f.name, header: f.name }));

      setColumns(cols);
      setData(rows);
      setLoading(false);
      conn.close();
    }

    loadData();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">DuckDB Query Results</Typography>
      <MaterialReactTable columns={columns} data={data} state={{ isLoading: loading }} />
    </Box>
  );
}

export default App;
