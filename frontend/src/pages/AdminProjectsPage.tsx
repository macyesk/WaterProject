import { useEffect, useState } from 'react';
import { Project } from '../types/Project';
import { fetchProjects } from '../api/ProjectsAPI';
import Pagination from '../components/Pagination';
import NewProjectForm from '../components/NewProjectForm';

function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects(pageSize, pageNum, []);
        setProjects(data.projects);
        setTotalPages(Math.ceil(data.totalNumberProjects / pageSize));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [pageSize, pageNum]);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <div>
        <h1>Admin - Projects</h1>

        {!showForm && (
          <button
            className="btn btn-success mb-3"
            onClick={() => setShowForm(true)}
          >
            Add Project
          </button>
        )}

        {showForm && (
          <NewProjectForm
            onSuccess={() => {
              setShowForm(false);
              fetchProjects(pageSize, pageNum, []).then((data) =>
                setProjects(data.projects)
              );
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Regional Program</th>
              <th>Impact</th>
              <th>Phase</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.projectId}>
                <td>{p.projectId}</td>
                <td>{p.projectName}</td>
                <td>{p.projectType}</td>
                <td>{p.projectRegionalProgram}</td>
                <td>{p.projectImpact}</td>
                <td>{p.projectPhase}</td>
                <td>{p.projectFunctionalityStatus}</td>
                <td>
                  <button
                    onClick={() => console.log(`Edit project ${p.projectId}`)}
                    className="btn btn-success"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => console.log(`Delete project ${p.projectId}`)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={pageNum}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPageNum(1);
          }}
        />
      </div>
    </>
  );
}

export default AdminProjectsPage;
