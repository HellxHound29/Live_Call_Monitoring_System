import { Fragment, useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import {
  Search, Play, Pause, RotateCw, ArrowDown,
  Filter, FileText, ChevronDown, ChevronRight
} from "lucide-react";

type Row = {
  id?: number;
  date: string;
  src: string;
  dst: string;
  dur: string;
  status: "Answered" | "No Answer" | "Busy";
  important?: boolean;
  tag?: "Important" | "Evidence" | "Suspect" | "Follow-up";
  recording?: string;
  played_count?: number;
  download_count?: number;
};

const staticRows: Row[] = [
  { date: "2026-04-08 13:28:55", src: "+918480652793", dst: "+917935004420", dur: "21 sec", status: "Answered", recording: "2026-04-08-13-28-55.wav" },
  { date: "2026-04-08 13:10:55", src: "+918480652793", dst: "+917935004420", dur: "88 sec", status: "Answered", recording: "2026-04-08-13-10-55.wav" },
  { date: "2026-04-08 13:11:33", src: "+918480652793", dst: "+917935004420", dur: "3 sec", status: "Answered", tag: "Evidence", recording: "2026-04-08-13-11-33.wav" },
  { date: "2026-04-08 13:11:23", src: "+918480652793", dst: "+917935004420", dur: "14 sec", status: "No Answer" },
  { date: "2026-03-14 14:25:17", src: "+917930806949", dst: "+917935004420", dur: "15 sec", status: "Answered", important: true, tag: "Important", recording: "2026-03-14-14-25-17.wav" },
  { date: "2026-03-14 14:24:51", src: "+917930806949", dst: "+917935004420", dur: "8 sec", status: "Busy", tag: "Suspect" },
  { date: "2026-03-12 09:14:02", src: "+919624308060", dst: "+917935004420", dur: "44 sec", status: "Answered", tag: "Follow-up", recording: "2026-03-12-09-14-02.wav" },
];

const PAGE_SIZE = 5;
const tagFilters = ["All", "Important", "Evidence", "Suspect", "Follow-up"] as const;
const statusFilters = ["All Status", "Answered", "No Answer", "Busy"] as const;
const BACKEND = "http://127.0.0.1:8000";

const CdrDashboard = () => {
  const [allRows, setAllRows] = useState<Row[]>(staticRows);
  const [showCounters, setShowCounters] = useState(false);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<(typeof tagFilters)[number]>("All");
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All Status");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [downloads, setDownloads] = useState<Record<string, number>>({});
  const [played, setPlayed] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND}/api/calls/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const mapped: Row[] = data.map((c: any) => ({
              id: c.id,
              date: c.date.replace("T", " ").replace("Z", "").slice(0, 19),
              src: c.src,
              dst: c.dst,
              dur: c.duration,
              status: c.status,
              tag: c.tag || undefined,
              important: c.important,
              recording: c.recording || undefined,
              played_count: c.played_count,
              download_count: c.download_count,
            }));
            setAllRows(mapped);
          }
        }
      } catch (e) {
        console.error("Failed to fetch calls", e);
      }
    };
    fetchCalls();
  }, []);

  const rowId = (r: Row) => `${r.date}|${r.src}|${r.dst}`;

  const filtered = useMemo(() => {
    return allRows.filter((r) => {
      if (search && !(r.src.includes(search) || r.dst.includes(search))) return false;
      if (tag !== "All" && r.tag !== tag) return false;
      if (status !== "All Status" && r.status !== status) return false;
      if (from && r.date.slice(0, 10) < from) return false;
      if (to && r.date.slice(0, 10) > to) return false;
      return true;
    });
  }, [allRows, search, tag, status, from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counters = useMemo(() => ({
    total: allRows.length,
    answered: allRows.filter((r) => r.status === "Answered").length,
    noAnswer: allRows.filter((r) => r.status === "No Answer").length,
    important: allRows.filter((r) => r.important).length,
  }), [allRows]);

  const exportCsv = () => {
    const escape = (v: string | number) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = ["Date", "Source", "Destination", "Duration", "Status", "Recording", "Played", "Downloads", "Tags"];
    const lines = [header.join(",")].concat(
      filtered.map((r) => {
        const id = rowId(r);
        return [
          r.date, r.src, r.dst, r.dur, r.status,
          r.recording ?? "",
          played[id] ? "Yes" : "No",
          downloads[id] ?? 0,
          r.tag ?? "",
        ].map(escape).join(",");
      })
    );
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cdr-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`✓ ${filtered.length} records exported as CSV`);
  };

  const togglePlay = (id: string, recording: string) => {
    if (playing === id) {
      setPlaying(null);
      const audio = document.getElementById("audio-player") as HTMLAudioElement;
      if (audio) audio.pause();
    } else {
      setPlaying(id);
      setPlayed((s) => ({ ...s, [id]: true }));
      const audio = document.getElementById("audio-player") as HTMLAudioElement;
      if (audio) {
        audio.src = `${BACKEND}/api/recording/${encodeURIComponent(recording)}/?stream=true`;
        audio.play();
      }
    }
  };

  const downloadRecording = (r: Row) => {
    const id = rowId(r);
    if (!r.recording) {
      showToast("No recording file available for this call.");
      return;
    }
    const url = `${BACKEND}/api/recording/${encodeURIComponent(r.recording)}/`;
    const a = document.createElement("a");
    a.href = url;
    a.download = r.recording;
    a.click();
    showToast(`✓ Downloading ${r.recording}`);
    setDownloads((d) => ({ ...d, [id]: (d[id] ?? 0) + 1 }));
  };

  return (
    <AppLayout>
      <audio id="audio-player" onEnded={() => setPlaying(null)} />
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-navy text-white text-sm px-4 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
      <div className="bg-surface rounded-lg shadow-card p-6">
        <button
          onClick={() => setShowCounters((v) => !v)}
          className="text-xs text-muted-foreground mb-4 inline-flex items-center gap-1 hover:text-foreground"
        >
          {showCounters ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          {showCounters ? "Hide Counters" : "Show Counters"}
        </button>
        {showCounters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: "TOTAL", value: counters.total },
              { label: "ANSWERED", value: counters.answered },
              { label: "NO ANSWER", value: counters.noAnswer },
              { label: "IMPORTANT", value: counters.important },
            ].map((c) => (
              <div key={c.label} className="border rounded-md p-3">
                <p className="text-[10px] tracking-widest text-muted-foreground">{c.label}</p>
                <p className="text-2xl font-semibold">{c.value}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            Call Detail Records
            <button onClick={() => setPage(1)} aria-label="Refresh">
              <RotateCw className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Phone search..."
                className="pl-9 w-56 h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-1 h-9 px-3 rounded-md border border-input bg-background text-sm hover:bg-accent transition-colors"
            >
              <FileText className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {tagFilters.map((t) => (
            <button
              key={t}
              className={`h-7 px-3 rounded-md border text-xs font-medium transition-colors ${
                tag === t ? "bg-navy text-white border-navy" : "bg-background border-input hover:bg-accent"
              }`}
              onClick={() => { setTag(t); setPage(1); }}
            >
              {t}
            </button>
          ))}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }}
            className="h-7 rounded-md border border-input bg-background px-2 text-xs"
          >
            {statusFilters.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="h-7 w-36 rounded-md border border-input bg-background px-2 text-xs" />
          <span className="text-muted-foreground">to</span>
          <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="h-7 w-36 rounded-md border border-input bg-background px-2 text-xs" />
        </div>
        <div className="border-t">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] tracking-widest text-muted-foreground">
                <th className="text-left font-medium py-3"></th>
                <th className="text-left font-medium py-3">DATE</th>
                <th className="text-left font-medium py-3">SOURCE</th>
                <th className="text-left font-medium py-3">DESTINATION</th>
                <th className="text-left font-medium py-3">DURATION</th>
                <th className="text-left font-medium py-3">STATUS</th>
                <th className="text-left font-medium py-3">RECORDING</th>
                <th className="text-left font-medium py-3">PLAYED</th>
                <th className="text-left font-medium py-3">DOWNLOADS</th>
                <th className="text-left font-medium py-3">TAGS</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-muted-foreground">
                    No records match the filters
                  </td>
                </tr>
              )}
              {pageRows.map((r) => {
                const id = rowId(r);
                const isExpanded = expanded === id;
                return (
                  <Fragment key={id}>
                    <tr className={`border-t ${r.important ? "border-l-4 border-l-danger" : ""}`}>
                      <td className="py-4">
                        <button onClick={() => setExpanded(isExpanded ? null : id)}>
                          {isExpanded
                            ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </button>
                      </td>
                      <td className="py-4">{r.date}</td>
                      <td className="py-4">{r.src}</td>
                      <td className="py-4">{r.dst}</td>
                      <td className="py-4">{r.dur}</td>
                      <td className="py-4">{r.status}</td>
                      <td className="py-4">
                        {r.recording ? (
                          <button
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-input hover:bg-accent"
                            onClick={() => togglePlay(id, r.recording!)}
                          >
                            {playing === id
                              ? <Pause className="h-3 w-3" />
                              : <Play className="h-3 w-3" />}
                          </button>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="py-4 text-muted-foreground">{played[id] ? "Yes" : "—"}</td>
                      <td className="py-4">
                        <button
                          onClick={() => downloadRecording(r)}
                          disabled={!r.recording}
                          className={`inline-flex items-center gap-1 transition-colors ${
                            r.recording ? "text-navy hover:text-navy/70 cursor-pointer" : "text-muted-foreground cursor-not-allowed opacity-50"
                          }`}
                        >
                          <ArrowDown className="h-4 w-4" />
                          <span className="text-xs">{downloads[id] ?? 0}</span>
                        </button>
                      </td>
                      <td className="py-4">
                        {r.tag ? (
                          <span className="text-[10px] font-semibold tracking-widest text-danger border border-danger/30 rounded px-2 py-1 bg-danger/5">
                            {r.tag}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-page/50">
                        <td></td>
                        <td colSpan={9} className="py-4 text-xs text-muted-foreground">
                          <div className="grid grid-cols-3 gap-4">
                            <div><b className="text-foreground">Channel:</b> SIP/{r.src.slice(-4)}</div>
                            <div><b className="text-foreground">Disposition:</b> {r.status}</div>
                            <div>
                              <b className="text-foreground">Recording file:</b>{" "}
                              {r.recording ? (
                                <button onClick={() => downloadRecording(r)} className="text-navy underline hover:text-navy/70">
                                  {r.recording}
                                </button>
                              ) : "None"}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button
              className="h-8 px-3 rounded-md border border-input bg-background text-xs hover:bg-accent disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >Previous</button>
            <button
              className="h-8 px-3 rounded-md bg-navy text-white text-xs hover:bg-navy/90 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >Next</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CdrDashboard;