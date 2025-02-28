import styled from "styled-components";

const StyledScreenSizeMessage = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8rem;
	align-items: center;
	height: 100vh;
	background-color: #111827;
	color: var(--color-brand-100);
	font-size: 2rem;
	text-align: center;
	padding-top: 15rem;
	padding-inline: 5rem;
`;

const Img = styled.img`
	height: 12rem;
`;

function ScreenSizeMessage() {
	return (
		<StyledScreenSizeMessage>
			<Img src="/logo-dark.png" alt="Logo" />
			<p>Please use a PC or laptop to login and access your account.</p>
		</StyledScreenSizeMessage>
	);
}

export default ScreenSizeMessage;
