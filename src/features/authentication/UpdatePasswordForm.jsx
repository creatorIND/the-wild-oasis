import { useForm } from "react-hook-form";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useUpdateUser } from "./useUpdateUser";
import { useUser } from "./useUser";

const testUserMail = import.meta.env.VITE_LOGIN_ID;

function UpdatePasswordForm() {
	const { register, handleSubmit, formState, getValues, reset } = useForm();
	const { errors } = formState;

	const { user } = useUser();
	const { updateUser, isUpdatingUser } = useUpdateUser();

	const isTestUser = user.email === testUserMail;

	function onSubmit({ password }) {
		if (isTestUser) return;

		updateUser({ password }, { onSuccess: reset });
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<FormRow
				label="New Password (min 8 chars)"
				error={errors?.password?.message}
			>
				<Input
					type="password"
					id="password"
					placeholder={isTestUser ? "Not allowed for this user" : ""}
					autoComplete="new-password"
					disabled={isUpdatingUser || isTestUser}
					{...register("password", {
						required: "This field is required",
						minLength: {
							value: 8,
							message: "Password needs a minimum of 8 characters",
						},
					})}
				/>
			</FormRow>

			<FormRow
				label="Confirm password"
				error={errors?.passwordConfirm?.message}
			>
				<Input
					type="password"
					autoComplete="new-password"
					placeholder={isTestUser ? "Not allowed for this user" : ""}
					id="passwordConfirm"
					disabled={isUpdatingUser || isTestUser}
					{...register("passwordConfirm", {
						required: "This field is required",
						validate: (value) =>
							getValues().password === value ||
							"Passwords need to match",
					})}
				/>
			</FormRow>
			<FormRow>
				<Button
					onClick={reset}
					type="reset"
					variation="secondary"
					disabled={isUpdatingUser || isTestUser}
				>
					Cancel
				</Button>
				<Button disabled={isUpdatingUser || isTestUser}>
					Update password
				</Button>
			</FormRow>
		</Form>
	);
}

export default UpdatePasswordForm;
