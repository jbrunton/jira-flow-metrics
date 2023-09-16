import { useParams } from "react-router-dom";

export const ProjectsIndexPage = () => {
  const { domainId } = useParams();
  return <>
    <span>Projects for domain {domainId}</span>
  </>
}
