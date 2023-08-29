import React, { useState, useRef, useMemo, useCallback } from 'react';
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

export const VolunteerTable = ({ isAdmin, manageRowData }) => {
    const { rowData, addUser, updateUser, deleteUser } = manageRowData;
    const { commitRow, setCommitRow } = useCommitRow();

    const gridRef = useRef();
    const [columnDefs] = useState([
        { field: 'name', flex: 16 },
        { field: 'avatar', cellRenderer: avatarCellRenderer, autoHeight: true, flex: 10 },
        { field: 'phone', flex: 12 },
        { field: 'email', flex: 19 },
        { field: 'rating', flex: 6 },
        { field: 'status', cellRenderer: statusCellRenderer, flex: 6 },
        { field: 'hero_project', flex: 9, filter: 'agMultiColumnFilter', sortable: true, },
        {
            field: 'clickCount', name: 'Times Row Clicked',
            cellRenderer: timesClickedCellRenderer, editable: false, flex: 6
        },
        { field: 'actions', cellRenderer: actionCellRenderer, editable: false, width: 210 },
    ]);

    const defaultColDef = useMemo(() => ({
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
        while (api.getCurrentUndoSize()) {
            api.undoCellEditing();
        }
    }

    const getRowId = useCallback(function (params) {
        return params.data.id;
    }, [])

    const updateClickCount = (params) => {
        updateUser({ ...params.data, clickCount: params.data.clickCount + 1 });
        params.api.refreshCells({
            columns: ["clickCount"],
            rowNodes: [params.node],
            force: true
        });
    }

    const presetUsers = [
        {
            name: 'Crewmate',
            avatar: 'https://pbs.twimg.com/media/EjqiMPXU4AI7yUl.jpg',
            phone: '123-456-7890',
            email: 'sussybaka@imposter.com',
            rating: 'sus',
            status: false,
            hero_project: 'among us',
        },
        {
            name: 'Rick Sanchez',
            avatar: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            phone: '844-667-3742',
            email: 'szechuansauce@morty.com',
            rating: 'infinity',
            status: false,
            hero_project: 'portal gun',
        },
        {
            name: 'Rick Astley',
            avatar: 'https://media.tenor.com/yheo1GGu3FwAAAAd/rick-roll-rick-ashley.gif',
            phone: '778-330-2389',
            email: 'ROLLEDYA@haha.com',
            rating: '10',
            status: false,
            hero_project: 'microphone',
        },
        {
            name: 'Peanut Butter Baby',
            avatar: 'https://media.tenor.com/9jwOnmGLwxEAAAAM/ah-kid-peanut-butter-baby.gif',
            phone: '404-404-4040',
            email: 'ah@ah.com',
            rating: '8',
            status: false,
            hero_project: 'peanut butter',
        },
        {
            name: 'Kimberly "Sweet Brown" Wilkins',
            avatar: 'https://upload.wikimedia.org/wikipedia/en/2/25/Ain%27t_nobody_got_time_for_that_screengrab.jpg',
            phone: '123-456-7809',
            email: 'aintnobodygottimeforthat@gmail.com',
            rating: '10',
            status: false,
            hero_project: 'apartment',
        },
        {
            name: 'Steve Rogers',
            avatar: 'https://i.ytimg.com/vi/EUbtP09Fqok/hqdefault.jpg',
            phone: '678-136-7092',
            email: 'noidontthinkiwill@america.com',
            rating: '10',
            status: false,
            hero_project: 'avengers',
        },
        {
            name: 'Khaled Mohamed Khaled',
            avatar: 'https://media.tenor.com/T9t2IwjbS3oAAAAd/dj-khaled.gif',
            phone: '310-273-6700',
            email: 'wedabestmusic@golfing.com',
            rating: '10',
            status: false,
            hero_project: 'another one',
        },
    ];

    const addRandomUser = () => {
        const randomIndex = Math.floor(Math.random() * presetUsers.length);
        const randomUser = presetUsers[randomIndex];
        const newUser = { ...randomUser, id: uuidv4() };
        addUser(newUser);
    };

    if (isAdmin) {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <button onClick={addRandomUser}>Add New User</button>
                <span> *You can add the user's information using the 'Edit' button!
                    ALSO (delete 'admin/' from the end of the url to go to viewer mode)</span>
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
                        console.log("row changed", commitRow, event)

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
    } else {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <span>(add '/admin/' to the end of the url to enter admin mode)</span>
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
                        console.log("row changed", commitRow, event)

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
}