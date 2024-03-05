import { createContext, useReducer, useContext } from 'react';

const AvailableWorkspacesContext = createContext(null);
const AvailableWorkspaceDispatchContext = createContext(null);

export function AvailableWorkspacesProvider({ children }) {
    const [workspaces, dispatch] = useReducer(
        workspacesReducer,
        []
    );

    return (
        <AvailableWorkspacesContext.Provider value={workspaces}>
            <AvailableWorkspaceDispatchContext.Provider value={dispatch}>
                {children}
            </AvailableWorkspaceDispatchContext.Provider>
        </AvailableWorkspacesContext.Provider>
    );
}

export function useAvailableWorkspaces() {
    return useContext(AvailableWorkspacesContext);
}

export function useAvailableWorkspacesDispatch() {
    return useContext(AvailableWorkspaceDispatchContext);
}

function workspacesReducer(workspaces, action) {
    switch (action.type) {
      case 'add': {
        if (workspaces.find(w => w === action.workspaceId)) {
            return workspaces;
        } else {
            return [
                ...workspaces, 
                action.workspaceId,
            ];
        }
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
