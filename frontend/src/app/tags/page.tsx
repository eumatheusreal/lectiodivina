'use client';

import { FormEvent, useMemo, useState } from 'react';

async function tagsRequest(apiBase: string, method: 'GET' | 'POST', path: string, body?: string) {
  const url = `${apiBase}${path}`;
  const response = await fetch(url, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body && method !== 'GET' ? body : undefined,
  });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();
  return { ok: response.ok, status: response.status, payload, url };
}

export default function TagsPage() {
  const [apiBase, setApiBase] = useState('https://localhost/api');
  const [name, setName] = useState('oração');
  const [output, setOutput] = useState('Use os botões para listar e criar tags.');
  const [loading, setLoading] = useState(false);
  const normalizedApiBase = useMemo(() => apiBase.replace(/\/$/, ''), [apiBase]);

  async function listTags() {
    setLoading(true);
    try {
      const result = await tagsRequest(normalizedApiBase, 'GET', '/tags');
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput(`Erro: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  async function createTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const body = JSON.stringify({ name });
      const result = await tagsRequest(normalizedApiBase, 'POST', '/tags', body);
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput(`Erro: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <h1>Tags</h1>
      <p style={{ color: '#555' }}>Página dedicada ao cadastro e listagem de tags.</p>

      <input value={apiBase} onChange={(e) => setApiBase(e.target.value)} style={{ width: '100%', padding: '0.65rem', border: '1px solid #ccc', borderRadius: 8, marginBottom: '1rem' }} />

      <button disabled={loading} onClick={listTags} style={{ marginBottom: '1rem' }}>Listar tags</button>

      <form onSubmit={createTag} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="nome da tag" style={{ flex: 1, padding: '0.65rem', border: '1px solid #ccc', borderRadius: 8 }} />
        <button type="submit" disabled={loading}>Criar tag</button>
      </form>

      <pre style={{ background: '#0b1020', color: '#d1e4ff', borderRadius: 10, padding: '1rem', fontSize: '0.85rem' }}>{output}</pre>
    </main>
  );
}
