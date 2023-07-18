import { useContext, useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import { TeamContext } from "../context/providers/TeamContext";
import CustomTablePaginated from "../../../components/common/CustomTablePaginated";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    id: "email",
    label: "Team Email",
    minWidth: 100,
    component: (team) => team.email,
  },
  {
    id: "name",
    label: "Name",
    minWidth: 100,
    component: (team) => team.teamname,
  },
  {
    id: "owner",
    label: "Owner",
    minWidth: 100,
    component: (team) => team.EmailOwner,
  },
  {
    id: "createAt",
    label: "Created At",
    minWidth: 100,
    component: (team) => team.create_at,
  },
  {
    id: "numberMembers",
    label: "Members",
    minWidth: 100,
    component: (team) => team.ListEmailMember.length,
  },
  {
    id: "numberFollowers",
    label: "Followers",
    minWidth: 100,
    component: (team) => team.ListEmailFollower.length,
  },
];

function Actions({ row }) {

  const navigate = useNavigate();

  return (
    <>
      <Tooltip title="View account">
        <IconButton onClick={() => navigate(`/teams/${row.email}`)}>
          <RemoveRedEyeIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

export default function AllTeamsCard() {
  const [currentFilter, setCurrentFilter] = useState("all"); // for filtering the data

  const { teams, changePage, isLoading, totalTeams } =
    useContext(TeamContext).data;

  const handleMainFilter = (_event, newFilter) => {
    if (newFilter) setCurrentFilter(newFilter);
  };

  return (
    <Paper component="section" variant="outlined" sx={{p: 4}}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h3>All Teams</h3>
        <ToggleButtonGroup
          color="primary"
          exclusive
          value={currentFilter}
          onChange={handleMainFilter}
        >
          <ToggleButton value="all">
            <WidgetsOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="deactivated">Hi</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <CustomTablePaginated listOfObjects={teams} numberOfObjects={totalTeams} Actions={Actions} columns={columns} isLoading={isLoading} changePage={changePage} />
    </Paper>
  );
}
