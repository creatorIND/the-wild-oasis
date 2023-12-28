import { useState } from "react";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import SpinnerMini from "../../ui/SpinnerMini";

import { useLogin } from "./useLogin";

function LoginForm() {
	const [email, setEmail] = useState("sujalsinha2243@gmail.com");
	const [password, setPassword] = useState("9^#q^6$pH#LiP4i5!S");
	const { login, isAuthenticating } = useLogin();

	function handleSubmit(e) {
		e.preventDefault();

		if (!email || !password) return;
		login({ email, password });
	}

	return (
		<Form onSubmit={handleSubmit}>
			<FormRowVertical label="Email address">
				<Input
					type="email"
					id="email"
					// This makes this form better for password managers
					autoComplete="username"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isAuthenticating}
				/>
			</FormRowVertical>
			<FormRowVertical label="Password">
				<Input
					type="password"
					id="password"
					autoComplete="current-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={isAuthenticating}
				/>
			</FormRowVertical>
			<FormRowVertical>
				<Button size="large" disabled={isAuthenticating}>
					{!isAuthenticating ? "Login" : <SpinnerMini />}
				</Button>
			</FormRowVertical>
		</Form>
	);
}

export default LoginForm;
