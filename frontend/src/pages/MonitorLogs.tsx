import AppLayout from "../components/AppLayout";
import { Wifi } from "lucide-react";

const rows = [
  { time: "4/8/2026, 1:38:18 PM", user: "admin", caller: "+918480852793", ext: "7001" },
  { time: "4/8/2026, 1:18:22 PM", user: "admin", caller: "+918480652793", ext: "7001" },
  { time: "4/8/2026, 1:17:38 PM", user: "admin", caller: "+918480652793", ext: "7001" },
  { time: "3/14/2026, 1:51:00 PM", user: "admin", caller: "+919624308060", ext: "7002" },
];

const MonitorLogs = () => (
  <AppLayout>
    <div className="bg-surface rounded-lg shadow-card p-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Wifi className="h-6 w-6" /> Live Call Monitoring Logs
        </h1>
        <span className="text-xs text-muted-foreground">{rows.length} entries</span>
      </div>
      <div className="border-t">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] tracking-widest text-muted-foreground">
              <th className="text-left font-medium py-3">TIME</th>
              <th className="text-left font-medium py-3">USER</th>
              <th className="text-left font-medium py-3">CALLER ID</th>
              <th className="text-left font-medium py-3">SUPERVISOR EXT</th>
              <th className="text-left font-medium py-3">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="py-5 text-muted-foreground">{r.time}</td>
                <td className="py-5 font-medium">{r.user}</td>
                <td className="py-5">{r.caller}</td>
                <td className="py-5">{r.ext}</td>
                <td className="py-5">
                  <span className="inline-flex items-center gap-1 text-success text-xs font-medium border border-success/30 rounded px-2 py-1 bg-success/5">
                    ● SUCCESS
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-4">
          Showing {rows.length} of {rows.length} entries
        </p>
      </div>
    </div>
  </AppLayout>
);

export default MonitorLogs;