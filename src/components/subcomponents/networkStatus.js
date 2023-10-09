import { Offline, Online } from "react-detect-offline";

function NetworkMeter() {
	return (
		<div>
			<Online>
				<></>
			</Online>
			<Offline>
				<p>You are offline. Please check your internet connection.</p>
			</Offline>
		</div>
	);
}

export default NetworkMeter;
