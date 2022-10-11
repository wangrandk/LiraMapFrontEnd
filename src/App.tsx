import "./App.css";
import Map from "./Components/Map/Map";
import { FC, useState } from "react";
import * as L from 'leaflet'; 
import NavBar from "./Components/NavBar/NavBar";
import GraphComponent from "./Components/Drawer/GraphComponent";
import RidesMeasurementComponent from "./Components/Drawer/RidesMeasurementComponent";
import Window from "./Components/Base/Window";

const App: FC = () => {
  	const [graphComponentsList, setGraphComponentsList] = useState<any[]>([]);
  	const [ridesIsRendered, setRidesIsRendered] = useState(false);
  
  	const position = L.marker([55.7856,12.5214]);
  	const [uniqueId, setUniqueId] = useState(0);
  	const [uniqueZ, setUniqueZ] = useState(0);

  	const focusWindow = (windowId: number) => {
		if (windowInFocus !== windowId) {
			setWindowInFocus(windowId);
			setUniqueZ(uniqueZ + 100);
			return uniqueZ
		}
		return 0
  	}
  	const [windowInFocus, setWindowInFocus] = useState(0);

	const addGraphComponent = (title: string) => {
		setUniqueId(uniqueId + 1);
		setUniqueZ(uniqueZ + 1);
		setGraphComponentsList([...graphComponentsList, {componentId: uniqueId, graphTitle: title}]);
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

	return(
		<div className="App">
			<NavBar setRidesIsRendered={setRidesIsRendered}/>
			<Map position={position.getLatLng()} />
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
					graphTitle={component.graphTitle}
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
					setRidesIsRendered={setRidesIsRendered}
				/>
				</Window>
			}
		</div>
	);
}

export default App;
