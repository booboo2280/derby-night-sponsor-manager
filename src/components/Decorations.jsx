import React, { useState, useEffect } from 'react';

export default function Decorations() {
  const [connected, setConnected] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // detect query param from OAuth redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get('canva') === 'connected') setConnected(true);
  }, []);

  // Use Vite env var to target the backend server in production
  const serverRoot = import.meta.env.VITE_SERVER_ROOT || '';

  const connectCanva = () => {
    if (!serverRoot) {
      alert('Server root (VITE_SERVER_ROOT) is not configured. Set it to your backend URL (e.g. https://my-server.com) and redeploy the frontend.');
      return;
    }

    // opens the server OAuth redirect which will go to Canva
    const url = `${serverRoot.replace(/\/$/, '')}/auth/canva`;
    window.open(url, '_blank', 'width=700,height=800');
  };

  const fetchAssets = async () => {
    if (!serverRoot) {
      setError('Server root not configured. Cannot fetch assets.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${serverRoot.replace(/\/$/, '')}/api/canva/assets`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error || 'Failed to fetch assets');
        setAssets([]);
      } else {
        const data = await res.json();
        // Expecting an array or object with items — try to normalize
        const list = Array.isArray(data) ? data : data?.data || data?.assets || [];
        setAssets(list);
      }
    } catch (err) {
      setError('Network error while fetching assets');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Decorations</h1>

      <p className="text-slate-600 mb-4">
        Decoration planning tools will go here.
      </p>

      <div className="mb-4">
        {connected ? (
          <div className="text-sm text-emerald-700 mb-2">Canva connected ✅</div>
        ) : (
          <div className="text-sm text-slate-600 mb-2">Not connected to Canva</div>
        )}

        <button onClick={connectCanva} className="bg-blue-600 text-white px-3 py-2 rounded mr-3">Connect to Canva</button>
        <button onClick={fetchAssets} className="bg-amber-700 text-white px-3 py-2 rounded" disabled={loading}>Fetch Assets</button>
      </div>

      {error && <div className="mb-4 text-sm text-red-700">{error}</div>}

      {loading && <div className="mb-4 text-sm">Loading assets…</div>}

      {assets.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Select an asset</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {assets.map((a, i) => (
              <div key={a.id || i} className="border rounded p-2">
                {a.image_url ? (
                  <img src={a.image_url} alt={a.name || 'asset'} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }} />
                ) : (
                  <div style={{ width: '100%', height: 140, background: '#f3f4f6', borderRadius: 6 }} />
                )}
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm">{a.name || a.title || 'Untitled'}</div>
                  <button onClick={() => setSelected(a)} className="text-xs bg-emerald-600 text-white px-2 py-1 rounded">Use</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div className="mt-6">
          <h4 className="font-semibold">Selected asset</h4>
          <div className="mt-2">
            <img src={selected.image_url || selected.url} alt={selected.name || 'selected asset'} style={{ width: 300, borderRadius: 6 }} />
          </div>
        </div>
      )}
    </section>
  );
}
 