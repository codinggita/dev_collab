import PostForm from "@/components/forms/PostForm"

const CreateProject = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img 
            src="/assets/icons/add-post.svg" 
            height={36}
            width={36}
            alt="add-post"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Publish Project</h2>
        </div>
        <PostForm/>
      </div>
      
    </div>
  )
}

export default CreateProject;