import { useCallback, useEffect } from "react";
import { useAvailableWorkspaces } from "../Context/AvailableWorkspacesContext";
import SelectableList from "./SelectableList";

const SelectAvailableWorkspaces = ({selectedWorkspace, onChange}) => {

    const workspaces = useAvailableWorkspaces();

    const changeWorkspace = useCallback((workspaceId) => {
        onChange && onChange(workspaceId);
    }, [onChange]);

    useEffect(() => {
        if (workspaces.length > 0) {
            if (selectedWorkspace === null) {
                changeWorkspace(workspaces[0]);
            }
        } else {
            changeWorkspace(null);
        }
    }, [changeWorkspace, selectedWorkspace, workspaces]);

    const emptyList = (<div>Create or load workspaces first</div>);

    return (
        <SelectableList 
            items={workspaces.map((w) => [w, w])} 
            selectedItem={selectedWorkspace}
            onChange={changeWorkspace} 
            emptyList={emptyList} 
        />
    );
};

export default SelectAvailableWorkspaces;
