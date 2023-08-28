import { Link, useLocation, useNavigate } from "react-router-dom";

export const VolunteerNotes = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div>
            <img src={location.state.avatar}/>
            <h1>Volunteer notes for {location.state.name}</h1>
            <p>{location.state.name} is pretty cool!</p>
            <Link
            onClick={(e) => {
                e.preventDefault();
                navigate(-1);
                }}
            >
            Back to Volunteer Table</Link>
        </div>
    );
};
