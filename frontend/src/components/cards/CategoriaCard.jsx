function CategoriaCard({ icon, title, description }) {
  return (
    <div className="card h-100 border-0 shadow-sm text-center">
      <div className="card-body p-4">

        <div className="fs-1 mb-3">
          <i className={`bi ${icon}`}></i>
        </div>

        <h5 className="fw-bold">
          {title}
        </h5>

        <p className="text-muted mb-0">
          {description}
        </p>

      </div>
    </div>
  );
}

export default CategoriaCard;