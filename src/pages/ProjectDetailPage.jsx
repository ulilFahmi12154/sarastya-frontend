import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import TaskCard from "../components/TaskCard";
import { getProjectById } from "../api/projectsApi";
import { createTask, deleteTask, getTasks, updateTask } from "../api/tasksApi";
import { formatDate, toInputDate, toIsoDate } from "../utils/date";

const STATUS_OPTIONS = ["Todo", "Doing", "Done"];

const initialTaskForm = {
  title: "",
  content: "",
  status: "Todo",
  priority: 1,
  dueDate: "",
};

function toTaskArray(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.tasks)) {
    return payload.tasks;
  }

  return [];
}

function getTaskId(task) {
  return task.id ?? task.taskId;
}

function getTaskProjectId(task) {
  return task.projectId ?? task.ProjectId ?? task.project?.id ?? task.projectID;
}

function buildTaskPayload(task, fallbackProjectId, statusOverride) {
  return {
    projectId: getTaskProjectId(task) || fallbackProjectId,
    title: task.title,
    content: task.content || "",
    status: statusOverride || task.status || "Todo",
    priority: Number(task.priority || 1),
    dueDate: task.dueDate || null,
  };
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialTaskForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const taskStats = useMemo(
    () =>
      STATUS_OPTIONS.reduce((stats, status) => {
        stats[status] = tasks.filter((task) => (task.status || "Todo") === status).length;
        return stats;
      }, {}),
    [tasks]
  );

  const loadProjectData = useCallback(async ({ clearAlert = false } = {}) => {
    setIsLoading(true);

    if (clearAlert) {
      setAlert({ type: "", message: "" });
    }

    try {
      const [projectPayload, taskPayload] = await Promise.all([getProjectById(id), getTasks()]);
      const projectTasks = toTaskArray(projectPayload?.tasks);
      const allTasks = toTaskArray(taskPayload);
      const filteredTasks =
        projectTasks.length > 0
          ? projectTasks
          : allTasks.filter((task) => String(getTaskProjectId(task)) === String(id));

      setProject(projectPayload);
      setTasks(filteredTasks);
    } catch (requestError) {
      setAlert({
        type: "error",
        message: requestError.message || "Detail project belum dapat dimuat.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCreateTask(event) {
    event.preventDefault();
    setAlert({ type: "", message: "" });

    if (!form.title.trim()) {
      setAlert({ type: "error", message: "Judul task wajib diisi." });
      return;
    }

    const payload = {
      projectId: id,
      title: form.title.trim(),
      content: form.content.trim(),
      status: form.status,
      priority: Number(form.priority || 1),
      dueDate: form.dueDate ? toIsoDate(form.dueDate) : null,
    };

    setIsSubmitting(true);

    try {
      await createTask(payload);
      setForm(initialTaskForm);
      setAlert({ type: "success", message: "Task berhasil dibuat." });
      await loadProjectData();
    } catch (requestError) {
      setAlert({
        type: "error",
        message: requestError.message || "Task belum dapat dibuat.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(task, nextStatus) {
    const taskId = getTaskId(task);
    const previousTasks = tasks;
    const nextTasks = tasks.map((item) =>
      getTaskId(item) === taskId ? { ...item, status: nextStatus } : item
    );

    setUpdatingTaskId(taskId);
    setTasks(nextTasks);
    setAlert({ type: "", message: "" });

    try {
      await updateTask(taskId, buildTaskPayload(task, id, nextStatus));
      setAlert({ type: "success", message: "Status task berhasil diperbarui." });
    } catch (requestError) {
      setTasks(previousTasks);
      setAlert({
        type: "error",
        message: requestError.message || "Status task belum dapat diperbarui.",
      });
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDeleteTask(task) {
    const taskId = getTaskId(task);

    if (!window.confirm(`Hapus task "${task.title}"?`)) {
      return;
    }

    setAlert({ type: "", message: "" });

    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((item) => getTaskId(item) !== taskId));
      setAlert({ type: "success", message: "Task berhasil dihapus." });
    } catch (requestError) {
      setAlert({
        type: "error",
        message: requestError.message || "Task belum dapat dihapus.",
      });
    }
  }

  if (isLoading) {
    return (
      <main className="page-shell">
        <Loading text="Memuat detail project..." />
      </main>
    );
  }

  return (
    <main className="page-shell">
      <Link className="back-link" to="/dashboard">
        Kembali ke dashboard
      </Link>

      <section className="page-heading detail-heading">
        <div>
          <p className="eyebrow">Project detail</p>
          <h1>{project?.name || "Project"}</h1>
          <p>{project?.description || "Tidak ada deskripsi project."}</p>
        </div>
        <dl className="detail-dates">
          <div>
            <dt>Mulai</dt>
            <dd>{formatDate(project?.startDate)}</dd>
          </div>
          <div>
            <dt>Selesai</dt>
            <dd>{formatDate(project?.endDate)}</dd>
          </div>
        </dl>
      </section>

      <Alert type={alert.type} message={alert.message} />

      <section className="stats-row">
        {STATUS_OPTIONS.map((status) => (
          <div className="stat-card" key={status}>
            <span>{taskStats[status] || 0}</span>
            <p>{status}</p>
          </div>
        ))}
      </section>

      <section className="content-grid">
        <aside className="form-panel">
          <h2>Create task</h2>
          <form className="form-stack" onSubmit={handleCreateTask}>
            <label className="field">
              <span>Judul task</span>
              <input
                name="title"
                type="text"
                value={form.title}
                onChange={updateField}
                placeholder="Task title"
              />
            </label>

            <label className="field">
              <span>Konten</span>
              <textarea
                name="content"
                value={form.content}
                onChange={updateField}
                rows="4"
                placeholder="Task content"
              />
            </label>

            <div className="two-columns">
              <label className="field">
                <span>Status</span>
                <select name="status" value={form.status} onChange={updateField}>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Prioritas</span>
                <input
                  name="priority"
                  type="number"
                  min="1"
                  max="5"
                  value={form.priority}
                  onChange={updateField}
                />
              </label>
            </div>

            <label className="field">
              <span>Due date</span>
              <input
                name="dueDate"
                type="date"
                value={toInputDate(form.dueDate)}
                onChange={updateField}
              />
            </label>

            <button className="button button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Create Task"}
            </button>
          </form>
        </aside>

        <section className="list-panel">
          <div className="section-heading">
            <div>
              <h2>Task project</h2>
              <p>{tasks.length} task terhubung ke project ini.</p>
            </div>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => loadProjectData({ clearAlert: true })}
            >
              Refresh
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <h3>Belum ada task</h3>
              <p>Buat task pertama untuk project ini lewat form di samping.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <TaskCard
                  key={getTaskId(task)}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  isUpdating={updatingTaskId === getTaskId(task)}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
