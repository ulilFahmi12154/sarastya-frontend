import { formatDate } from "../utils/date";

const STATUS_OPTIONS = ["Todo", "Doing", "Done"];

export default function TaskCard({ task, onEdit, onStatusChange, onDelete, isUpdating = false }) {
  return (
    <article className="card task-card">
      <div className="task-topline">
        <div>
          <h3>{task.title}</h3>
          <p>{task.content || "Tidak ada catatan tambahan."}</p>
        </div>
        <span className={`status-badge status-${String(task.status || "Todo").toLowerCase()}`}>
          {task.status || "Todo"}
        </span>
      </div>

      <dl className="meta-list">
        <div>
          <dt>Prioritas</dt>
          <dd>{task.priority ?? 1}</dd>
        </div>
        <div>
          <dt>Due date</dt>
          <dd>{formatDate(task.dueDate)}</dd>
        </div>
      </dl>

      <div className="task-actions">
        <label className="field compact-field">
          <span>Status</span>
          <select
            value={task.status || "Todo"}
            disabled={isUpdating}
            onChange={(event) => onStatusChange(task, event.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <button className="button button-secondary" type="button" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="button button-danger" type="button" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </article>
  );
}
