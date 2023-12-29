import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout as logoutAPI } from "../../services/apiAuth";

export function useLogout() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { mutate: logout, isPending: isLoggingOut } = useMutation({
		mutationFn: logoutAPI,
		onSuccess: () => {
			queryClient.clear();
			navigate("/login", { replace: true });
		},
	});

	return { logout, isLoggingOut };
}
