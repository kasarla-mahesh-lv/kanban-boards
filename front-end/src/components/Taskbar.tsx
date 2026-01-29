
import './Taskbar.css';
export const Taskbar = () => {
  return (
    <div className="container-fluid main-div">
        <div>
               <div className="d-flex gap-2 align-items-center breadcrum-line">
               <a href="#"className="active text-decoration-none">Projects</a>
               <i className="bi bi-chevron-left "></i>
               <span className='fw-semibold'>Luvetha tech</span>
               


            

             </div>
             <h2 className='project-title'>LuvethaTech</h2>
             <div className='d-flex gap-4 align-items-center meta-line'>
                <span><strong>Timeline:</strong>Jan-Mar</span>
                <span><strong>Client:</strong>Luvetha</span>
                <span><strong>Status:</strong>In Progress</span>
                <span><strong>Assignees:</strong>-</span>
             </div>
             <div>
                <ul className="d-flex gap-4 nav-line">
                    <li ><a href="">Task Board</a></li>
                    <li ><a href="">Timeline</a></li>
                    <li><a href="">Updates</a></li>
                </ul>

             </div>

        </div>
     
        
    </div>
  )
}
