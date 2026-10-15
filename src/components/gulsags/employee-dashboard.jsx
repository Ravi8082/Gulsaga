import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, BriefcaseBusiness, Camera, CalendarCheck2, CheckCircle2, Clock3, FileText, Flame, LayoutDashboard, LogOut, Send, ShieldCheck, TrendingUp, UserRound, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { request } from "@/lib/gulsags/api";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const day = (date) => new Date(date).toISOString().slice(0, 10);
const labelDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const statusText = { PRESENT: "Present", ABSENT: "Absent", HALF_DAY: "Half-day", LEAVE: "Leave" };
const reportText = { SUBMITTED: "Submitted", REVIEWED: "Reviewed", NEEDS_UPDATE: "Update requested" };
const tabs = [
  ["overview", "Overview", LayoutDashboard],
  ["projects", "Projects", BriefcaseBusiness],
  ["attendance", "Attendance", CalendarCheck2],
  ["reports", "Daily reports", FileText],
  ["profile", "Profile & security", UserRound],
];

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

function lastDays(count) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (count - 1 - index));
    return day(date);
  });
}

export function EmployeeDashboard() {
  const [account, setAccount] = useState(null);
  const [data, setData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [tab, setTab] = useState("overview");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const photoInput = useRef(null);
  const navigate = useNavigate();

  async function load() {
    const me = await request("get", "/employee/me");
    setAccount(me);
    if (!me.mustChangePassword) setData(await request("get", "/employee/dashboard"));
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    setPhotoUrl("");
    if (!data?.employee?.photoId) return undefined;
    request("get", "/employee/photo", undefined, { responseType: "blob" })
      .then((blob) => {
        if (active) {
          objectUrl = URL.createObjectURL(blob);
          setPhotoUrl(objectUrl);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [data?.employee?.photoId]);

  async function run(action, success = "Your changes have been saved.") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      await load();
      setNotice(success);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function submit(event, action, success) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    return run(async () => {
      await action(form);
      formElement.reset();
    }, success);
  }

  async function signOut() {
    try {
      await request("post", "/auth/admin/logout");
      await navigate({ to: "/login" });
    } catch (e) {
      setError(e.message);
    }
  }

  const employee = data?.employee;
  const assignments = employee?.assignments || [];
  const attendance = employee?.attendance || [];
  const reports = data?.reports || [];
  const today = day(new Date());

  const stats = useMemo(() => {
    const month = today.slice(0, 7);
    const monthRows = attendance.filter((row) => day(row.date).startsWith(month));
    const marked = monthRows.length;
    const credit = monthRows.reduce((sum, row) => sum + (row.status === "PRESENT" ? 1 : row.status === "HALF_DAY" ? 0.5 : 0), 0);
    const counts = attendance.reduce((acc, row) => ({ ...acc, [row.status]: (acc[row.status] || 0) + 1 }), {});
    const monthReports = reports.filter((report) => day(report.date).startsWith(month));
    const reportDays = new Set(reports.map((report) => day(report.date)));
    let streak = 0;
    const cursor = new Date();
    if (!reportDays.has(day(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
    while (reportDays.has(day(cursor))) {
      streak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    return {
      counts,
      rate: marked ? Math.round((credit / marked) * 100) : 0,
      marked,
      monthHours: monthReports.reduce((sum, report) => sum + Number(report.hours || 0), 0),
      streak,
    };
  }, [attendance, reports, today]);

  if (error && !account) return <main className="ed-shell"><div className="ed-gate"><ShieldCheck size={34}/><h1>Employee sign in required</h1><p>{error}</p><Button onClick={() => navigate({ to: "/login" })}>Go to sign in</Button></div></main>;
  if (!account) return <main className="ed-shell"><div className="ed-gate"><span className="ed-spinner"/><p>Loading your workspace…</p></div></main>;

  const firstName = account.name.split(" ")[0];
  const todayReport = reports.find((report) => day(report.date) === today);
  const attendanceByDay = new Map(attendance.map((row) => [day(row.date), row]));
  const heatmap = lastDays(28).map((key) => ({ key, status: attendanceByDay.get(key)?.status }));
  const weekHours = lastDays(7).map((key) => ({
    key,
    hours: reports.filter((report) => day(report.date) === key).reduce((sum, report) => sum + Number(report.hours || 0), 0),
  }));
  const maxHours = Math.max(8, ...weekHours.map((entry) => entry.hours));
  const takeHome = Number(employee?.salary || 0) + Number(employee?.allowances || 0) - Number(employee?.deductions || 0);
  const pendingFeedback = reports.filter((report) => report.status === "NEEDS_UPDATE");

  const header = <header className="ed-topbar">
    <a className="ed-brand" href="/"><span>G</span><strong>Gulsaga<small>EMPLOYEE PORTAL</small></strong></a>
    <div className="ed-topbar-actions">
      <span className="ed-user-chip">{photoUrl ? <img src={photoUrl} alt=""/> : <UserRound size={16}/>}{account.name}</span>
      <Button variant="outline" onClick={signOut}><LogOut size={16}/> Sign out</Button>
    </div>
  </header>;

  const alerts = <>{error && <div className="form-alert" role="alert">{error}</div>}{notice && <div className="form-notice" role="status">{notice}</div>}</>;

  if (account.mustChangePassword) return <main className="ed-shell">{header}
    <div className="ed-main">
      <section className="ed-card ed-secure">
        <div className="ed-secure-icon"><ShieldCheck size={30}/></div>
        <h1>Welcome, {firstName}. Let’s secure your account.</h1>
        <p>You signed in with a temporary password. Choose a new password to open your workspace.</p>
        {alerts}
        <form onSubmit={(event) => submit(event, (form) => request("post", "/employee/change-password", { password: form.get("password") }), "Password updated. Welcome aboard!")}>
          <label className="form-field"><span>New password</span><input name="password" type="password" minLength={12} maxLength={128} required autoComplete="new-password"/><small>At least 12 characters with uppercase, lowercase, number and symbol.</small></label>
          <Button disabled={busy} size="lg">{busy ? "Updating…" : "Update password & continue"}</Button>
        </form>
      </section>
    </div>
  </main>;

  if (!employee) return <main className="ed-shell">{header}<div className="ed-gate">{error ? <p>{error}</p> : <><span className="ed-spinner"/><p>Loading your workspace…</p></>}</div></main>;

  const metric = (Icon, label, value, hint, tone) => <article className={`ed-metric ${tone}`}><span className="ed-metric-icon"><Icon size={20}/></span><div><small>{label}</small><strong>{value}</strong><em>{hint}</em></div></article>;

  return <main className="ed-shell">{header}
    <div className="ed-main">
      <section className="ed-hero">
        <div className="ed-hero-id">
          <button type="button" className="ed-avatar" onClick={() => photoInput.current?.click()} aria-label="Change profile photo">{photoUrl ? <img src={photoUrl} alt={`${account.name} profile`}/> : <UserRound size={34}/>}<span><Camera size={14}/></span></button>
          <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            const form = new FormData();
            form.append("image", file);
            run(() => request("post", "/employee/photo", form), "Profile photo updated.");
          }}/>
          <div><p>{greeting().toUpperCase()}</p><h1>{firstName}, here’s your day.</h1><span>{employee?.jobTitle || "Team member"} · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span></div>
        </div>
        <div className={`ed-hero-cta ${todayReport && todayReport.status !== "NEEDS_UPDATE" ? "done" : ""}`}>
          {todayReport && todayReport.status !== "NEEDS_UPDATE" ? <><CheckCircle2 size={22}/><div><strong>Today’s report is in</strong><span>{reportText[todayReport.status]}</span></div></> : <><Send size={22}/><div><strong>{todayReport ? "Update requested" : "Daily report pending"}</strong><span>Share today’s progress</span></div><Button variant="secondary" onClick={() => setTab("reports")}>Write report</Button></>}
        </div>
      </section>

      {alerts}

      <nav className="ed-tabs" aria-label="Employee workspace sections">{tabs.map(([key, label, Icon]) => <button type="button" key={key} className={tab === key ? "active" : ""} aria-current={tab === key ? "page" : undefined} onClick={() => setTab(key)}><Icon size={16}/>{label}{key === "reports" && pendingFeedback.length > 0 && <b>{pendingFeedback.length}</b>}</button>)}</nav>

      {tab === "overview" && <>
        <section className="ed-metrics">
          {metric(BriefcaseBusiness, "Assigned projects", assignments.length, assignments.length ? "Active assignments" : "Nothing assigned yet", "blue")}
          {metric(TrendingUp, "Attendance this month", `${stats.rate}%`, stats.marked ? `${stats.marked} days recorded` : "No days recorded yet", "green")}
          {metric(Clock3, "Hours this month", stats.monthHours.toFixed(stats.monthHours % 1 ? 1 : 0), `${reports.length} reports in total`, "violet")}
          {metric(Flame, "Report streak", `${stats.streak} day${stats.streak === 1 ? "" : "s"}`, "Consecutive daily reports", "amber")}
        </section>
        <div className="ed-grid">
          <section className="ed-card"><div className="ed-card-head"><div><h2>Hours this week</h2><p>Logged through your daily reports.</p></div></div>
            <div className="ed-bars" aria-label="Hours worked over the last seven days">{weekHours.map(({ key, hours }) => <div key={key}><span style={{ height: `${Math.max(hours ? 8 : 3, (hours / maxHours) * 100)}%` }} className={hours ? "filled" : ""} title={`${hours} hours`}/><small>{hours || "–"}</small><em>{new Date(`${key}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" })}</em></div>)}</div>
          </section>
          <section className="ed-card"><div className="ed-card-head"><div><h2>Last 28 days</h2><p>Your attendance at a glance.</p></div></div>
            <div className="ed-heatmap">{heatmap.map(({ key, status }) => <i key={key} className={status?.toLowerCase() || "none"} title={`${labelDate(key)} · ${statusText[status] || "Not recorded"}`}/>)}</div>
            <div className="ed-legend">{Object.entries(statusText).map(([key, value]) => <span key={key}><i className={key.toLowerCase()}/>{value} · {stats.counts[key] || 0}</span>)}</div>
          </section>
          <section className="ed-card"><div className="ed-card-head"><div><h2>My projects</h2><p>Assigned by your administrator.</p></div><button type="button" className="ed-link" onClick={() => setTab("projects")}>View all</button></div>
            {assignments.length ? assignments.slice(0, 3).map(({ project }) => <div className="ed-row" key={project.id}><span className="ed-dot"/><div><strong>{project.title}</strong><small>{project.category}</small></div></div>) : <p className="ed-empty">No projects have been assigned yet.</p>}
          </section>
          <section className="ed-card ed-pay"><div className="ed-card-head"><div><h2>Monthly compensation</h2><p>Private to you and administrators.</p></div><Wallet size={20}/></div>
            <strong>{money.format(takeHome)}</strong><small>take-home per month</small>
            <dl><div><dt>Base salary</dt><dd>{money.format(Number(employee.salary || 0))}</dd></div><div><dt>Allowances</dt><dd>+ {money.format(Number(employee.allowances || 0))}</dd></div><div><dt>Deductions</dt><dd>− {money.format(Number(employee.deductions || 0))}</dd></div></dl>
          </section>
        </div>
        {pendingFeedback.length > 0 && <section className="ed-card ed-attention"><h2>Needs your attention</h2>{pendingFeedback.map((report) => <div className="ed-row" key={report.id}><div><strong>{report.title}</strong><small>{labelDate(report.date)} · {report.adminFeedback || "Your manager requested an update."}</small></div><button type="button" className="ed-link" onClick={() => setTab("reports")}>Update</button></div>)}</section>}
      </>}

      {tab === "projects" && <section className="ed-card"><div className="ed-card-head"><div><h2>My projects</h2><p>Projects assigned to you by your administrator.</p></div></div>
        {assignments.length ? <div className="ed-projects">{assignments.map(({ project, assignedAt }) => <article key={project.id}><span className="ed-chip">{project.category}</span><h3>{project.title}</h3><p>{project.description}</p><footer><span className={`ed-status ${project.status?.toLowerCase()}`}>{project.status === "LIVE" ? "Live" : "In progress"}</span><small>Assigned {labelDate(assignedAt)}</small>{project.url && <a href={project.url} target="_blank" rel="noreferrer">Open <ArrowUpRight size={14}/></a>}</footer></article>)}</div> : <p className="ed-empty">No projects have been assigned yet.</p>}
      </section>}

      {tab === "attendance" && <div className="ed-grid">
        <section className="ed-card"><div className="ed-card-head"><div><h2>Attendance summary</h2><p>Recorded by your administrator.</p></div></div>
          <div className="ed-attendance-stats">{Object.entries(statusText).map(([key, value]) => <div key={key} className={key.toLowerCase()}><strong>{stats.counts[key] || 0}</strong><span>{value}</span></div>)}</div>
          <div className="ed-heatmap large">{heatmap.map(({ key, status }) => <i key={key} className={status?.toLowerCase() || "none"} title={`${labelDate(key)} · ${statusText[status] || "Not recorded"}`}/>)}</div>
        </section>
        <section className="ed-card"><div className="ed-card-head"><div><h2>Recent records</h2><p>Your latest 15 entries.</p></div></div>
          {attendance.slice(0, 15).map((row) => <div className="ed-row" key={row.id}><div><strong>{labelDate(row.date)}</strong>{row.notes && <small>{row.notes}</small>}</div><span className={`ed-status ${row.status.toLowerCase()}`}>{statusText[row.status]}</span></div>)}
          {!attendance.length && <p className="ed-empty">No attendance has been recorded yet.</p>}
        </section>
      </div>}

      {tab === "reports" && <div className="ed-grid">
        <section className="ed-card"><div className="ed-card-head"><div><h2>Daily work report</h2><p>Share your progress and plan with your team.</p></div></div>
          {todayReport && <div className="ed-today"><strong>Today’s report</strong><span className={`ed-status ${todayReport.status.toLowerCase()}`}>{reportText[todayReport.status]}</span><p>{todayReport.title}</p>{todayReport.adminFeedback && <small>Manager feedback: {todayReport.adminFeedback}</small>}</div>}
          {!todayReport || todayReport.status === "NEEDS_UPDATE" ? <form className="ed-form" onSubmit={(event) => submit(event, (form) => request("post", "/employee/reports", { date: form.get("date"), projectId: form.get("projectId") || null, title: form.get("title"), summary: form.get("summary"), completed: form.get("completed"), blockers: form.get("blockers") || null, nextSteps: form.get("nextSteps") || null, hours: Number(form.get("hours")) }), "Report submitted.")}>
            <div className="ed-form-row"><label className="form-field"><span>Report date</span><input name="date" type="date" defaultValue={today} max={today} required/></label><label className="form-field"><span>Hours worked</span><input name="hours" type="number" min="0.25" max="24" step="0.25" defaultValue="8" required/></label></div>
            <label className="form-field"><span>Project</span><select name="projectId" defaultValue=""><option value="">General / non-project work</option>{assignments.map(({ project }) => <option value={project.id} key={project.id}>{project.title}</option>)}</select></label>
            <label className="form-field"><span>Report title</span><input name="title" minLength={3} maxLength={160} required placeholder="What did you work on?"/></label>
            <label className="form-field"><span>Work summary</span><textarea name="summary" minLength={10} maxLength={3000} required rows={3} placeholder="Summarize your day."/></label>
            <label className="form-field"><span>Completed tasks</span><textarea name="completed" minLength={5} maxLength={5000} required rows={3} placeholder="List completed work."/></label>
            <div className="ed-form-row"><label className="form-field"><span>Blockers</span><textarea name="blockers" maxLength={3000} rows={2} placeholder="Anything blocking you?"/></label><label className="form-field"><span>Next steps</span><textarea name="nextSteps" maxLength={3000} rows={2}/></label></div>
            <Button disabled={busy} size="lg"><Send size={16}/> {busy ? "Submitting…" : "Submit report"}</Button>
          </form> : <p className="ed-empty">Today’s report is already submitted.</p>}
        </section>
        <section className="ed-card"><div className="ed-card-head"><div><h2>Report history</h2><p>Your most recent submissions.</p></div></div>
          {reports.slice(0, 15).map((report) => <article className="ed-report" key={report.id}><div><strong>{report.title}</strong><small>{labelDate(report.date)} · {report.hours} hours{report.project ? ` · ${report.project.title}` : ""}</small>{report.adminFeedback && <p>{report.adminFeedback}</p>}</div><span className={`ed-status ${report.status.toLowerCase()}`}>{reportText[report.status]}</span></article>)}
          {!reports.length && <p className="ed-empty">Your submitted reports will appear here.</p>}
        </section>
      </div>}

      {tab === "profile" && <div className="ed-grid">
        <section className="ed-card"><div className="ed-card-head"><div><h2>My profile</h2><p>Keep your contact details up to date.</p></div></div>
          <dl className="ed-facts"><div><dt>Email</dt><dd>{employee.email}</dd></div><div><dt>Role</dt><dd>{employee.jobTitle}</dd></div><div><dt>Qualification</dt><dd>{employee.qualification}</dd></div><div><dt>Skills</dt><dd>{employee.skills}</dd></div></dl>
          <form className="ed-form" onSubmit={(event) => submit(event, (form) => request("put", "/employee/profile", { mobile: form.get("mobile"), city: form.get("city"), linkedin: form.get("linkedin") || null, github: form.get("github") || null, portfolio: form.get("portfolio") || null }), "Profile updated.")} key={`${employee.mobile}-${employee.city}`}>
            <div className="ed-form-row"><label className="form-field"><span>Mobile (with country code)</span><input name="mobile" defaultValue={employee.mobile} pattern="^\+[1-9]\d{6,14}$" required/></label><label className="form-field"><span>City</span><input name="city" defaultValue={employee.city} minLength={2} maxLength={120} required/></label></div>
            <label className="form-field"><span>LinkedIn URL</span><input name="linkedin" type="url" defaultValue={employee.linkedin || ""}/></label>
            <label className="form-field"><span>GitHub URL</span><input name="github" type="url" defaultValue={employee.github || ""}/></label>
            <label className="form-field"><span>Portfolio URL</span><input name="portfolio" type="url" defaultValue={employee.portfolio || ""}/></label>
            <Button disabled={busy}>Save profile</Button>
          </form>
        </section>
        <section className="ed-card"><div className="ed-card-head"><div><h2>Security</h2><p>Change your password regularly.</p></div><ShieldCheck size={20}/></div>
          <form className="ed-form" onSubmit={(event) => submit(event, (form) => request("post", "/employee/change-password", { currentPassword: form.get("currentPassword"), password: form.get("password") }), "Password changed.")}>
            <label className="form-field"><span>Current password</span><input name="currentPassword" type="password" maxLength={128} required autoComplete="current-password"/></label>
            <label className="form-field"><span>New password</span><input name="password" type="password" minLength={12} maxLength={128} required autoComplete="new-password"/><small>At least 12 characters with uppercase, lowercase, number and symbol.</small></label>
            <Button disabled={busy}>Change password</Button>
          </form>
        </section>
      </div>}
    </div>
  </main>;
}
