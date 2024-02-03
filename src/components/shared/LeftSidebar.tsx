import { Link, NavLink} from "react-router-dom"
import { Button } from "../ui/button"
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSidebar = () => {
  
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
            <img
              src="/assets/images/logoNew.png"
              alt="logo"
              width={220}
              height={130}
            />
        </Link>

        <Link to={`/profile/123456`} className="flex gap-3 items-center">
          <img 
            src="/assets/icons/profile-placeholder.svg"
            alt="profile"
            className="h-14 w-14 rounded-full" 
          />
          <div className="flex flex-col">
            <p className="body-bold">
              Md Tauseef Akhtar
            </p>

            <p className="small-regular text-light-3">
              @mdtauseef123
            </p>

          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            return (
              <li key={link.label} className={`leftsidebar-link group`}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img 
                    src={link.imgURL}
                    alt={link.label}
                    className="group-hover:invert-white"
                  />
                  {link.label}
                </NavLink>
              </li> 
            );
          })}
        </ul>
      </div>

      {/*Log Out Functionality*/}
      <Button variant="ghost" className="shad-button_ghost">
        <img src="/assets/icons/logout.svg" alt="" /> 
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar