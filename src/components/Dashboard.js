const Dashboard = () => {
	let username = localStorage.getItem("name");
	return (
		<div>
			<h1>{username}</h1>
		</div>
	);
};

export default Dashboard;
