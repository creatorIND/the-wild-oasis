import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

import Spinner from "./Spinner";

import { useUser } from "../features/authentication/useUser";

const FullPage = styled.div`
	height: 100vh;
	background-color: var(--color-grey-50);
	display: flex;
	align-items: center;
	justify-content: center;
`;

function ProtectedRoute({ children }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// 1. Load the authenticated user
	const { isLoading, isAuthenticated } = useUser();

	// 2. If there is NO authenticated user, redirect to /login
	useEffect(
		function () {
			if (!isAuthenticated && !isLoading) {
				queryClient.clear();
				navigate("/login");
			}

			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		[isAuthenticated, isLoading, navigate, queryClient]
	);

	// 3. While loading, show spinner
	if (isLoading) {
		return (
			<FullPage>
				<Spinner />
			</FullPage>
		);
	}

	// 4. If there IS a user, render the app
	if (isAuthenticated) return children;
}

export default ProtectedRoute;
