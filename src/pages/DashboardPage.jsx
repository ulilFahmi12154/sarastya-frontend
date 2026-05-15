import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import ProjectCard from "../components/ProjectCard";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../api/projectsApi";
import { formatDate, todayInputDate, toInputDate, toIsoDate } from "../utils/date";

const createInitialProjectForm = () => ({
  name: "",
  description: "",
  startDate: todayInputDate(),
  endDate: "",
});

function toProjectArray(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.projects)) {
    return payload.projects;
  }

  return [];
}

function getProjectId(project) {
  return project.id ?? project.projectId;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(createInitialProjectForm);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const editingProjectId = useMemo(
    () => (editingProject ? getProjectId(editingProject) : null),
    [editingProject]
  );

  const loadProjects = useCallback(async ({ clearAlert = false } = {}) => {
    setIsLoading(true);

    if (clearAlert) {
      setAlert({ type: "", message: "" });
    }

    try {
      const payload = await getProjects();
      setProjects(toProjectArray(payload));
    } catch (requestError) {
      setAlert({
        type: "error",
        message: requestError.message || "Project belum dapat dimuat.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setEditingProject(null);
    setForm(createInitialProjectForm());
  }

  function startEdit(project) {
    setEditingProject(project);
    setForm({
      name: project.name || "",
      description: project.description || "",
      startDate: toInputDate(project.startDate) || todayInputDate(),
      endDate: toInputDate(project.endDate),
    });
    setAlert({ type: "info", message: `Mengedit project "${project.name}".` });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setAlert({ type: "", message: "" });

    if (!form.name.trim()) {
      setAlert({ type: "error", message: "Nama project wajib diisi." });
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      startDate: toIsoDate(form.startDate || todayInputDate()),
      endDate: form.endDate ? toIsoDate(form.endDate) : null,
    };

    setIsSubmitting(true);

    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, payload);
        setAlert({ type: "success", message: "Project berhasil diperbarui." });
      } else {
        await createProject(payload);
        setAlert({ type: "success", message: "Project berhasil dibuat." });
      }

      resetForm();
      await loadProjects();
    } catch (requestError) {
      setAlert({
        type: "error",
        message: requestError.message || "Project belum dapat disimpan.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(project) {
    const projectId = getProjectId(project);

    if (!window.confirm(`Hapus project "${project.name}"? Semua task terkait juga dapat terhapus.`)) {
      return;
    }

    setAlert({ type: "", message: "" });

    try {
      await deleteProject(projectId);
      setProjects((current) => current.filter((item) => getProjectId(item) !== projectId));
      setAlert({ type: "success", message: "Project berhasil dihapus." });
    } catch (requestError) {
      setAlert({
        type: "error",
        message: requestError.message || "Project belum dapat dihapus.",
      });
    }
  }

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Projects</h1>
          <p>Kelola daftar project dan pantau pekerjaan utama dari satu halaman.</p>
        </div>
        <div className="summary-pill">
          <span>{projects.length}</span>
          <small>Total project</small>
        </div>
      </section>

      <Alert type={alert.type} message={alert.message} />

      <section className="content-grid">
        <aside className="form-panel">
          <h2>{editingProject ? "Edit project" : "Create project"}</h2>
          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field">
              <span>Nama project</span>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={updateField}
                placeholder="Project Name"
              />
            </label>

            <label className="field">
              <span>Deskripsi</span>
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows="4"
                placeholder="Project description"
              />
            </label>

            <div className="two-columns">
              <label className="field">
                <span>Tanggal mulai</span>
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={updateField}
                />
              </label>

              <label className="field">
                <span>Tanggal selesai</span>
                <input name="endDate" type="date" value={form.endDate} onChange={updateField} />
              </label>
            </div>

            <div className="form-actions">
              <button className="button button-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : editingProject ? "Update Project" : "Create Project"}
              </button>
              {editingProject && (
                <button className="button button-secondary" type="button" onClick={resetForm}>
                  Batal
                </button>
              )}
            </div>
          </form>
        </aside>

        <section className="list-panel">
          <div className="section-heading">
            <div>
              <h2>Daftar project</h2>
              <p>Hari ini: {formatDate(new Date().toISOString())}</p>
            </div>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => loadProjects({ clearAlert: true })}
              >
                Refresh
              </button>
          </div>

          {isLoading ? (
            <Loading text="Memuat project..." />
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <h3>Belum ada project</h3>
              <p>Buat project pertama kamu lewat form di samping.</p>
            </div>
          ) : (
            <div className="card-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={getProjectId(project)}
                  project={project}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
