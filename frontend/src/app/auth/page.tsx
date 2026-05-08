'use client';

import { useMemo, useState } from 'react';

type ApiMethod = 'GET' | 'POST';

async function authRequest(apiBase: string, method: ApiMethod, path: string, body?: string) {
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

export default function AuthPage() {
  const [apiBase, setApiBase] = useState('https://localhost/api');
  const [output, setOutput] = useState('Use os botões para testar autenticação.');
  const [loading, setLoading] = useState(false);
  const normalizedApiBase = useMemo(() => apiBase.replace(/\/$/, ''), [apiBase]);

  const registerBody = JSON.stringify({ name: 'Maria', email: 'maria@email.com', password: '12345678' });
  const loginBody = JSON.stringify({ email: 'maria@email.com', password: '12345678' });

  async function run(method: ApiMethod, path: string, body?: string) {
    setLoading(true);
    try {
      const result = await authRequest(normalizedApiBase, method, path, body);
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput(`Erro: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <h1>Autenticação</h1>
      <p style={{ color: '#555' }}>Página dedicada ao fluxo de autenticação.</p>

      <input value={apiBase} onChange={(e) => setApiBase(e.target.value)} style={{ width: '100%', padding: '0.65rem', border: '1px solid #ccc', borderRadius: 8, marginBottom: '1rem' }} />

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        <button disabled={loading} onClick={() => run('POST', '/auth/register', registerBody)}>Registrar</button>
        <button disabled={loading} onClick={() => run('POST', '/auth/login', loginBody)}>Login</button>
        <button disabled={loading} onClick={() => run('POST', '/auth/refresh')}>Refresh</button>
        <button disabled={loading} onClick={() => run('POST', '/auth/logout')}>Logout</button>
        <button disabled={loading} onClick={() => run('GET', '/auth/me')}>Me</button>
      </div>

      <pre style={{ background: '#0b1020', color: '#d1e4ff', borderRadius: 10, padding: '1rem', fontSize: '0.85rem', marginTop: '1rem' }}>{output}</pre>
    </main>
  );
}
