import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { BellOff, Bell, X, Phone, PhoneOff, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Call = { id: number; caller: string; ext: string; startedAt: number };

const seed: Call[] = [
  { id: 1, caller: "+918480652793", ext: "7001", startedAt: Date.now() - 42_000 },
  { id: 2, caller: "+919624308060", ext: "7002", startedAt: Date.now() - 12_000 },
];

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
};

const LiveMonitoring = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(false);
  const [ext, setExt] = useState("7001");
  const [calls, setCalls] = useState<Call[]>(seed);
  const [, force] = useState(0);

  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const spy = (c: Call) => alert(`ChanSpy started: Listening to ${c.caller} via ext ${ext}`);
  const drop = (c: Call) => {
    setCalls((x) => x.filter((y) => y.id !== c.id));
    alert("Call ended: " + c.caller);
  };

  return (
    <AppLayout>
      <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-surface rounded-lg shadow-card w-full max-w-2xl p-8">

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Phone className="h-5 w-5" /> Live Call Monitoring
              </h2>
              <span className="text-xs text-success border border-success/30 rounded px-2 py-0.5 bg-success/5">
                ● Active
              </span>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className={`mt-6 flex items-center justify-between border rounded-md p-4 ${alerts ? "bg-success/5" : "bg-danger/5"}`}>
            <div className="flex items-center gap-3">
              {alerts
                ? <Bell className="h-5 w-5 text-success" />
                : <BellOff className="h-5 w-5 text-danger" />
              }
              <div>
                <p className={`text-sm font-medium ${alerts ? "text-success" : "text-danger"}`}>
                  Live Call Alerts
                </p>
                <p className="text-xs text-muted-foreground">
                  {alerts
                    ? "Notifications enabled for new calls"
                    : "Blocked — click lock icon → Site Settings → Allow Notifications"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAlerts((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${alerts ? "bg-success" : "bg-muted"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alerts ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium"># Your Extension</label>
            <p className="text-xs text-muted-foreground mb-2">
              Extension where ChanSpy call will ring
            </p>
            <input
              value={ext}
              onChange={(e) => setExt(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-right font-mono text-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mt-6 border-t">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] tracking-widest text-muted-foreground">
                  <th className="text-left font-medium py-3">CALLER</th>
                  <th className="text-left font-medium py-3">EXTENSION</th>
                  <th className="text-left font-medium py-3">DURATION</th>
                  <th className="text-left font-medium py-3">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {calls.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-muted-foreground text-sm">
                      No active calls
                    </td>
                  </tr>
                ) : calls.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="py-3">{c.caller}</td>
                    <td className="py-3">{c.ext}</td>
                    <td className="py-3 font-mono">{fmt(Date.now() - c.startedAt)}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => spy(c)}
                          className="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-input text-xs hover:bg-accent"
                        >
                          <Headphones className="h-3 w-3" /> Listen
                        </button>
                        <button
                          onClick={() => drop(c)}
                          className="inline-flex items-center h-8 px-3 rounded-md border border-danger/40 text-danger text-xs hover:bg-danger/10"
                        >
                          <PhoneOff className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default LiveMonitoring;