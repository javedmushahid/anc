// pages/index.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { SnackbarProvider, useSnackbar } from "notistack";

const Dashboard = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [tournamentData, setTournamentData] = useState([]);
  const [modifiedTournamentData, setModifiedTournamentData] = useState([]);
  const [newPlayer, setNewPlayer] = useState({
    game: "",
    team_name: "",
    name: "",
    age: "",
  });
  const [editedPlayer, setEditedPlayer] = useState({
    name: "",
    age: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://mocki.io/v1/b4544a37-0765-405f-baf6-6675845d5a0e"
        );
        setTournamentData(response.data);
        setModifiedTournamentData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditPlayer = (game, teamName, playerName, field, value) => {
    // Update modifiedTournamentData based on the edited player
    // console.log("edited data", game, teamName, playerName, field, value);
    setEditedPlayer({
      name: field === "name" ? value : editedPlayer.name,
      age:
        field === "age"
          ? Number.isNaN(parseInt(value, 10))
            ? ""
            : parseInt(value, 10)
          : editedPlayer.age,
    });

    const updatedTournamentData = modifiedTournamentData.map((gameData) => {
      if (gameData.game === game) {
        const updatedTeams = gameData.teams.map((team) => {
          if (team.team_name === teamName) {
            return {
              ...team,
              players: team.players.map((player) => {
                if (player.name === playerName) {
                  return {
                    ...player,
                    [field]: field === "age" ? parseInt(value, 10) : value,
                  };
                }
                return player;
              }),
            };
          }
          return team;
        });

        return {
          ...gameData,
          teams: updatedTeams,
        };
      }

      return gameData;
    });

    setModifiedTournamentData(updatedTournamentData);
  };

  const handleAddPlayer = (teamName, game) => {
    setNewPlayer({
      game,
      team_name: teamName,
      name: "",
      age: "",
    });
  };

  const handleSaveNewPlayer = () => {
    if (
      !newPlayer.game ||
      !newPlayer.team_name ||
      !newPlayer.name ||
      !newPlayer.age
    ) {
      // Handle validation or show an error message
      return;
    }

    const updatedTournamentData = modifiedTournamentData.map((game) => {
      if (game.game === newPlayer.game) {
        const updatedTeams = game.teams.map((team) => {
          if (team.team_name === newPlayer.team_name) {
            return {
              ...team,
              players: [
                ...team.players,
                {
                  name: newPlayer.name,
                  age: parseInt(newPlayer.age),
                },
              ],
            };
          }
          return team;
        });

        return {
          game: game.game,
          teams: updatedTeams,
        };
      }
      return game;
    });

    setModifiedTournamentData(updatedTournamentData);

    setNewPlayer({
      game: "",
      team_name: "",
      name: "",
      age: "",
    });
    enqueueSnackbar("Added", { variant: "success" });
  };
  const saveDetails = () => {
    enqueueSnackbar("Updated", { variant: "success" });
  };
  // console.log("modified data", modifiedTournamentData);
  return (
    <div>
      {modifiedTournamentData.map((game, index) => (
        <Card
          key={index}
          style={{ margin: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)" }}
        >
          <CardContent>
            <Box sx={{ bgColor: "gray" }}>
              {" "}
              <Typography variant="h4">{game.game}</Typography>
            </Box>
            {game.teams.map((team, teamIndex) => (
              <div key={teamIndex}>
                <Typography variant="h6" color={"green"}>
                  {team.team_name} {`(${team.players.length})`}
                </Typography>
                <List>
                  {team.players.map((player, playerIndex) => (
                    <ListItem key={playerIndex}>
                      <Card
                        key={playerIndex}
                        style={{
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add box shadow here
                        }}
                      >
                        <CardContent
                          sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                        >
                          <TextField
                            label="Name"
                            value={player.name}
                            onChange={(e) =>
                              handleEditPlayer(
                                game.game,
                                team.team_name,
                                player.name,
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <TextField
                            label="Age"
                            value={
                              Number.isInteger(player.age)
                                ? player.age.toString()
                                : ""
                            }
                            onChange={(e) =>
                              handleEditPlayer(
                                game.game,
                                team.team_name,
                                player.name,
                                "age",
                                e.target.value
                              )
                            }
                          />

                          <Button
                            variant="contained"
                            size="medium"
                            // color="blue"
                            sx={{
                              ml: 2,
                            }}
                            onClick={saveDetails}
                          >
                            Save
                          </Button>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                </List>
                {/* Conditionally render input fields for the new player */}
                {newPlayer.game === game.game &&
                  newPlayer.team_name === team.team_name && (
                    <ListItem>
                      <Card
                        style={{
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add box shadow here
                        }}
                      >
                        <CardContent
                          sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                        >
                          <TextField
                            label="Name"
                            value={newPlayer.name}
                            onChange={(e) =>
                              setNewPlayer({
                                ...newPlayer,
                                name: e.target.value,
                              })
                            }
                          />

                          <TextField
                            label="Age"
                            value={newPlayer.age}
                            onChange={(e) =>
                              setNewPlayer({
                                ...newPlayer,
                                age: e.target.value,
                              })
                            }
                          />

                          <Button
                            variant="contained"
                            size="medium"
                            sx={{
                              ml: 2,
                            }}
                            onClick={handleSaveNewPlayer}
                          >
                            Add
                          </Button>
                        </CardContent>
                      </Card>
                    </ListItem>
                  )}
                <Button
                  variant="contained"
                  onClick={() => handleAddPlayer(team.team_name, game.game)}
                >
                  <AddCircle /> Add Player
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Dashboard;
