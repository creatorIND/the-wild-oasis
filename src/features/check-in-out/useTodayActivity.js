import { useQuery } from "@tanstack/react-query";

import { getStaysTodayActivity } from "../../services/apiBookings";

export function useTodayActivity() {
	const { data: activities, isPending: isLoadingTodayActivity } = useQuery({
		queryFn: () => getStaysTodayActivity(),
		queryKey: ["today-activity"],
	});

	return { activities, isLoadingTodayActivity };
}
