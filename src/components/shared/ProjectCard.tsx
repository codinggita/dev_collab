import { multiFormatDateString } from "@/lib/utils";
import { Link } from "react-router-dom";
import ProjectStats from "./ProjectStats";


const ProjectCard = () => {
  const isCreator = true;
  if(!isCreator) return <div className="post-card">Creator information not available</div>;
  return (
    <div className="post-card">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                <Link to={`/profile/123456}`}>
                    <img 
                        src='/assets/icons/profile-placeholder.svg'
                        alt="creator"
                        className="rounded-full w-12 lg:h-12"
                    />
                </Link>
                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">Md Tauseef Akhtar</p>
                    <div className="flex-center gap-2 text-light-3">
                        <p className="subtle-semibold lg:small-regular">{multiFormatDateString("12/01/2024")}</p>-
                        <p className="subtle-semibold lg:small-regular">Lovely Professional University</p>
                    </div>
                </div>
            </div>
            
            {/*This edit option should only ne visible to the creator of the account*/}
            <Link to={`/update-post/123456`}>
                <img src="/assets/icons/edit.svg" alt="edit" height={20} width={20}/>
            </Link>
        </div>
        
        <Link to={`/posts/123456`}>
            <div className="small-medium lg:base-medium py-5">
                <p>AI In Agriculture</p>
                <ul className="flex gap-1 mt-2">
                    <li className="text-light-3">
                        #AI
                    </li>
                    <li className="text-light-3">
                        #New_Farming
                    </li>
                </ul>
            </div>
            <img 
                src='/assets/icons/profile-placeholder.svg'
                alt="post image"
                className="post-card_img"
            />
        </Link>
        <ProjectStats/>
    </div>
  )
}

export default ProjectCard