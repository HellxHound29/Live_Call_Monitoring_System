import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Radio } from "lucide-react";
import { api } from "../api";

const SignIn = () => {
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.login(u, p);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-page px-4">
      <div className="w-full max-w-md bg-surface border shadow-card rounded-md p-10">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-navy">
            Live Call Monitoring System
          </h1>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] tracking-widest text-muted-foreground">
            <Radio className="h-3 w-3" />
            CALL RECORDING & MONITORING
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-navy">Sign in</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-6">
          Call Recording & Monitoring Portal
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-md bg-danger/10 border border-danger/30 text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold tracking-widest text-muted-foreground">
              USERNAME
            </label>
            <div className="relative mt-1.5">
              <input
                value={u}
                onChange={(e) => setU(e.target.value)}
                placeholder="Enter username"
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-widest text-muted-foreground">
              PASSWORD
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPwd ? "text" : "password"}
                value={p}
                onChange={(e) => setP(e.target.value)}
                placeholder="Enter password"
                className="w-full h-10 rounded-md border border-input bg-background px-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPwd
                  ? <EyeOff className="h-4 w-4" />
                  : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 bg-navy text-white rounded-md text-sm font-semibold tracking-widest hover:bg-navy/90 transition-colors disabled:opacity-60"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
        <p className="text-center text-[11px] text-muted-foreground mt-6">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};

export default SignIn;