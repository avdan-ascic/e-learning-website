import { useState, useEffect, useContext } from "react";

import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  Button,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UserContext } from "../../App";
import { setActive, setMentor, readUsers } from "../../api/admin-api";

import { remove } from "../../api/user-api";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "is Active",
      filterable: false,
      sortable: false,
      width: 70,
      renderCell: (cellValues) => {
        if (userInfo.role === "admin" && cellValues.id === userInfo.id) {
          return <Checkbox checked={cellValues.row.active} disabled />;
        } else {
          return (
            <Checkbox
              checked={cellValues.row.active}
              onClick={() =>
                handleChangeActive(cellValues.id, cellValues.row.active)
              }
            />
          );
        }
      },
    },
    {
      field: "is Mentor",
      filterable: false,
      sortable: false,
      width: 70,
      renderCell: (cellValues) => {
        if (userInfo.role === "admin" && cellValues.id === userInfo.id) {
          return (
            <Checkbox checked={cellValues.row.role !== "student"} disabled />
          );
        } else {
          return (
            <Checkbox
              checked={cellValues.row.role !== "student"}
              onClick={() =>
                handleChangeMentor(cellValues.id, cellValues.row.role)
              }
            />
          );
        }
      },
    },
    {
      field: "Edit",
      filterable: false,
      sortable: false,
      width: 70,
      renderCell: (cellValues) => {
        return (
          <IconButton
            onClick={() => navigate(`/admin-edit-user/${cellValues.id}`)}
          >
            <EditIcon color="primary" />
          </IconButton>
        );
      },
    },
    {
      field: "Delete",
      filterable: false,
      sortable: false,
      width: 70,
      renderCell: (cellValues) => {
        return (
          <IconButton onClick={() => handleDeleteUser(cellValues.id)}>
            <DeleteIcon sx={{ color: "red" }} />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    readUsers()
      .then((data) => setUsers(data.users))
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, [userInfo]);

  useEffect(() => {
    let tempArr = [];
    if (users?.length > 0) {
      users.map((user) => {
        return tempArr.push({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          active: user.active,
          role: user.role,
        });
      });
    }
    setRows(tempArr);
    // eslint-disable-next-line
  }, [users]);

  const handleDeleteUser = (id) => {
    remove(id).then(() => {
      setRows(rows.filter((row) => row.id !== id));
    });
  };

  const handleChangeActive = (id, status) => {
    if (userInfo.role === "admin" && id === userInfo.id) {
      return;
    }

    setActive({ userId: id, status: !status })
      .then(() => {
        let tempArr = [...rows];
        const editedIndex = tempArr.findIndex((obj) => obj.id === id);
        tempArr[editedIndex].active = !status;
        setRows(tempArr);
      })
      .catch((err) => console.log(err));
  };

  const handleChangeMentor = (id, role) => {
    if (userInfo.role === "admin" && id === userInfo.id) {
      return;
    }

    const newRole = role === "student" ? "mentor" : "student";
    setMentor({ userId: id, role: newRole }).then(() => {
      let tempArr = [...rows];
      const editedIndex = tempArr.findIndex((obj) => obj.id === id);
      tempArr[editedIndex].role = newRole;
      setRows(tempArr);
    });
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Stack
        sx={{
          width: 800,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "3rem",
        }}
      >
        <Typography variant="h4" textAlign={"center"} sx={{ color: "#204e59" }}>
          Users
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/admin-add-user")}
          sx={{
            backgroundColor: "#204e59",
            "&:hover": {
              backgroundColor: "#154043",
            },
          }}
        >
          Add User
        </Button>
      </Stack>

      <Box
        sx={{
          width: "785px",
          maxWidth: "100%",
          marginTop: "3rem",
          marginBottom: "5rem",
          overflowY: "auto",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={5}
        />
      </Box>
    </Box>
  );
};

export default UserDashboard;
