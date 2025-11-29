import { useState } from 'react';

type Props = {
  phoneNumber: string;
};

export default function CallButton({ phoneNumber }: Props) {
  const [loading, setLoading] = useState(false);

  const startCall = async () => {
    setLoading(true);
    try {
      // Try calling an API endpoint that triggers a Twilio call.
      // If the server is not available, fallback to a tel: link.
      const res = await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phoneNumber }),
      });

      if (res.ok) {
        const data = await res.json();
        window.alert(data.message || 'Call initiated.');
      } else {
        // fallback to tel: if no backend
        window.location.href = `tel:${phoneNumber}`;
      }
    } catch (err) {
      // fallback to tel: on network error
      window.location.href = `tel:${phoneNumber}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={startCall}
      className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition"
      aria-label={`Call ${phoneNumber}`}
      disabled={loading}
    >
      {loading ? 'Calling…' : 'Call'}
    </button>
  );
}
