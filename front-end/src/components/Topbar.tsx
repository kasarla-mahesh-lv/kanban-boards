import './Topbar.css';

export const Topbar = () => {
  return (
    <div className="container-fluid mt-3 topbar">
      <div className="d-flex align-items-center justify-content-between">


        <input
          type="text"
          className="form-control topbar-search"
          placeholder="Type to search"
        />

        
        <div className="d-flex align-items-center gap-3">
          <div className="topbar-icon">
            <i className="bi bi-sun-fill"></i>
          </div>
          <div className="topbar-icon">
            <i className="bi bi-cloud"></i>
            
          </div>
        </div>

      </div>
    </div>
  );
};