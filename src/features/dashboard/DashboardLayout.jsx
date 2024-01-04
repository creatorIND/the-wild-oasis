import styled from "styled-components";

import Spinner from "../../ui/Spinner";
import Stats from "./Stats";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

import { useCabins } from "../cabins/useCabins";
import { useRecentBookings } from "./useRecentBookings";
import { useRecentStays } from "./useRecentStays";

const StyledDashboardLayout = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: auto 34rem auto;
	gap: 2.4rem;
`;

function DashboardLayout() {
	const { bookings, isLoadingRecentBookings } = useRecentBookings();
	const { confirmedStays, isLoadingRecentStays, numDays } = useRecentStays();
	const { cabins, isLoading: isLoadingCabins } = useCabins();

	if (isLoadingRecentBookings || isLoadingRecentStays || isLoadingCabins) {
		return <Spinner />;
	}

	return (
		<StyledDashboardLayout>
			<Stats
				bookings={bookings}
				confirmedStays={confirmedStays}
				numDays={numDays}
				cabinCount={cabins.length}
			/>
			<TodayActivity />
			<DurationChart confirmedStays={confirmedStays} />
			<SalesChart bookings={bookings} numDays={numDays} />
		</StyledDashboardLayout>
	);
}

export default DashboardLayout;
