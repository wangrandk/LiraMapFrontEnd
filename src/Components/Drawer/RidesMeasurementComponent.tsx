import "../Drawer/DrawerComponents.css";
import { FC, useEffect, useState, useRef } from "react";
import { theme } from "../Theme/Theme";
import { ThemeProvider } from "@mui/material/styles";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  IconButton,
  Tab,
  Tabs,
  Stack,
  Box,
  Skeleton,
  InputBase,
  Divider,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import { useQuery } from "@tanstack/react-query";
import { Clear, FilterList, Search } from "@material-ui/icons";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

interface RidesMeasurementComponentProps {
  addGraphComponent(index: number, tripID: string): any;
}

const RidesMeasurementComponent: FC<RidesMeasurementComponentProps> = ({
  addGraphComponent,
}) => {
  const [tab, setTab] = useState(0);
  const [selectedRides, setSelectedRides] = useState<any[]>([]);
  const [selectedMeasurements, setSelectedMeasurements] = useState<any[]>([]);
  const [rideInfos, setRideInfos] = useState<any[]>([]);
  const [measurementInfos, setMeasurementInfos] = useState<any[]>([]);
  const [filterBy, setFilterBy] = useState("");

  const handleRideItemClick = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    taskID: number,
    tripID: string
  ) => {
    addGraphComponent(taskID, tripID);
    setSelectedRides([...selectedRides, taskID]);
  };

  const handleMeasurementItemClick = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    // TODO: handle measurement clicks
    setSelectedMeasurements([...selectedMeasurements, index]);
  };

  const handleChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  const clear = () => {
    if (tab === 0) setSelectedRides([]);
    if (tab === 1) setSelectedMeasurements([]);
  };

  const onSearch = (event: any) => {
    // TODO: do something with search
    //console.log(event.target.value);
    setFilterBy(event.target.value);
  };

  const fetchRides = async () => {
    const ridesResponse = await fetch(`http://localhost:8000/trips`);

    const rides = await ridesResponse.json();

    return Promise.all(rides);
  };

  const fetchMeasurements = async () => {
    const measurementResponse = await fetch(
      `http://localhost:8000/measurement/types`
    );
    const measurementTypes = await measurementResponse.json();

    return Promise.all(measurementTypes);
  };

  const { data: ridesQuery, isLoading: ridesIsLoading } = useQuery(
    ["rides"],
    fetchRides
  );
  const { data: measurementQuery, isLoading: measurementsIsLoading } = useQuery(
    ["measurements"],
    fetchMeasurements
  );

  useEffect(() => {
    if (ridesQuery && measurementQuery) {
      setRideInfos(ridesQuery);
      setMeasurementInfos(measurementQuery);
    }
  }, [ridesQuery, measurementQuery]);

  return (
    <ThemeProvider theme={theme}>
      <Paper
        sx={{
          background: "transparent",
          width: "100%",
          top: "48px",
          height: "calc(100% - (57px + 48px))",
          display: "absolute",
          overflow: "auto",
        }}
        square={true}
      >
        <TabPanel value={tab} index={0}>
          {ridesIsLoading && (
            <Stack sx={{ margin: "auto", width: "100%" }} spacing={0.1}>
              {Array.from(Array(15)).map((_, i) => {
                return (
                  <Skeleton
                    key={`Skeleton ${i}`}
                    variant="rectangular"
                    height={72}
                  />
                );
              })}
            </Stack>
          )}
          <List sx={{ background: "transparent", width: "100%", padding: "0" }}>
            <>
              {Array.from(Array(rideInfos.length)).map((_, i) => {
                return (
                  <ListItem
                    key={"Trip " + rideInfos[i]["task_id"]}
                    sx={{
                      padding: "0",
                      width: "100%",
                      background: "transparent",
                    }}
                  >
                    <ListItemButton
                      sx={{
                        width: "100%",
                        backgroundColor: "transparent",
                        borderBottom: 1,
                        borderColor: "rgba(0,0,0,0.3)",
                      }}
                      selected={selectedRides.includes(rideInfos[i]["task_id"])}
                      onClick={(event) =>
                        handleRideItemClick(
                          event,
                          rideInfos[i]["task_id"],
                          rideInfos[i]["id"]
                        )
                      }
                    >
                      <ListItemText
                        primary={`Trip ${rideInfos[i]["task_id"]}`}
                        secondary={`${
                          JSON.parse(rideInfos[i]["start_position_display"])[
                            "city"
                          ] ?? "Empty"
                        } → ${
                          JSON.parse(rideInfos[i]["end_position_display"])[
                            "city"
                          ] ?? "Empty"
                        }`}
                        sx={{ wordWrap: "break-word" }}
                      />
                      <IconButton aria-label="icon">
                        <Add />
                      </IconButton>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </>
          </List>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          {measurementsIsLoading && (
            <Stack sx={{ margin: "auto", width: "100%" }} spacing={0.1}>
              {Array.from(Array(15)).map((_, i) => {
                return (
                  <Skeleton
                    key={`Skeleton ${i}`}
                    variant="rectangular"
                    height={72}
                  />
                );
              })}
            </Stack>
          )}
          <List sx={{ background: "transparent", width: "100%", padding: "0" }}>
            <>
              {Array.from(Array(measurementInfos.length)).map((_, i) => {
                return (
                  <ListItem
                    key={"Measurement " + i}
                    sx={{
                      padding: "0",
                      width: "100%",
                      background: "transparent",
                    }}
                  >
                    <ListItemButton
                      sx={{
                        backgroundColor: "transparent",
                        borderBottom: 1,
                        borderColor: "rgba(0,0,0,0.3)",
                      }}
                      selected={selectedMeasurements.includes(i)}
                      onClick={(event) => handleMeasurementItemClick(event, i)}
                    >
                      <ListItemText
                        primary={`Measurement ${i + 1}`}
                        secondary={measurementInfos[i]["type"]}
                        sx={{ wordWrap: "break-word" }}
                      />
                      <IconButton aria-label="icon">
                        {/*
                                                    TODO: change icon for editing measurement
                                                */}
                        <Add />
                      </IconButton>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </>
          </List>
        </TabPanel>
      </Paper>
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          height: "48px",
          position: "absolute",
          top: 0,
          borderRadius: "0 0 0 0",
        }}
      >
        <Tabs value={tab} onChange={handleChange} selectionFollowsFocus>
          <Tab label="Trips" />
          <Tab label="Measurements" />
        </Tabs>
      </Paper>

      <Paper
        elevation={4}
        sx={{
          width: "100%",
          height: "57px",
          position: "absolute",
          bottom: 0,
          my: "0px",
          borderRadius: "0px 0px 10px 10px",
          display: "inline-block",
        }}
      >
        <Paper
          component="form"
          sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search"
            inputProps={{ 'aria-label': '' }}
            onChange={onSearch}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <Search />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
            <FilterList />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="error" sx={{ p: '10px', mr: 1 }} aria-label="directions" disabled={
              tab === 0
                ? selectedRides.length < 1
                : selectedMeasurements.length < 1
            }
            onClick={clear}>
            <Clear />
          </IconButton>
        </Paper>
      </Paper>
    </ThemeProvider>
  );
};

export default RidesMeasurementComponent;
