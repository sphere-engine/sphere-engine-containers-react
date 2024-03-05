import { useState } from 'react';
import EventLogs from './EventLogs.js';
import WorkspaceSDK from '../../WorkspaceSDK.js';
import SelectOpenWorkspaces from '../../Utils/SelectOpenWorkspaces.js';
import { useEventLogs, useEventLogsDispatch } from '../../Context/EventLogsContext.js';

const SDKPanel = () => {

    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const eventLogs = useEventLogs();
    const eventLogsDispatch = useEventLogsDispatch();

    const onClearLogs = () => {
        eventLogsDispatch({type: 'clear'});
    };

    return (
        <>
            <h3>Manage workspace using SDK</h3>

            <SelectOpenWorkspaces 
                selectedWorkspace={selectedWorkspace} 
                onChange={(w) => {
                    setSelectedWorkspace(w);
                }}
            />

            {selectedWorkspace && 
            <WorkspaceSDK 
                workspaceId={selectedWorkspace}
            />
            }

            <hr />

            <h3>Last events</h3>

            <div>
                <button onClick={onClearLogs}>Clear logs</button>
            </div>
            <EventLogs 
                events={eventLogs}
            />
        </>
    );
};

export default SDKPanel;
