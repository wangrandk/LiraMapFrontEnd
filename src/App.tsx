import "./App.css";
import Map from "./Components/Map/Map";
import { FC, useState } from "react";
import * as L from 'leaflet'; 
import NavBar from "./Components/NavBar/NavBar";
import GraphComponent from "./Components/Drawer/GraphComponent";
import Window from "./Components/Base/Window";
import RidesMeasurementComponent from "./Components/Drawer/RidesMeasurementComponent";

const App: FC = () => {
  	const [graphComponentsList, setGraphComponentsList] = useState<any[]>([]);
  	const [ridesIsRendered, setRidesIsRendered] = useState(false);
  
  	const position = L.marker([55.677240026834134, 12.567320700469025]);
  	const [uniqueId, setUniqueId] = useState(0);
  	const [uniqueZ, setUniqueZ] = useState(0);

	const [plottedTrip, setPlottedTrip] = useState<{ tripId: string, measurementType: string }>({ tripId: "", measurementType: ""});

  	const focusWindow = (windowId: number) => {
		if (windowInFocus !== windowId) {
			setWindowInFocus(windowId);
			setUniqueZ(uniqueZ + 100);
			return uniqueZ
		}
		return 0
  	}
  	const [windowInFocus, setWindowInFocus] = useState(0);

	const addGraphComponent = (taskID: number, tripID: string) => {
		setUniqueId(uniqueId + 1);
		setUniqueZ(uniqueZ + 1);
		setGraphComponentsList([...graphComponentsList, {componentId: uniqueId, graphTaskID: taskID, graphTripID: tripID}]);
	}

	const removeGraphComponent = (index: number) => {
		const newGraphComponentsList = [...graphComponentsList];
		const findIndex = newGraphComponentsList.findIndex((value) => {
			return value.componentId === index
		})
		if (findIndex !== -1) {
			newGraphComponentsList.splice(findIndex, 1);
			setGraphComponentsList(newGraphComponentsList);
		}
	}

	const removeTripComponent = () => {
		setRidesIsRendered(false);
	}

	const plotLine = (tripID: string, measurementType: string) => {
		setPlottedTrip({ tripId: tripID, measurementType: measurementType })
	}

	return(
		<div className="App">
			<NavBar setRidesIsRendered={setRidesIsRendered}/>
			<Map position={position.getLatLng()} plottedTrip={plottedTrip} />
			{graphComponentsList.map((component, _) => (
				<Window
					key={component.componentId}
					id={component.componentId}
					x={350}
					y={300}
					width={'70%'}
					height={'60%'}
					closeWindow={removeGraphComponent}
					focusWindow={focusWindow}
				>
					<GraphComponent 
						graphTaskID={component.graphTaskID}
						graphTripID={component.graphTripID}
					/>
				</Window>
			))}
			{ridesIsRendered && 
				<Window
					id={uniqueId}
					x={17}
					y={100}
					width={'20%'}
					height={'80%'}
					closeWindow={removeTripComponent}
					focusWindow={focusWindow}
				>
					<RidesMeasurementComponent
						addGraphComponent={addGraphComponent}
						plotLine={plotLine}
					/>
				</Window>
			}
		</div>
	);
}

export default App;
