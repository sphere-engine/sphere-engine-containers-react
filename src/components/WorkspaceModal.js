import Workspace from './Workspace';
import Modal from './Modal';
import { useEffect } from 'react';
import { useOpenWorkspacesDispatch, useWorkspace } from './Context/OpenWorkspacesContext';

function WorkspaceModal({workspaceId, show, onHide, onClose, onEvent}) {

    const openWorkspacesDispatch = useOpenWorkspacesDispatch();
    const workspace = useWorkspace(workspaceId);

    useEffect(() => {
        console.log(`WorkspaceModal ${workspaceId} mount`);
        return () => {
            console.log(`WorkspaceModal ${workspaceId} unmount`);
        };
    }, [openWorkspacesDispatch, workspaceId]);

    return (
        <Modal
            show={show} 
            header={'Workspace ID: ' + workspaceId}
            onHide={onHide}
            onClose={onClose}
        >
        <Workspace 
            workspaceId={workspaceId} 
            subscribeEvents={workspace.subscribedEvents} 
            onEvent={onEvent}
        />
        </Modal>
    );
}

export default WorkspaceModal;