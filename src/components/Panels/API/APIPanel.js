import { useState } from 'react';
// import { api } from '../../../seco_api';
// import settings from '../../../settings';
import { useAvailableWorkspacesDispatch } from '../../Context/AvailableWorkspacesContext';
// import SelectableList from '../../Utils/SelectableList';
import Alert from '../../Utils/Alert';


const APIPanel = () => {
    // const [accessToken, setAccessToken] = useState(settings.DEFAULT_ACCESS_TOKEN);
    const [responseStatus, setResponseStatus] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    // const [projects, setProjects] = useState([]);
    // const [selectedProject, setSelectedProject] = useState(null);
    const availableWorkspacesDispatch = useAvailableWorkspacesDispatch();
    const [workspacesTextbox, setWorkspacesTextbox] = useState('not_found\nf3e6665e78754bef80d62e9e7a11abe7');

    // const createWorkspace = async () => {
    //     try {
    //         const workspace = await api.createWorkspace(accessToken, selectedProject);
    //         availableWorkspacesDispatch({
    //             type: 'add',
    //             workspaceId: workspace.id,
    //         });
    //         setResponseStatus('success');
    //         setResponseMessage(`workspace ${workspace.id} has been created`);
    //     } catch (error) {
    //         console.error(error);
    //         setResponseStatus('error');
    //         setResponseMessage(error.toString());
    //     }
    // }

    // const loadProjects = async () => {
    //     try {
    //         const projects = await api.listProjects(accessToken);
    //         setProjects(projects.map((p) => {return {id: p.id, name: p.name};}));
    //         if (selectedProject === null) {
    //             setSelectedProject(projects[0].id);
    //         }
    //         setResponseStatus('success');
    //         if (projects.length > 0) {
    //             setResponseMessage(`loaded ${projects.length} project(s)`);
    //         } else {
    //             setResponseMessage(`no projects found`);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         setResponseStatus('error');
    //         setResponseMessage(error.toString());
    //     }
    // }

    // const loadRunningWorkspaces = async () => {
    //     try {
    //         const runningWorkspaces = await api.getRunningWorkspaces(accessToken);
    //         runningWorkspaces.forEach(w => {
    //             availableWorkspacesDispatch({
    //                 type: 'add',
    //                 workspaceId: w.id,
    //             });
    //         });
    //         setResponseStatus('success');
    //         if (runningWorkspaces.length > 0) {
    //             setResponseMessage(`loaded ${runningWorkspaces.length} workspace(s)`);
    //         } else {
    //             setResponseMessage(`no running workspaces found`);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         setResponseStatus('error');
    //         setResponseMessage(error.toString());
    //     }
    // }

    const loadWorkspacesFromText = (text) => {
        const ids = text.split('\n');
        let countLoadedWorkspaces = 0;
        ids.forEach((id) => {
            if (!id) {
                return;
            }

            availableWorkspacesDispatch({
                type: 'add',
                workspaceId: id,
            });
            countLoadedWorkspaces++;
        });

        if (countLoadedWorkspaces > 0) {
            setResponseStatus('success');
            setResponseMessage(`${countLoadedWorkspaces} workspaces has been loaded`);
        }
    };
    
    return (
        <>
            <div style={{marginTop: '1rem'}}>
                {responseMessage && 
                    <Alert type={responseStatus === 'success' ? 'success' : 'danger'} onClose={() => {setResponseMessage(null)}}>
                        {responseMessage}
                    </Alert>
                }
            </div>
            {/* <div>
                <h2>API (don't use directly SECO API at the frontend!)</h2>

                <div>
                    Access token: <br />
                    <input value={accessToken} onChange={(e) => {setAccessToken(e.target.value)}} style={{width: '300px'}}></input>
                </div>

                <div style={{marginTop: '1rem'}}>
                    <button onClick={loadRunningWorkspaces} disabled={!accessToken}>Load running workspaces</button>
                    <button onClick={loadProjects} disabled={!accessToken}>Load projects</button>
                </div>
            </div> */}

            {/* <div>
                <h3>Create workspace</h3>
                
                <div>
                    Project &nbsp; 
                    <SelectableList 
                        items={projects.map((p) => [p.id, p.name])} 
                        selectedItem={selectedProject} 
                        onChange={setSelectedProject}
                    />
                </div>
                <div style={{marginTop: '1rem'}}>
                    <button onClick={createWorkspace} disabled={!accessToken || !selectedProject}>Create</button>
                </div>
            </div> */}

            <div>
                <h3>Load workspaces from list (one workspace ID per line)</h3>

                <textarea
                    style={{
                        width: '100%',
                    }}
                    rows={10}
                    value={workspacesTextbox}
                    onChange={e => setWorkspacesTextbox(e.target.value)}
                />
                <button onClick={() => {loadWorkspacesFromText(workspacesTextbox)}}>Load workspaces</button>
            </div>
        </>
    );
};

export default APIPanel;
