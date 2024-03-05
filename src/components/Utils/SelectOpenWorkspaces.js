import { useCallback } from "react";
import { useOpenWorkspaces } from "../Context/OpenWorkspacesContext";
import SelectableList from "./SelectableList";

const SelectAvailableWorkspaces = ({selectedWorkspace, onChange}) => {

    const workspaces = useOpenWorkspaces();

    const changeWorkspace = useCallback((workspaceId) => {
        onChange && onChange(workspaceId);
    }, [onChange]);

    const emptyList = (<div>Open any workspace first</div>);

    return (
        <SelectableList 
            items={workspaces.map((w) => [w.workspaceId, `${w.workspaceId} (${w.displayMode})`])} 
            selectedItem={selectedWorkspace}
            onChange={changeWorkspace} 
            emptyList={emptyList} 
        />
    );
};

export default SelectAvailableWorkspaces;
