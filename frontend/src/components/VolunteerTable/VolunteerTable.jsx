import React, { useState, useRef, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react';
import actionCellRenderer from '../actionCellRenderer.jsx';
import timesClickedCellRenderer from '../timesClickedCellRenderer.jsx';
import avatarCellRenderer from '../avatarCellRenderer.jsx';
import statusCellRenderer from '../statusCellRenderer.jsx';
import { v4 as uuidv4 } from 'uuid';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

//Webworker
//add unit tests

// mdn spread operator

const useCommitRow = () => {
    const [commitRow, setCommitRow] = useState(false);
    return { commitRow, setCommitRow };
}

export const VolunteerTable = ( { isAdmin, manageRowData } ) => {
    const { rowData, addUser, updateUser, deleteUser}  = manageRowData;
    const { commitRow, setCommitRow}  = useCommitRow();

    const gridRef = useRef();
    const [columnDefs] = useState([
        { field: 'name', flex: 16 },
        { field: 'avatar', cellRenderer: avatarCellRenderer, autoHeight: true, flex: 10 },
        { field: 'phone', flex: 12 },
        { field: 'email', flex: 19 },
        { field: 'rating', flex: 6 },
        { field: 'status', cellRenderer: statusCellRenderer, flex: 6 },
        { field: 'hero_project', flex: 9, filter: 'agMultiColumnFilter', sortable: true,},
        { field: 'clickCount', name: 'Times Row Clicked',
        cellRenderer: timesClickedCellRenderer, editable: false, flex: 6 },
        { field: 'actions', cellRenderer: actionCellRenderer, editable: false, width: 210 },
    ]);

    const defaultColDef = useMemo( ()=> ({
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        editable: true,
    }));

    const onRowEditingStarted = (params) => {
        params.api.refreshCells({
            columns: ["actions"],
            rowNodes: [params.node],
            force: true
        });
    };

    const onRowEditingStopped = (params) => {
        params.api.refreshCells({
            columns: ["actions"],
            rowNodes: [params.node],
            force: true
        });
    }

    const revertValues = (api) => {
      while(api.getCurrentUndoSize()) {
        api.undoCellEditing();
      }
    }

    const getRowId = useCallback(function (params) {
        return params.data.id;
    }, [])

    const updateClickCount = (params) => {
        updateUser({...params.data, clickCount: params.data.clickCount + 1});
        params.api.refreshCells({
            columns: ["clickCount"],
            rowNodes: [params.node],
            force: true
        });
    }

    return (
        <div style={{height: '100%', width: '100%' }}>
            <button onClick={() => addUser({id: uuidv4(), name: '-', phone: '-',
            email: '-', rating: '-', status: false, hero_project: '-' })}>Add New Blank User</button>
            <span> *You can add the user's information using the 'Edit' button!</span>
            <AgGridReact
                onRowEditingStopped={onRowEditingStopped}
                onRowEditingStarted={onRowEditingStarted}
                suppressChangeDetection={true}

                undoRedoCellEditing={true}
                undo
                editType='fullRow'
                //click for other page**
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                suppressClickEdit={true}
                onRowClicked={updateClickCount}
                context={{
                    isAdmin,
                    deleteUser,
                    updateUser,
                    setCommitRow
                }}
                onRowValueChanged={(event) => {
                    console.log("row changed", commitRow, event )

                    if (commitRow) {
                        updateUser(event.data)
                    }

                    revertValues(gridRef.current.api);
                    setCommitRow(false)
                }}
                getRowId={getRowId}
            />
        </div>
    )
}