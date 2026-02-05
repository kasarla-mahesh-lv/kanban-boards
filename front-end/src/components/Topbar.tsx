import "./Topbar.css";
export const Topbar=()=>{
  return(
    <div className="topbar">
      <input type="text" className="topbar-search" placeholder="Type to search"/>
      <div className="topbar-actions">
        <div className="topbar-icons">
          <i className="bi bi-sun-fill"></i>

        </div>
        <div className="topbar-icon">
          <i className="bi bi-cloud"></i>

        </div>

      </div>

    </div>
  )
}
