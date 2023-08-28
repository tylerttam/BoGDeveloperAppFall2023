import React, { useCallback} from 'react';
import { useNavigate } from 'react-router-dom';


// https://blog.ag-grid.com/full-row-editing-ag-grid-committing-changes-button-click/
export default (props) => {
  
  const invokeDeleteMethod = () => {
      props.context.deleteUser(props.data.id);
    };
    const navigate = useNavigate();
    const viewNotesMethod = () => {
      navigate(`/volunteernotes/${props.data.id}`, { state: { name: props.data.name, avatar: props.data.avatar } } )
    }


    // https://www.ag-grid.com/react-data-grid/component-cell-renderer/

  const editingCells = props.api.getEditingCells();
  const isCurrentRowEditing = editingCells.some((cell) => {
    return cell.rowIndex === props.node.rowIndex;
  });

  if(props.context.isAdmin) {
    return (
      <span>
        <div>
        {!isCurrentRowEditing ? <button onClick={(e) =>  {
          props.api.startEditingCell({
            rowIndex: props.node.rowIndex,
            // gets the first columnKey
            colKey: props.columnApi.getDisplayedCenterColumns()[0].colId
          });
        }}>Edit</button> : <button onClick={
          () => {
            props.context.setCommitRow(true);
            props.api.stopEditing(false);
          }
        }>Update</button>}
        {isCurrentRowEditing && <button onClick={() => {
            props.api.stopEditing(true);
        }}>Cancel</button>}
        <button onClick={invokeDeleteMethod}>Delete</button>
        </div>
        <div>
          <button onClick={viewNotesMethod}>View Notes</button>
        </div>
      </span>
    );
  } else {
    return (
    <div>
      <button onClick={viewNotesMethod}>View Notes</button>
    </div>
    );
  }
};
