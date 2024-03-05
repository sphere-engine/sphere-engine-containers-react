import { createContext, useReducer, useContext } from 'react';
import settings from '../../settings';

const OpenWorkspacesContext = createContext(null);
const OpenWorkspacesDispatchContext = createContext(null);

export const OpenWorkspacesProvider = ({ children }) => {
    const [workspaces, dispatch] = useReducer(
        workspacesReducer,
        []
    );

    return (
        <OpenWorkspacesContext.Provider value={workspaces}>
            <OpenWorkspacesDispatchContext.Provider value={dispatch}>
                {children}
            </OpenWorkspacesDispatchContext.Provider>
        </OpenWorkspacesContext.Provider>
    );
}

export const useOpenWorkspaces = () => {
    return useContext(OpenWorkspacesContext);
}

export const useOpenWorkspacesDispatch = () => {
    return useContext(OpenWorkspacesDispatchContext);
}

export const useWorkspace = (workspaceId) => {
    const openWorkspaces = useOpenWorkspaces();
    return openWorkspaces.find((w) => w.workspaceId === workspaceId) || null;
};

const workspacesReducer = (workspaces, action) => {
    const findWorkspace = (workspaceId) => {
      return workspaces.find((w) => w.workspaceId === workspaceId) || null;
    };

    switch (action.type) {
      case 'add': {
        if (workspaces.filter(w => w.workspaceId === action.workspaceId).length > 0) {
            return workspaces;
        } else {
            return [...workspaces, {
                workspaceId: action.workspaceId,
                subscribedEvents: [
                  ...settings.SDK_EVENTS,
                ],
                displayMode: action.displayMode || 'standard',
            }];
        }
      }
      case 'delete': {
        return workspaces.filter(w => w.workspaceId !== action.workspaceId);
      }
      case 'subscribeEvent': {
        const workspace = findWorkspace(action.workspaceId);

        if (!workspace) {
            return workspaces;
        }

        // Invalid list
        if (!settings.SDK_EVENTS.includes(action.event)) {
            return workspaces;
        }

        // Event is already in the list.
        if (workspace.subscribedEvents.includes(action.event)) {
            return workspaces;
        }

        return workspaces.map((w) => {
            if (w.workspaceId === action.workspaceId) {
                return {
                    ...w,
                    subscribedEvents: [
                        ...w.subscribedEvents,
                        action.event,
                    ],
                };
            } else {
                return w;
            }
        });
      }
      case 'unsubscribeEvent': {
        const workspace = findWorkspace(action.workspaceId);

        if (!workspace) {
            return workspaces;
        }

        return workspaces.map((w) => {
            if (w.workspaceId === action.workspaceId) {
                return {
                    ...w,
                    subscribedEvents: w.subscribedEvents.filter((e) => e !== action.event),
                };
            } else {
                return w;
            }
        });
      }
      case 'unsubscribeAllEvents': {
        const workspace = findWorkspace(action.workspaceId);

        if (!workspace) {
            return workspaces;
        }

        return workspaces.map((w) => {
            if (w.workspaceId === action.workspaceId) {
                return {
                    ...w,
                    subscribedEvents: [],
                };
            } else {
                return w;
            }
        });
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
