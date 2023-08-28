import React, {useEffect, useState} from 'react';
import { VolunteerTable } from './VolunteerTable';

function addUser(existingData, newUser) {
    return [{...newUser, clickCount: 0}, ...existingData];
}

function updateUser(existingData, updatedUser) {
    return existingData.map(user => {
        if (user.id === updatedUser.id) {
            return updatedUser;
        }
        return user;
    });
}

function deleteUser(existingData, deletedUserId) {
    return existingData.filter(user => user.id !== deletedUserId);
}

const useManageRowData = () => {
    const [rowData, setRowData] = useState();

    useEffect(() => {
        // Fetch data from the API endpoint
        fetch('http://localhost:5000/api/bog/users')
            .then(response => response.json())
            .then(rowData => setRowData(rowData.map(user => ({...user, clickCount: 0}))))
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    //  https://react.dev/reference/react/useState#setstate
    return {
        rowData,
        addUser: (newUser) => {
            setRowData((existingRowData) => addUser(existingRowData, newUser));
        },
        updateUser: (updatedUser) => {
            setRowData((existingRowData) => updateUser(existingRowData, updatedUser));
        },
        deleteUser: (deletedUserId) => {
            setRowData((existingRowData) => deleteUser(existingRowData, deletedUserId));
        },
    }
}

export const VolunteerTableDataProvider = ({isAdmin}) => {
    const manageRowData = useManageRowData();
    return <VolunteerTable isAdmin={isAdmin} manageRowData={manageRowData}/>
}