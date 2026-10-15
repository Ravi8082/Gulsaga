import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Check, Copy, Eye, ImagePlus, KeyRound, LoaderCircle, Pencil, Plus, RefreshCw, Trash2, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { request } from "@/lib/gulsags/api";

const statuses = [
  ["PRESENT", "Present"],
  ["ABSENT", "Absent"],
  ["HALF_DAY", "Half-day"],
  ["LEAVE", "Leave"],
];
const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});
const attendanceDate = (value) => new Date(value).toISOString().slice(0, 10);

export function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [hiredApplications, setHiredApplications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [profileMode, setProfileMode] = useState("view");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [attendanceStatus, setAttendanceStatus] = useState("PRESENT");
  const [attendanceDateValue, setAttendanceDateValue] = useState(attendanceDate(new Date()));
  const [showManual, setShowManual] = useState(false);
  const [hiringApplicant, setHiringApplicant] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const profileFormRef = useRef(null);

  useEffect(() => {
    let active = true;
    setError("");
    Promise.all([
      request("get", "/admin/employees", undefined, { params: { page: 1, search } }),
      request("get", "/admin/employees/hired-applications"),
    ])
      .then(([data, applications]) => {
        if (active) {
          setEmployees(data.rows);
          setHiredApplications(applications);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [search, refresh]);

  useEffect(() => {
    request("get", "/admin/employees/assignable-projects")
      .then(setProjects)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    setPhotoUrl("");
    if (!selected?.photoId) return undefined;
    request("get", `/admin/employees/${selected.id}/photo`, undefined, { responseType: "blob" })
      .then((blob) => {
        if (active) {
          objectUrl = URL.createObjectURL(blob);
          setPhotoUrl(objectUrl);
        }
      })
      .catch((e) => {
        if (active && e.message !== "Employee photo not found.") setError(e.message);
      });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selected?.id, selected?.photoId]);

  async function loadEmployee(id, mode = "view") {
    setError("");
    setNote("");
    setBusy(true);
    try {
      setSelected(await request("get", `/admin/employees/${id}`));
      setProfileMode(mode);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteEmployee(employee) {
    const confirmed = window.confirm(
      `Delete ${employee.name}'s employee profile? Their project assignments, attendance and daily reports will also be permanently deleted. This cannot be undone.`,
    );
    if (!confirmed) return;
    setBusy(true);
    setError("");
    setNote("");
    try {
      await request("delete", `/admin/employees/${employee.id}`);
      setEmployees((current) => current.filter((row) => row.id !== employee.id));
      setNote(`${employee.name}'s employee profile was deleted.`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function createManualEmployee(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());
    for (const key of ["salary", "allowances", "deductions"]) data[key] = Number(data[key] || 0);
    for (const key of ["linkedin", "github", "portfolio"]) if (!data[key]) data[key] = null;
    setBusy(true);
    setError("");
    setNote("");
    try {
      const result = await request("post", "/admin/employees/manual", data);
      setCredentials(result.credentials);
      setNote(`${result.employee.name} added to the employee directory.`);
      setShowManual(false);
      setRefresh((value) => value + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function createHiredEmployee(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      applicationId: hiringApplicant.id,
      email: form.get("email"),
      salary: Number(form.get("salary")),
      allowances: Number(form.get("allowances") || 0),
      deductions: Number(form.get("deductions") || 0),
    };
    setBusy(true);
    setError("");
    setNote("");
    try {
      const result = await request("post", "/admin/employees", data);
      setCredentials(result.credentials);
      setNote(`${result.employee.name}'s employee account is ready.`);
      setHiringApplicant(null);
      setRefresh((value) => value + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function resetCredentials(email = selected.email) {
    setBusy(true);
    setError("");
    try {
      const result = await request("post", `/admin/employees/${selected.id}/credentials/reset`, { email });
      setSelected((current) => ({ ...current, email: result.email }));
      setCredentials({ email: result.email, temporaryPassword: result.temporaryPassword });
      setNote("Company login email saved and a new temporary password generated. The employee must change this password at sign-in.");
      setRefresh((value) => value + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function reviewReport(event, reportId) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setNote("");
    try {
      await request("patch", `/admin/employees/${selected.id}/reports/${reportId}`, {
        status: form.get("status"),
        adminFeedback: form.get("adminFeedback"),
      });
      await loadEmployee(selected.id);
      setNote("Daily report feedback saved.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());
    for (const key of ["salary", "allowances", "deductions"]) data[key] = Number(data[key]);
    setBusy(true);
    setError("");
    setNote("");
    try {
      await request("put", `/admin/employees/${selected.id}`, data);
      setRefresh((value) => value + 1);
      await loadEmployee(selected.id);
      setNote("Employee information and salary saved.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhoto(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file || !selected) return;
    const data = new FormData();
    data.append("image", file);
    setBusy(true);
    setError("");
    try {
      await request("post", `/admin/employees/${selected.id}/photo`, data);
      await loadEmployee(selected.id);
      setNote("Employee photo updated.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      input.value = "";
    }
  }

  async function assignProject(event) {
    event.preventDefault();
    const projectId = new FormData(event.currentTarget).get("projectId");
    if (!projectId) return;
    setBusy(true);
    setError("");
    try {
      await request("post", `/admin/employees/${selected.id}/projects`, { projectId });
      await loadEmployee(selected.id);
      setNote("Project assigned.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeProject(projectId) {
    setBusy(true);
    setError("");
    try {
      await request("delete", `/admin/employees/${selected.id}/projects/${projectId}`);
      await loadEmployee(selected.id);
      setNote("Project assignment removed.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveAttendance(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await request("put", `/admin/employees/${selected.id}/attendance`, {
        date: form.get("date"),
        status: attendanceStatus,
        notes: form.get("notes") || null,
      });
      await loadEmployee(selected.id);
      setNote("Attendance saved.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!selected) {
    return (
      <>
        <div className="admin-heading">
          <div>
            <p className="eyebrow">GULSAGA ADMINISTRATION</p>
            <h1>Employees</h1>
            <p className="admin-heading-description">Private employee profiles, salary and attendance.</p>
          </div>
          <div className="employee-heading-actions"><Button variant="outline" onClick={() => setShowManual((value) => !value)}><Plus size={16}/> Add employee</Button><Button variant="outline" size="icon" aria-label="Refresh employees" onClick={() => setRefresh((value) => value + 1)}><RefreshCw /></Button></div>
        </div>
        {error && <div className="form-alert" role="alert">{error}</div>}
        {note && <div className="form-notice" role="status">{note}</div>}
        {credentials && <div className="employee-credentials" role="status"><KeyRound/><div><strong>Share these temporary sign-in details securely</strong><span>Email: {credentials.email}</span><code>{credentials.temporaryPassword}</code><small>This password is shown once and must be changed at first sign-in.</small></div><Button variant="outline" size="sm" onClick={async () => { try { await navigator.clipboard.writeText(`Email: ${credentials.email}\nTemporary password: ${credentials.temporaryPassword}`); setNote("Temporary credentials copied."); } catch { setError("Could not copy credentials. Copy them manually before leaving this page."); } }}><Copy size={14}/> Copy</Button><Button variant="ghost" size="icon" aria-label="Dismiss temporary credentials" onClick={() => setCredentials(null)}><Trash2 size={15}/></Button></div>}
        {hiredApplications.length > 0 && <section className="employee-panel hired-applications"><div className="employee-panel-heading"><Users size={18}/><div><h2>Hired applicants ready for accounts</h2><p>Application details are already saved. Set a company-issued login email and salary to create each dashboard account.</p></div></div>{hiredApplications.map((applicant)=><article className="hired-applicant" key={applicant.id}><span><strong>{applicant.name}</strong><small>{applicant.job.title} · Application email: {applicant.email}</small></span><Button size="sm" disabled={busy} onClick={()=>setHiringApplicant(applicant)}><Plus size={15}/> Set up employee account</Button></article>)}</section>}
        {hiringApplicant && <form className="employee-panel employee-hire-form" onSubmit={createHiredEmployee}><div className="employee-panel-heading"><Users size={18}/><div><h2>Set up {hiringApplicant.name}’s employee account</h2><p>Personal, job and application details are filled from the application. Add the company email used to sign in and set compensation.</p></div></div><div className="employee-hire-summary"><span><small>APPLICANT</small><strong>{hiringApplicant.name}</strong></span><span><small>POSITION</small><strong>{hiringApplicant.job.title}</strong></span><span><small>APPLICATION EMAIL</small><strong>{hiringApplicant.email}</strong></span><span><small>MOBILE</small><strong>{hiringApplicant.mobile}</strong></span></div><div className="form-grid employee-hire-fields"><label className="form-field"><span>Company-issued login email</span><input name="email" type="email" required maxLength={255} placeholder="employee@yourcompany.com"/></label>{[["salary","Base monthly salary"],["allowances","Monthly allowances"],["deductions","Monthly deductions"]].map(([name,title])=><label className="form-field" key={name}><span>{title} (INR)</span><input name={name} type="number" min="0" max="999999999.99" step="0.01" defaultValue="0" required/></label>)}</div><p className="employee-password-note">A strong temporary password will be generated after account setup and shown once. The employee must change it after signing in.</p><div className="employee-heading-actions"><Button type="submit" disabled={busy}>{busy?"Setting up account…":"Create employee account"}</Button><Button type="button" variant="outline" disabled={busy} onClick={()=>setHiringApplicant(null)}>Cancel</Button></div></form>}
        {showManual && <form className="employee-panel employee-manual-form" onSubmit={createManualEmployee}>
          <div className="employee-panel-heading"><Plus size={18}/><div><h2>Create employee manually</h2><p>Create the account here; the system generates a temporary password after saving, which you share securely with the employee.</p></div></div>
          <section className="employee-form-section"><h3>Employee and login details</h3><p>The email address is the employee’s login ID. You can edit it later from the profile.</p><div className="form-grid">
            {[["name","Full name"],["email","Login email address","email"],["mobile","Mobile number (+country code)"],["jobTitle","Job title"],["qualification","Qualification"],["experience","Experience"],["city","City"]].map(([name,title,type])=><label className="form-field" key={name}><span>{title}</span><input name={name} type={type||"text"} required /></label>)}
            {[["skills","Skills"],["introduction","Short introduction"]].map(([name,title])=><label className="form-field wide" key={name}><span>{title}</span><textarea name={name} minLength={name==="introduction"?20:2} maxLength={name==="introduction"?5000:2000} rows={3} required/></label>)}
            {[["linkedin","LinkedIn URL"],["github","GitHub URL"],["portfolio","Portfolio URL"]].map(([name,title])=><label className="form-field" key={name}><span>{title}<small>Optional</small></span><input name={name} type="url"/></label>)}
          </div></section>
          <section className="employee-form-section employee-new-salary"><h3>Monthly salary (INR)</h3><p>Enter the employee’s base pay and any monthly adjustments. The employee can only see their own total.</p><div className="form-grid">
            {[["salary","Base monthly salary"],["allowances","Monthly allowances"],["deductions","Monthly deductions"]].map(([name,title])=><label className="form-field" key={name}><span>{title}</span><input name={name} type="number" min="0" max="999999999.99" step="0.01" defaultValue="0" required/></label>)}
          </div></section>
          <div className="employee-heading-actions"><Button type="submit" disabled={busy}>{busy?"Creating account…":"Create account and generate password"}</Button><Button type="button" variant="outline" onClick={()=>setShowManual(false)}>Cancel</Button></div>
        </form>}
        <label className="search-input employee-search">
          <Users size={17} />
          <input aria-label="Search employees" placeholder="Search by name, email or job title" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <div className="employee-directory">
          {employees.map((employee) => (
            <article className="employee-directory-card" key={employee.id}>
              <span className="employee-directory-avatar"><Users size={20} /></span>
              <span className="employee-directory-copy">
                <strong>{employee.name}</strong>
                <span>{employee.jobTitle} · {employee.email}</span>
              </span>
              <span className={`employee-status ${employee.status.toLowerCase()}`}>{employee.status}</span>
              <span className="employee-pay">{money.format(Number(employee.salary) + Number(employee.allowances) - Number(employee.deductions))}<small>monthly take-home</small></span>
              <span className="employee-row-actions">
                <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => loadEmployee(employee.id, "view")}><Eye size={14}/> View</Button>
                <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => loadEmployee(employee.id, "edit")}><Pencil size={14}/> Edit</Button>
                <Button type="button" variant="outline" size="sm" className="employee-delete-button" disabled={busy} onClick={() => deleteEmployee(employee)}><Trash2 size={14}/> Delete</Button>
              </span>
            </article>
          ))}
          {!employees.length && !error && <div className="empty-state">No employee profiles yet. Select Add employee to create an employee account.</div>}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-heading employee-profile-heading">
        <div>
          <Button variant="ghost" className="employee-back" onClick={() => { setSelected(null); setNote(""); setError(""); setCredentials(null); }}>
            <ArrowLeft size={16} /> Employees
          </Button>
          <p className="eyebrow">{profileMode === "edit" ? "EDIT EMPLOYEE" : "EMPLOYEE PROFILE"}</p>
          <h1>{selected.name}</h1>
          <p className="admin-heading-description">{selected.jobTitle} · {selected.email}</p>
        </div>
        <div className="employee-profile-actions">
        <label className="employee-photo-upload">
          {photoUrl ? <img src={photoUrl} alt={`${selected.name} profile`} /> : <ImagePlus />}
          <span>Update photo</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} />
        </label>
        </div>
      </div>
      {error && <div className="form-alert" role="alert">{error}</div>}
      {note && <div className="form-notice" role="status">{note}</div>}
      {credentials && <div className="employee-credentials" role="status"><KeyRound/><div><strong>Share this temporary password securely</strong><span>Email: {credentials.email}</span><code>{credentials.temporaryPassword}</code><small>This password is shown once and must be changed at the next sign-in.</small></div><Button variant="outline" size="sm" onClick={async () => { try { await navigator.clipboard.writeText(`Email: ${credentials.email}\nTemporary password: ${credentials.temporaryPassword}`); setNote("Temporary credentials copied."); } catch { setError("Could not copy credentials. Copy them manually before leaving this page."); } }}><Copy size={14}/> Copy</Button><Button variant="ghost" size="icon" aria-label="Dismiss temporary password" onClick={() => setCredentials(null)}><Trash2 size={15}/></Button></div>}
      <nav className="employee-profile-nav" aria-label="Employee profile sections">
        <a href="#employee-account"><UserRound size={15}/> Account & contact</a>
        <a href="#employee-salary"><span className="employee-nav-currency">₹</span> Salary</a>
        <a href="#employee-projects"><BriefcaseBusiness size={15}/> Projects</a>
        <a href="#employee-attendance"><Check size={15}/> Attendance</a>
        <a href="#employee-reports"><KeyRound size={15}/> Daily reports</a>
      </nav>
      {profileMode === "view" && <div className="employee-view-toolbar"><span><Eye size={15}/> Viewing employee profile</span><Button onClick={() => setProfileMode("edit")}><Pencil size={15}/> Edit employee</Button></div>}
      <section className="employee-panel employee-login-panel">
        <div className="employee-panel-heading"><KeyRound size={18}/><div><h2>Company login and password</h2><p>Set the company-issued login email here. Generate a new temporary password here when onboarding or resetting access.</p></div></div>
        <div className="employee-login-summary"><span><small>COMPANY LOGIN EMAIL</small><strong>{selected.email}</strong></span>{profileMode==="edit"&&<Button variant="outline" onClick={()=>resetCredentials(new FormData(profileFormRef.current).get("email"))} disabled={busy}><KeyRound size={15}/> Save email & generate password</Button>}</div>
      </section>
      <form ref={profileFormRef} className="employee-profile-form" onSubmit={saveProfile} key={`${selected.id}-${profileMode}`}>
        <section className="employee-panel">
          <div id="employee-account" className="employee-anchor"></div><div className="employee-panel-heading"><Users size={18} /><div><h2>Employee and login details</h2><p>Update the email used to sign in, contact information and employee profile.</p></div></div>
          <div className="form-grid">
            {[
              ["name", "Full name"], ["email", "Email", "email"], ["mobile", "Mobile"], ["jobTitle", "Job title"],
              ["qualification", "Qualification"], ["experience", "Experience"], ["city", "City"],
              ["linkedin", "LinkedIn URL"], ["github", "GitHub URL"], ["portfolio", "Portfolio URL"],
            ].map(([name, title, type]) => (
              <label className="form-field" key={name}><span>{title}</span><input name={name} type={type || "text"} defaultValue={selected[name] || ""} required={!["linkedin", "github", "portfolio"].includes(name)} readOnly={profileMode === "view"} /></label>
            ))}
            <label className="form-field"><span>Employment status</span><select name="status" defaultValue={selected.status} disabled={profileMode === "view"}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></label>
            <label className="form-field wide"><span>Skills</span><textarea name="skills" rows={3} defaultValue={selected.skills} required readOnly={profileMode === "view"} /></label>
            <label className="form-field wide"><span>Introduction</span><textarea name="introduction" rows={4} defaultValue={selected.introduction} required readOnly={profileMode === "view"} /></label>
          </div>
        </section>
        <section className="employee-panel" id="employee-salary">
          <div className="employee-panel-heading"><span className="employee-currency">₹</span><div><h2>Monthly salary</h2><p>Private to administrators. Net amount is salary + allowances − deductions.</p></div></div>
          <div className="form-grid">
            {[["salary", "Base salary"], ["allowances", "Monthly allowances"], ["deductions", "Monthly deductions"]].map(([name, title]) => (
              <label className="form-field" key={name}><span>{title} (INR)</span><input name={name} type="number" min="0" max="999999999.99" step="0.01" defaultValue={Number(selected[name])} required readOnly={profileMode === "view"} /></label>
            ))}
            <div className="employee-net-pay"><span>Monthly take-home estimate</span><strong>{money.format(Number(selected.salary) + Number(selected.allowances) - Number(selected.deductions))}</strong></div>
          </div>
        </section>
        {profileMode === "edit" && <div className="employee-heading-actions"><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save employee information"} <Check size={16} /></Button><Button type="button" variant="outline" disabled={busy} onClick={() => setProfileMode("view")}>Cancel</Button></div>}
      </form>
      <section className="employee-panel" id="employee-projects">
        <div className="employee-panel-heading"><BriefcaseBusiness size={18} /><div><h2>Assigned projects</h2><p>Projects this employee is working on.</p></div></div>
        <form className="employee-assign-form" onSubmit={assignProject}>
          <select name="projectId" aria-label="Select a project" defaultValue=""><option value="">Choose a project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.title} · {project.category}</option>)}</select>
          <Button type="submit" disabled={busy}><Plus size={16} /> Assign project</Button>
        </form>
        <div className="employee-assignment-list">
          {selected.assignments.map(({ project, assignedAt }) => <div key={project.id}><span><strong>{project.title}</strong><small>{project.category} · assigned {new Date(assignedAt).toLocaleDateString("en-IN")}</small></span><Button variant="ghost" size="icon" aria-label={`Remove ${project.title}`} disabled={busy} onClick={() => removeProject(project.id)}><Trash2 size={16} /></Button></div>)}
          {!selected.assignments.length && <p className="empty-state">No projects assigned yet.</p>}
        </div>
      </section>
      <section className="employee-panel" id="employee-attendance">
        <div className="employee-panel-heading"><Check size={18} /><div><h2>Daily attendance</h2><p>Choose a date and mark it Present (green), Absent (red), Half-day (yellow) or Leave (blue).</p></div></div>
        <form className="employee-attendance-form" onSubmit={saveAttendance}>
          <label className="form-field"><span>Date</span><input name="date" type="date" value={attendanceDateValue} onChange={(event) => setAttendanceDateValue(event.target.value)} required /></label>
          <fieldset className="employee-attendance-options"><legend>Attendance status</legend>{statuses.map(([value, title]) => <label className={`attendance-choice ${value.toLowerCase()}`} key={value}><input type="radio" name="attendanceStatus" checked={attendanceStatus === value} onChange={() => setAttendanceStatus(value)} />{title}</label>)}</fieldset>
          <label className="form-field"><span>Notes (optional)</span><input name="notes" maxLength={500} placeholder="Optional note for this date" /></label>
          <Button type="submit" disabled={busy}>Save attendance</Button>
        </form>
        <div className="employee-attendance-list">
          {selected.attendance.map((entry) => <div key={entry.id}><time dateTime={attendanceDate(entry.date)}>{new Date(`${attendanceDate(entry.date)}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time><span className={`attendance-badge ${entry.status.toLowerCase()}`}>{entry.status.replace("_", " ")}</span><small>{entry.notes || "—"}</small></div>)}
          {!selected.attendance.length && <p className="empty-state">No attendance entries recorded yet.</p>}
        </div>
      </section>
      <section className="employee-panel" id="employee-reports">
        <div className="employee-panel-heading"><BriefcaseBusiness size={18} /><div><h2>Daily work reports</h2><p>Review employee-submitted progress and provide feedback.</p></div></div>
        <div className="employee-admin-reports">{selected.reports.map((report) => <article key={report.id}><div className="employee-report-summary"><div><strong>{report.title}</strong><small>{attendanceDate(report.date)} · {report.hours} hours{report.project ? ` · ${report.project.title}` : ""}</small></div><span className={`report-status ${report.status.toLowerCase()}`}>{report.status.replace("_", " ")}</span></div><p><strong>Summary:</strong> {report.summary}</p><p><strong>Completed:</strong> {report.completed}</p>{report.blockers && <p><strong>Blockers:</strong> {report.blockers}</p>}{report.nextSteps && <p><strong>Next steps:</strong> {report.nextSteps}</p>}{report.adminFeedback && <p className="employee-existing-feedback"><strong>Previous feedback:</strong> {report.adminFeedback}</p>}<form className="employee-report-review" onSubmit={(event)=>reviewReport(event,report.id)}><select name="status" defaultValue={report.status==="NEEDS_UPDATE"?"NEEDS_UPDATE":"REVIEWED"} aria-label="Report review status"><option value="REVIEWED">Reviewed</option><option value="NEEDS_UPDATE">Request update</option></select><input name="adminFeedback" minLength={2} maxLength={3000} defaultValue={report.adminFeedback||""} placeholder="Feedback for the employee" required/><Button size="sm" disabled={busy}>Save review</Button></form></article>)}{!selected.reports.length&&<p className="empty-state">No daily reports submitted yet.</p>}</div>
      </section>
    </>
  );
}
