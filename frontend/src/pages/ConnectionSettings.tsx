import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { Database, Table as TableIcon, Folder, Palette, Loader2 } from "lucide-react";

const Section = ({ icon: Icon, title, desc, children }: any) => (
  <div className="border-t pt-6 mt-6 first:border-t-0 first:mt-0 first:pt-0">
    <h2 className="font-semibold flex items-center gap-2 mb-1">
      <Icon className="h-4 w-4" /> {title}
    </h2>
    {desc && <p className="text-xs text-muted-foreground mb-4">{desc}</p>}
    {children}
  </div>
);

const Field = ({ label, value, onChange, ...rest }: any) => (
  <div>
    <label className="text-[10px] font-semibold tracking-widest text-muted-foreground">
      {label}
    </label>
    <input
      className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  </div>
);

const ConnectionSettings = () => {
  const [form, setForm] = useState({
    host: "localhost",
    port: "3306",
    username: "asterisk",
    password: "********",
    database: "asteriskcdrdb",
    table: "cdr",
    limit: "1000",
    path: "/var/spool/asterisk/monitor",
    theme: "Classic (Dark Navy)",
  });
  const [testing, setTesting] = useState(false);
  const set = (k: keyof typeof form) => (v: string) =>
    setForm({ ...form, [k]: v });

  const test = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      alert(`Connected to ${form.host}:${form.port}`);
    }, 800);
  };

  const save = () => alert("Settings saved.");

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto bg-surface rounded-lg shadow-card p-8">
        <h1 className="text-2xl font-semibold">Connection Settings</h1>
        <p className="text-xs text-muted-foreground mb-6">
          Configure Asterisk CDR database connection
        </p>

        <Section
          icon={Database}
          title="Database Connection"
          desc="MySQL connection parameters for the Asterisk CDR database"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="HOST" value={form.host} onChange={set("host")} />
            <Field label="PORT" value={form.port} onChange={set("port")} />
            <Field label="USERNAME" value={form.username} onChange={set("username")} />
            <Field label="PASSWORD" type="password" value={form.password} onChange={set("password")} />
            <div className="col-span-2">
              <Field label="DATABASE NAME" value={form.database} onChange={set("database")} />
            </div>
          </div>
          <button
            onClick={test}
            disabled={testing}
            className="mt-4 inline-flex items-center gap-1 h-9 px-4 rounded-md border border-input bg-background text-sm hover:bg-accent disabled:opacity-50"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : "⚡"} Test Connection
          </button>
        </Section>

        <Section
          icon={TableIcon}
          title="CDR Table Settings"
          desc="Table name and query preferences"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="CDR TABLE NAME" value={form.table} onChange={set("table")} />
            <Field label="RECORDS LIMIT" value={form.limit} onChange={set("limit")} />
          </div>
        </Section>

        <Section
          icon={Folder}
          title="Recording Storage"
          desc="Base directory where call recordings are stored"
        >
          <Field label="RECORDING BASE PATH" value={form.path} onChange={set("path")} />
          <p className="text-xs text-muted-foreground mt-2">
            Full server path where Asterisk saves call recordings
          </p>
        </Section>

        <Section
          icon={Palette}
          title="Default UI Theme"
          desc="Set the default theme for new users."
        >
          <label className="text-[10px] font-semibold tracking-widest text-muted-foreground">
            DEFAULT THEME
          </label>
          <select
            value={form.theme}
            onChange={(e) => set("theme")(e.target.value)}
            className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option>Classic (Dark Navy)</option>
            <option>Light</option>
            <option>High Contrast</option>
          </select>
        </Section>

        <div className="flex justify-end mt-8">
          <button
            onClick={save}
            className="h-10 px-6 rounded-md bg-navy text-white text-sm font-semibold tracking-widest hover:bg-navy/90"
          >
            SAVE SETTINGS
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ConnectionSettings;