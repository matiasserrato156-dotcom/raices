function ArtesanoCard({ image, name, location, specialty }) {
  return (
    <div className="card h-100 border-0 shadow-sm">

      <img
        src={image}
        className="card-img-top"
        alt={name}
        style={{
          height: "260px",
          objectFit: "cover"
        }}
      />

      <div className="card-body">

        <h5 className="fw-bold">
          {name}
        </h5>

        <p className="mb-1">
          <i className="bi bi-geo-alt me-2"></i>
          {location}
        </p>

        <p className="text-muted mb-0">
          {specialty}
        </p>

      </div>

    </div>
  );
}

export default ArtesanoCard;