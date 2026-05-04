import { useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import { Search, Plus, Pencil, Trash2, UserCircle2 } from "lucide-react";

type Role = "admin" | "User";
type User = { id: number; username: string; display: string; role: Role; created: string };

const initial: User[] = [
  { id: 1, username: "admin", display: "Administrator", role: "admin", created: "3/13/2026" },
  { id: 2, username: "rashesh", display: "Rashesh Patel", role: "User", created: "3/14/2026" },
  { id: 4, username: "SOG_1", display: "SOG PC 1", role: "User", created: "3/17/2026" },
];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(initial);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [form, setForm] = useState({ username: "", display: "", password: "", role: "User" as Role });
  const [resetPwd, setResetPwd] = useState("");

  const filtered = useMemo(
    () => users.filter((u) => (u.username + u.display).toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  const submitCreate = () => {
    if (!form.username || !form.display || !form.password) {
      alert("Fill all fields to continue.");
      return;
    }
    const id = Math.max(...users.map((u) => u.id)) + 1;
    const created = new Date().toLocaleDateString();
    setUsers((u) => [...u, { id, username: form.username, display: form.display, role: form.role, created }]);
    setForm({ username: "", display: "", password: "", role: "User" });
    setCreateOpen(false);
  };

  const submitReset = () => {
    if (!resetPwd) return;
    setResetPwd("");
    setResetUser(null);
    alert("Password updated.");
  };

  const confirmDelete = () => {
    if (!deleteUser) return;
    setUsers((u) => u.filter((x) => x.id !== deleteUser.id));
    setDeleteUser(null);
  };

  const changeRole = (u: User, role: Role) => {
    setUsers((all) => all.map((x) => (x.id === u.id ? { ...x, role } : x)));
  };

  return (
    <AppLayout>
      <div className="bg-surface rounded-lg shadow-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <UserCircle2 className="h-6 w-6" /> User Management
          </h1>
          <button
            className="inline-flex items-center gap-1 h-9 px-4 rounded-md bg-navy text-white text-sm font-medium hover:bg-navy/90"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" /> CREATE USER
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full h-10 pl-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="border-t">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] tracking-widest text-muted-foreground">
                <th className="text-left font-medium py-3 px-2">ID</th>
                <th className="text-left font-medium py-3 px-2">USERNAME</th>
                <th className="text-left font-medium py-3 px-2">DISPLAY NAME</th>
                <th className="text-left font-medium py-3 px-2">ROLE</th>
                <th className="text-left font-medium py-3 px-2">CREATED</th>
                <th className="text-left font-medium py-3 px-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No users found</td></tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-4 px-2">{u.id}</td>
                  <td className="py-4 px-2 font-medium">{u.username}</td>
                  <td className="py-4 px-2">{u.display}</td>
                  <td className="py-4 px-2">
                    {u.id === 1 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-navy text-white text-xs font-semibold">● admin</span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u, e.target.value as Role)}
                        className="h-8 w-28 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="User">User</option>
                        <option value="admin">admin</option>
                      </select>
                    )}
                  </td>
                  <td className="py-4 px-2 text-muted-foreground">{u.created}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-warning/40 text-warning text-xs hover:bg-warning/10"
                        onClick={() => setResetUser(u)}
                      >
                        <Pencil className="h-3 w-3" /> Reset
                      </button>
                      {u.id !== 1 && (
                        <button
                          className="inline-flex items-center h-8 px-3 rounded-md border border-danger/40 text-danger text-xs hover:bg-danger/10"
                          onClick={() => setDeleteUser(u)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg shadow-card p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create User</h2>
            <div className="space-y-3">
              <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none" />
              <input placeholder="Display name" value={form.display} onChange={(e) => setForm({ ...form, display: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none" />
              <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="User">User</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setCreateOpen(false)} className="h-9 px-4 rounded-md border border-input text-sm hover:bg-accent">Cancel</button>
              <button onClick={submitCreate} className="h-9 px-4 rounded-md bg-navy text-white text-sm hover:bg-navy/90">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg shadow-card p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-1">Reset Password</h2>
            <p className="text-sm text-muted-foreground mb-4">Set a new password for {resetUser.username}.</p>
            <input type="password" placeholder="New password" value={resetPwd} onChange={(e) => setResetPwd(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none" />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setResetUser(null)} className="h-9 px-4 rounded-md border border-input text-sm hover:bg-accent">Cancel</button>
              <button onClick={submitReset} className="h-9 px-4 rounded-md bg-navy text-white text-sm hover:bg-navy/90">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg shadow-card p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-1">Delete user?</h2>
            <p className="text-sm text-muted-foreground mb-4">This will permanently remove {deleteUser.username}.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteUser(null)} className="h-9 px-4 rounded-md border border-input text-sm hover:bg-accent">Cancel</button>
              <button onClick={confirmDelete} className="h-9 px-4 rounded-md bg-danger text-white text-sm hover:bg-danger/90">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default UserManagement;