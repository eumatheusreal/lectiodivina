'use client';

import { FormEvent, useMemo, useState } from 'react';

type ApiResult = { ok: boolean; status: number; statusText: string; payload: unknown; url: string };

async function request(apiBase: string, path: string) {
  const url = `${apiBase}${path}`;
  const response = await fetch(url, { credentials: 'include' });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();
  return { ok: response.ok, status: response.status, statusText: response.statusText, payload, url } as ApiResult;
}

export default function LectiosPage() {
  const [apiBase, setApiBase] = useState('https://localhost/api');
  const [lectioId, setLectioId] = useState('new');
  const [result, setResult] = useState('Faça uma consulta para listar lectios.');
  const [loading, setLoading] = useState(false);
  const normalizedApiBase = useMemo(() => apiBase.replace(/\/$/, ''), [apiBase]);

  async function run(path: string) {
    setLoading(true);
    try {
      const data = await request(normalizedApiBase, path);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Erro: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(`/lectios/${lectioId}`);
  }

  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <h1>Lectios</h1>
      <p style={{ color: '#555' }}>Página dedicada à listagem e leitura de lectios.</p>

      <label htmlFor="lectios-api-base" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Base da API</label>
      <input id="lectios-api-base" value={apiBase} onChange={(e) => setApiBase(e.target.value)} style={{ width: '100%', padding: '0.65rem', border: '1px solid #ccc', borderRadius: 8 }} />

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', marginBottom: '1rem' }}>
        <button disabled={loading} onClick={() => run('/lectios')} style={{ padding: '0.65rem 0.9rem' }}>Listar lectios</button>
        <button disabled={loading} onClick={() => run(`/lectios/${lectioId}/export/markdown`)} style={{ padding: '0.65rem 0.9rem' }}>Exportar markdown</button>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input value={lectioId} onChange={(e) => setLectioId(e.target.value)} placeholder="id da lectio" style={{ flex: 1, padding: '0.65rem', border: '1px solid #ccc', borderRadius: 8 }} />
        <button type="submit" disabled={loading} style={{ padding: '0.65rem 0.9rem' }}>Buscar por ID</button>
      </form>

      <pre style={{ background: '#0b1020', color: '#d1e4ff', borderRadius: 10, padding: '1rem', fontSize: '0.85rem' }}>{result}</pre>
    </main>
  );
}
