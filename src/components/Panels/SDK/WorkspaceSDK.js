import { useState } from "react";
import EventSubscribe from './EventSubscribe.js';
import EventList from './EventList.js';
import SelectableList from "../../Utils/SelectableList.js";
import Alert from "../../Utils/Alert.js";
import { useWorkspace } from "../../Context/OpenWorkspacesContext.js";

const WorkspaceSDK = ({ workspaceId }) => {

    const STAGES = ['init', 'build', 'run', 'test', 'post'];
    const STREAMS = ['output', 'error'];

    const [filePath, setFilePath] = useState('HELLO.md');
    const [stage, setStage] = useState('run');
    const [stream, setStream] = useState('output');
    const [errorMessage, setErrorMessage] = useState(null);
    const workspace = useWorkspace(workspaceId);
    const subscribedEvents = workspace ? workspace.subscribedEvents : [];

    const getFileContent = () => {
        window.SE.ready(function() {
            const elemId = `workspace_${workspaceId}`;
            const SEWorkspace = window.SE.workspace(elemId);
            if (!SEWorkspace) {
                setErrorMessage(`${elemId} not found in the SDK`);
                return;
            }

            SEWorkspace.getFileContent(filePath);
        });
    };
    
    const getStageStream = () => {
        window.SE.ready(function() {
            const elemId = `workspace_${workspaceId}`;
            const SEWorkspace = window.SE.workspace(elemId);
            if (!SEWorkspace) {
                setErrorMessage(`${elemId} not found in the SDK`);
                return;
            }

            SEWorkspace.getStageStream(stage, stream);
        });
    };

    return (
        <div>
            <h4>methods</h4>
            {errorMessage && <Alert type='danger' onClose={() => {setErrorMessage(null)}}>{errorMessage}</Alert>}

            <div>
                <div>
                    <input value={filePath} onChange={(e) => {setFilePath(e.target.value)}} />
                    <button onClick={getFileContent}>getFileContent</button>
                </div>

                <div>
                    <SelectableList selectedItem={stage} items={STAGES.map((s) => [s, s])} onChange={setStage} />
                    <SelectableList selectedItem={stream} items={STREAMS.map((s) => [s, s])} onChange={setStream} />
                    <button onClick={getStageStream}>getStageStream</button>
                </div>
            </div>

            <h4>Events</h4>

            <div style={{marginTop: '20px'}}>
                <EventSubscribe key={workspaceId} workspaceId={workspaceId} />
            </div>

            <div style={{marginTop: '20px'}}>
                <strong>Subscribed events:</strong>
                <EventList events={subscribedEvents} />
            </div>
        </div>
    );
};

export default WorkspaceSDK;
