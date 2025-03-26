import React, { useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Typography, Button, TextField } from '@mui/material';
import * as duckdb from '@duckdb/duckdb-wasm';

function App() {
  const [db, setDb] = useState(null);
  const [conn, setConn] = useState(null);
  const [query, setQuery] = useState('');
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function initDuckDB() {
      try {
        console.log("🚀 Initializing DuckDB...");

        const logger = new duckdb.ConsoleLogger();
        const bundle = {
          mainModule: "https://casey-foote.github.io/material-react-table-query-builder/assets/duckdb/duckdb-eh.wasm",
          mainWorker: "https://casey-foote.github.io/material-react-table-query-builder/assets/duckdb/duckdb-browser-eh.worker.js",
        };

        console.log("📦 Fetching worker...");
        const workerSrc = await fetch(bundle.mainWorker).then((r) => r.text());

        console.log("📦 Creating blob...");
        const blob = new Blob([workerSrc], { type: "application/javascript" });

        console.log("🧠 Creating worker...");
        const worker = new Worker(URL.createObjectURL(blob)); // 🔧 FIXED LINE (removed { type: "module" })

        console.log("🔧 Creating AsyncDuckDB...");
        const dbInstance = new duckdb.AsyncDuckDB(logger, worker);

        console.log("⚙️ Instantiating DB with:", bundle.mainModule);
        try {
          const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout: instantiate() took too long")), 5000)
          );
          await Promise.race([
            dbInstance.instantiate(bundle.mainModule, { extensions: {} }),
            timeout
          ]);
          console.log("✅ DuckDB WASM instantiated");
        } catch (e) {
          console.error("❌ instantiate() failed:", e);
          setError(`DuckDB instantiate() failed: ${e.message}`);
          return;
        }

        console.log("📦 Registering extension...");
        await dbInstance.registerExtension({
          name: "parquet",
          url: "https://casey-foote.github.io/material-react-table-query-builder/assets/duckdb/parquet.duckdb_extension.wasm",
        });

        console.log("📦 Loading extension...");
        await dbInstance.loadExtension("parquet");

        console.log("🔌 Connecting...");
        const connection = await dbInstance.connect();

        setDb(dbInstance);
        setConn(connection);

        console.log("✅ DuckDB fully initialized and connected");
      } catch (e) {
        console.error("❌ DuckDB init failed:", e);
        setError(`DuckDB init failed: ${e.message}`);
      }
    }

    initDuckDB();
  }, []);

  const executeQuery = async () => {
    if (!conn || !query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await conn.query(query);
      const rows = result.toArray();
      const cols = result.schema.fields.map(f => ({
        accessorKey: f.name,
        header: f.name
      }));
      setColumns(cols);
      setData(rows);
    } catch (e) {
      setError(`Query execution failed: ${e.message}`);
      setColumns([]);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>DuckDB Query Executor</Typography>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      <TextField
        label="Enter SQL Query"
        multiline
        rows={4}
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={executeQuery} disabled={loading || !conn}>
        Run Query
      </Button>

      <Box sx={{ mt: 4 }}>
        <MaterialReactTable columns={columns} data={data} state={{ isLoading: loading }} />
      </Box>
    </Box>
  );
}

export default App;
