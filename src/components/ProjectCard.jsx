import { Link } from "react-router-dom";
import { formatDate } from "../utils/date";

function getProjectId(project) {
  return project.id ?? project.projectId;
}

export default function ProjectCard({ project, onEdit, onDelete }) {
  const projectId = getProjectId(project);

  return (
    <article className="card project-card">
      <div className="card-header">
        <div>
          <h3>{project.name}</h3>
          <p>{project.description || "Tidak ada deskripsi project."}</p>
        </div>
      </div>

      <dl className="meta-list">
        <div>
          <dt>Mulai</dt>
          <dd>{formatDate(project.startDate)}</dd>
        </div>
        <div>
          <dt>Selesai</dt>
          <dd>{formatDate(project.endDate)}</dd>
        </div>
      </dl>

      <div className="card-actions">
        <Link className="button button-primary" to={`/projects/${projectId}`}>
          Lihat Detail
        </Link>
        <button className="button button-secondary" type="button" onClick={() => onEdit(project)}>
          Edit
        </button>
        <button className="button button-danger" type="button" onClick={() => onDelete(project)}>
          Delete
        </button>
      </div>
    </article>
  );
}
