import { logout } from "../firebase/sdk";

function LogoutPath() {
	return <>{logout()}</>;
}

export default LogoutPath;
