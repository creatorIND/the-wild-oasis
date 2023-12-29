import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
	const { data: user, isPending: isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: getCurrentUser,
		refetchInterval: 5 * 1000,
	});

	const isAuthenticated = user?.role === "authenticated";

	return { isLoading, user, isAuthenticated };
}
