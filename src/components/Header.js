import {
	Navbar,
	Typography,
	IconButton,
	Button
} from "@material-tailwind/react";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { Dashboard } from "@mui/icons-material";
import {
	UserCircleIcon,
	PowerIcon,
	ChevronDownIcon
} from "@heroicons/react/24/outline";
import {
	Menu,
	MenuHandler,
	Avatar,
	MenuItem,
	MenuList
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { auth } from "../sdk/firebase";

export default function Header() {
	const placeholderImageUrl = "https://picsum.photos/200/";
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [loggedInPhoto, setLoggedInPhoto] = useState(placeholderImageUrl);
	const [loggedInLoginPath, setLoggedInLoginPath] = useState(" ");
	const [loggedInColor, setLoggedInColor] = useState(" ");
	const [loggedInName, setLoggedInName] = useState(" ");
	const [loggedUser, setLoggedUser] = useState(" ");

	const closeMenu = () => setIsMenuOpen(false);

	const profileMenuItems = [
		{
			label: "My Profile",
			icon: UserCircleIcon,
			link: "/dashboard"
		},
		{
			label: loggedInName,
			icon: PowerIcon,
			link: loggedInLoginPath
		}
	];

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user == null) {
				setLoggedInPhoto(placeholderImageUrl);
				setLoggedInLoginPath("/login");
				setLoggedInColor("green");
				setLoggedInName("Sign In");
			} else {
				setLoggedInPhoto(user.photoURL);
				setLoggedInLoginPath("/logout");
				setLoggedInColor("red");
				setLoggedInName("Sign Out");
				setLoggedUser(user.displayName);
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<Navbar className="mx-auto max-w-screen-xl px-4 py-3">
			<div className="flex flex-wrap items-center justify-between gap-y-4 text-blue-gray-900">
				<Typography
					as="a"
					href="/"
					variant="h6"
					color="blue-gray"
					className="mr-4 ml-2 cursor-pointer py-1.5"
				>
					Capstone Project
				</Typography>
				<div className="ml-auto flex gap-1 md:mr-4">
					<Typography as="a" href="/dashboard">
						<IconButton variant="text" color="blue-gray">
							<Dashboard className="h-4 w-4" />
						</IconButton>
					</Typography>
					<Typography as="a" href="/books">
						<IconButton variant="text" color="blue-gray">
							<ShoppingBagIcon className="h-4 w-4" />
						</IconButton>
					</Typography>
				</div>
				<Menu
					open={isMenuOpen}
					handler={setIsMenuOpen}
					placement="bottom-end"
				>
					<MenuHandler>
						<Button
							aria-label="User profile information"
							variant="text"
							color="blue-gray"
							className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
						>
							<Avatar
								variant="circular"
								size="sm"
								alt={loggedUser}
								className="border border-gray-900 p-0.5"
								src={loggedInPhoto}
							/>
							<ChevronDownIcon
								strokeWidth={2.5}
								className={`h-3 w-3 transition-transform ${
									isMenuOpen ? "rotate-180" : ""
								}`}
							/>
						</Button>
					</MenuHandler>
					<MenuList className="p-1">
						{profileMenuItems.map(({ label, icon, link }, key) => {
							const isLastItem =
								key === profileMenuItems.length - 1;
							return (
								<MenuItem
									key={label}
									onClick={closeMenu}
									className={`flex items-center gap-2 rounded ${
										isLastItem
											? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
											: ""
									}`}
								>
									{React.createElement(icon, {
										className: `h-4 w-4 ${
											isLastItem ? loggedInColor : ""
										}`,
										strokeWidth: 2
									})}
									<Typography
										as="a"
										href={link}
										variant="small"
										className="font-normal"
										color={
											isLastItem
												? loggedInColor
												: "inherit"
										}
									>
										{label}
									</Typography>
								</MenuItem>
							);
						})}
					</MenuList>
				</Menu>
			</div>
		</Navbar>
	);
}
