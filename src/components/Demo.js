import cn from 'classnames';
import { useEffect, useState, useCallback } from 'react';
import {Tabs, Tab} from './Tabs';
import SDKPanel from './Panels/SDK/SDKPanel';
import APIPanel from './Panels/API/APIPanel';


import Workspace from './Workspace';
import WorkspaceModal from './WorkspaceModal';

import { useAvailableWorkspaces, useAvailableWorkspacesDispatch } from './Context/AvailableWorkspacesContext';
import SelectAvailableWorkspaces from './Utils/SelectAvailableWorkspaces';
import { useEventLogsDispatch } from './Context/EventLogsContext';
import SelectableList from './Utils/SelectableList';
import { useWorkspace, useOpenWorkspacesDispatch, useOpenWorkspaces } from './Context/OpenWorkspacesContext';
import Alert from './Utils/Alert';

const loadSDK = () => {
    console.log('loadSDK');
    (function(d, s, id){
        window.SE_BASE = "containers.sphere-engine.com";
        window.SE_HTTPS = true;
        window.SE = window.SE || (window.SE = []);
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = (window.SE_HTTPS ? "https" : "http") + "://" + window.SE_BASE + "/static/sdk/sdk.min.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "sphere-engine-jssdk"));
    window.SE.ready = function(f){if (document.readyState !== "loading" && document.readyState !== "interactive") f();else window.addEventListener("load", f);};
};

loadSDK();

const WORKSPACE_DISPLAY_STATE = {
    NONE: 'none',
    SHOW: 'show',
    HIDE: 'hide',
};

const WORKSPACE_LAYOUT = {
    SMALL: 'small',
    BIG: 'big',
};

const TABS = {
    API: 'api',
    SDK: 'sdk',
    WORKSPACES: 'workspaces',
};

function Demo() {

    const [activeTab, setActiveTab] = useState(TABS.API);

    const openWorkspaces = useOpenWorkspaces();

    // Standard workspace (left side of main page)
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [workspaceDisplayState, setWorkspaceDisplayState] = useState(WORKSPACE_DISPLAY_STATE.NONE);
    const shouldRenderWorkspace = [WORKSPACE_DISPLAY_STATE.SHOW, WORKSPACE_DISPLAY_STATE.HIDE].includes(workspaceDisplayState);
    const shouldShowWorkspace = WORKSPACE_DISPLAY_STATE.SHOW === workspaceDisplayState;
    const [renderWorkspace, setRenderWorkspace] = useState(null);
    const workspace = useWorkspace(renderWorkspace);
    const [workspaceLayout, setWorkspaceLayout] = useState(WORKSPACE_LAYOUT.BIG);

    // SDK Events
    const eventLogsDispatch = useEventLogsDispatch();

    // Modals
    const [selectedWorkspaceModal, setSelectedWorkspaceModal] = useState(null);
    const [workspacesInModals, setWorkspacesInModals] = useState([]);
    const [openedModal, setOpenedModal] = useState(null);
    const [openModalError, setOpenModalError] = useState(null);

    const openWorkspacesDispatch = useOpenWorkspacesDispatch();
    const availableWorkspacesDispatch = useAvailableWorkspacesDispatch();
    const availableWorkspaces = useAvailableWorkspaces();

    // We should load SDK before we decide to load a Workspace component.
    useEffect(() => {
        loadSDK();
    }, []);

    // Auto load the workspace
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const workspaceId = urlParams.get('workspace_id');
        if (workspaceId) {
            availableWorkspacesDispatch({
                type: 'add',
                workspaceId: workspaceId,
            });
        }

        if (urlParams.get('auto_load')) {
            setWorkspaceDisplayState(WORKSPACE_DISPLAY_STATE.SHOW);
            setActiveTab(TABS.WORKSPACES);
        }
    }, [availableWorkspacesDispatch]);

    useEffect(() => {
        if (selectedWorkspace === null && availableWorkspaces.length > 0) {
            setSelectedWorkspace(availableWorkspaces[0]);
        }
        if (selectedWorkspace !== null && availableWorkspaces.length === 0) {
            setSelectedWorkspace(null);
        }
    }, [selectedWorkspace, availableWorkspaces]);

    useEffect(() => {
        if (selectedWorkspace && workspaceDisplayState !== WORKSPACE_DISPLAY_STATE.NONE) {
            setRenderWorkspace(selectedWorkspace);
        } else {
            setRenderWorkspace(null);
        }

    }, [selectedWorkspace, workspaceDisplayState, openWorkspacesDispatch]);

    useEffect(() => {
        if (renderWorkspace) {
            openWorkspacesDispatch({
                type: 'add',
                workspaceId: renderWorkspace,
                displayMode: 'standard',
            });
        }
        return () => {
            if (renderWorkspace) {
                openWorkspacesDispatch({
                    type: 'delete',
                    workspaceId: renderWorkspace,
                });
            }
        };
    }, [renderWorkspace, openWorkspacesDispatch]);

    const onEvent = useCallback((e) => {
        eventLogsDispatch({
            type: 'add',
            event: e,
        });
    }, [eventLogsDispatch]);

    const openWorkspaceInModal = (workspaceId) => {
        if (!workspaceId) {
            return;
        }

        if (openWorkspaces.find((w) => w.workspaceId === workspaceId && w.displayMode === 'standard')) {
            setOpenModalError('Workspace is already open in the left panel');
            return;
        }

        if (!workspacesInModals.includes(workspaceId)) {
            openWorkspacesDispatch({
                type: 'add',
                workspaceId: workspaceId,
                displayMode: 'modal',
            });
            setWorkspacesInModals([
                ...workspacesInModals,
                workspaceId,
            ]);
        }
        setOpenedModal(workspaceId);
    };

    const closeWorkspaceModal = (workspaceId) => {
        if (openedModal === workspaceId) {
            setOpenedModal(null); 
        }
        setWorkspacesInModals(workspacesInModals.filter((w) => w !== workspaceId));
        openWorkspacesDispatch({
            type: 'delete',
            workspaceId: workspaceId,
        });
    };

    let nextWorkspace = null;
    let previousWorkspace = null;
    if (selectedWorkspace && availableWorkspaces.length > 0) {
        const index = availableWorkspaces.indexOf(selectedWorkspace);
        if (index + 1 < availableWorkspaces.length) {
            nextWorkspace = availableWorkspaces[(index + 1)];
        }
        if (index > 0) {
            previousWorkspace = availableWorkspaces[index - 1];
        }
    }

    const modalComponents = [];
    if (workspacesInModals.length > 0) {
        workspacesInModals.forEach((workspaceId, index) => {
            modalComponents.push(
                <WorkspaceModal
                    key={workspaceId}
                    workspaceId={workspaceId}
                    show={workspaceId === openedModal}
                    onHide={() => { setOpenedModal(null) }}
                    onClose={() => { closeWorkspaceModal(workspaceId) }}
                    onEvent={onEvent}
                />
            )
        });
    }

    return (
        <div style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
            <div style={{ flexGrow: '1', height: '100%', border: '1px solid #ccc' }}>
                renderWorkspace: {renderWorkspace} &nbsp;
                workspaceDisplayState: {workspaceDisplayState}
                {
                    (renderWorkspace) &&
                    (
                        <div 
                            style={{ 
                                width: workspaceLayout === WORKSPACE_LAYOUT.BIG ? '100%' : '80%', 
                                height: workspaceLayout === WORKSPACE_LAYOUT.BIG ? '100%' : '80%', 
                                display: shouldShowWorkspace ? 'block' : 'none' 
                            }}
                        >
                            <Workspace 
                                key={renderWorkspace} 
                                workspaceId={renderWorkspace} 
                                subscribeEvents={workspace ? workspace.subscribedEvents : []} 
                                onEvent={onEvent} 
                            />
                        </div>
                    )
                }
            </div>
            <div style={{ width: '600px', padding: '5px', overflow: 'scroll' }}>
                <div>
                    <Tabs>
                        <Tab isActive={activeTab === TABS.API} onChange={() => { setActiveTab('api') }}>API</Tab>
                        <Tab isActive={activeTab === TABS.SDK} onChange={() => { setActiveTab('sdk') }}>SDK</Tab>
                        <Tab isActive={activeTab === TABS.WORKSPACES} onChange={() => { setActiveTab('workspaces') }}>Workspaces</Tab>
                    </Tabs>
                </div>

                <div className={cn('tab-content', { 'show': activeTab === TABS.API })}>
                    <APIPanel />
                </div>

                <div className={cn('tab-content', { 'show': activeTab === TABS.SDK })}>
                    <SDKPanel />
                </div>

                <div className={cn('tab-content', { 'show': activeTab === TABS.WORKSPACES })}>

                    {/* <div>
                        <button onClick={() => {loadSDK()}}>Reload SDK</button>
                    </div> */}

                    <div>
                        <h3>Manage displaying the workspaces</h3>

                        <div>
                            <SelectAvailableWorkspaces
                                selectedWorkspace={selectedWorkspace} 
                                onChange={setSelectedWorkspace}
                            />
                        </div>

                        <div style={{marginTop: '1rem'}}>
                            <button onClick={() => { setWorkspaceDisplayState(WORKSPACE_DISPLAY_STATE.SHOW) }} disabled={!selectedWorkspace || shouldRenderWorkspace}>Render workspace (the workspace SDK method)</button>
                            <button onClick={() => { setWorkspaceDisplayState(WORKSPACE_DISPLAY_STATE.NONE) }} disabled={!selectedWorkspace || !shouldRenderWorkspace}>Destroy workspace (the destroy SDK method)</button>
                        </div>
                        
                        <div style={{marginTop: '1rem'}}>
                            <button onClick={() => { setSelectedWorkspace(previousWorkspace) }} disabled={!shouldRenderWorkspace || !previousWorkspace}>Load previous workspace</button>
                            <button onClick={() => { setSelectedWorkspace(nextWorkspace) }} disabled={!shouldRenderWorkspace || !nextWorkspace}>Load next workspace</button> <br />
                        </div>

                        <div style={{marginTop: '1rem'}}>
                            <button onClick={() => { setWorkspaceDisplayState(WORKSPACE_DISPLAY_STATE.HIDE)}} disabled={!selectedWorkspace || !shouldRenderWorkspace || !shouldShowWorkspace}>Hide workspace</button>
                            <button onClick={() => { setWorkspaceDisplayState(WORKSPACE_DISPLAY_STATE.SHOW)}} disabled={!selectedWorkspace || !shouldRenderWorkspace || shouldShowWorkspace}>Show workspace</button> <br />
                            
                            Layout &nbsp;
                            <SelectableList
                                selectedItem={workspaceLayout}
                                items={[
                                    [WORKSPACE_LAYOUT.BIG, 'big'],
                                    [WORKSPACE_LAYOUT.SMALL, 'small'],
                                ]}
                                onChange={(val) => {setWorkspaceLayout(val)}}
                                disabled={!selectedWorkspace || !shouldRenderWorkspace}
                            />
                        </div>
                    </div>

                    <div>
                        <h3>Manage displaying the workspaces in modals</h3>

                        {openModalError && (
                            <Alert type='danger' onClose={() => {setOpenModalError(null)}}>
                                {openModalError}
                            </Alert>
                        )}

                        <div>
                            <SelectAvailableWorkspaces
                                selectedWorkspace={selectedWorkspaceModal} 
                                onChange={setSelectedWorkspaceModal}
                            />
                        </div>
                        <button onClick={() => { openWorkspaceInModal(selectedWorkspaceModal) }} disabled={!selectedWorkspaceModal}>Open workspace in modal</button>

                        <h4>Hidden modals</h4>

                        {workspacesInModals.map((workspaceId) => {
                            return (<div key={workspaceId}>
                                {workspaceId}
                                <button onClick={() => { openWorkspaceInModal(workspaceId) }}>open</button>
                                <button onClick={() => { closeWorkspaceModal(workspaceId) }}>close</button>
                            </div>)
                        })}
                        {workspacesInModals.length === 0 && (<div>No modals</div>)}
                    </div>
                </div>
            </div>

            {modalComponents}
        </div>
    );
}

export default Demo;
