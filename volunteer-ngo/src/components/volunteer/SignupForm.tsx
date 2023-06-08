import React from "react";
import { z } from "zod";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import axios from "axios";
import { type signupData } from "@/types/api";

interface SignupFormProps {
  setForm: React.Dispatch<React.SetStateAction<string>>;
}

function SignupForm(props: SignupFormProps) {
  const setForm = props.setForm;

  const userSchema = z
    .object({
      name: z
        .string({
          required_error: "Required",
          invalid_type_error: "Name must be a string",
        })
        .min(3, "Name must be atleast 3 characters long")
        .max(50, "Name must be less than 50 characters long"),
      email: z
        .string({
          required_error: "Required",
          invalid_type_error: "Email must be a string",
        })
        .email("Enter a valid email"),
      password: z
        .string({
          required_error: "Required",
          invalid_type_error: "Password must be a string",
        })
        .regex(
          /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
          "Password should contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
        ),
      confirmPassword: z.string({
        required_error: "Required",
        invalid_type_error: "Password must be a string",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: toFormikValidationSchema(userSchema),
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        const send = {
          name: values.name,
          email: values.email,
          password: values.password,
          role: "VOLUNTEER",
          
        };
        const { data } = await axios.post<signupData>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/vol/create`,
          send
        );
        if (data.status === "success") {
          setForm("login");
        }
      } catch (err) {
        console.log(err);
        // if (axios.isAxiosError(err)) {
        //   const error = err as AxiosError<loginData>;
        //   console.log(error.response?.data);
        // }
      }
    },
  });
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-10 grid grid-cols-12 text-base font-normal text-black"
      >
        <div className="col-span-10 lg:col-span-7">
          <label htmlFor="name" className="block text-lg font-medium leading-6">
            Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Name"
              className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#fff999] sm:text-sm sm:leading-6 
              ${
                touched.name && errors.name
                  ? "ring-2 ring-inset ring-red-500"
                  : ""
              }`}
            />
            <span className="text-lg text-red-500">
              {touched.name && errors.name}
            </span>
          </div>
        </div>

        <div className="col-span-10 mt-8 lg:col-span-7">
          <label
            htmlFor="email"
            className="block text-lg font-medium leading-6"
          >
            Email
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#fff999] sm:text-sm sm:leading-6 
              ${
                touched.email && errors.email
                  ? "ring-2 ring-inset ring-red-500"
                  : ""
              }`}
            />
            <span className="text-lg text-red-500">
              {touched.email && errors.email}
            </span>
          </div>
        </div>

        <div className="col-span-10 mt-8 lg:col-span-7">
          <label
            htmlFor="password"
            className="block text-lg font-medium leading-6"
          >
            Password
          </label>
          <div className="mt-2">
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password"
              className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#444BD3] sm:text-sm sm:leading-6 
              ${
                touched.password && errors.password
                  ? "ring-2 ring-inset ring-red-500"
                  : ""
              }`}
            />
            <span className="text-lg text-red-500">
              {touched.password && errors.password}
            </span>
          </div>
        </div>

        <div className="col-span-10 mt-8 lg:col-span-7">
          <label
            htmlFor="confirmPassword"
            className="block text-lg font-medium leading-6"
          >
            Confirm Password
          </label>
          <div className="mt-2">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm Password"
              className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#444BD3] sm:text-sm sm:leading-6 
              ${
                touched.confirmPassword && errors.confirmPassword
                  ? "ring-2 ring-inset ring-red-500"
                  : ""
              }`}
            />
            <span className="text-lg text-red-500">
              {touched.confirmPassword && errors.confirmPassword}
            </span>
          </div>
        </div>

        <div className="col-span-10 lg:col-span-7">
          <label htmlFor="name" className="block text-lg font-medium leading-6">
            Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Name"
              className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#fff999] sm:text-sm sm:leading-6 
              ${
                touched.name && errors.name
                  ? "ring-2 ring-inset ring-red-500"
                  : ""
              }`}
            />
            <span className="text-lg text-red-500">
              {touched.name && errors.name}
            </span>
          </div>
        </div>

        <div className="col-span-10 lg:col-span-7">
          <label htmlFor="name" className="block text-lg font-medium leading-6">
            Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Name"
              className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#fff999] sm:text-sm sm:leading-6 
              ${
                touched.name && errors.name
                  ? "ring-2 ring-inset ring-red-500"
                  : ""
              }`}
            />
            <span className="text-lg text-red-500">
              {touched.name && errors.name}
            </span>
          </div>
        </div>

        <div className="col-span-10 lg:col-span-7">
          <label htmlFor="name" className="block text-lg font-medium leading-6">
            Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Name"
              className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#fff999] sm:text-sm sm:leading-6 
              ${
                touched.name && errors.name
                  ? "ring-2 ring-inset ring-red-500"
                  : ""
              }`}
            />
            <span className="text-lg text-red-500">
              {touched.name && errors.name}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="col-span-10 mt-8 rounded-lg bg-[#444BD3] py-2 text-white lg:col-span-7"
        >
          SIGN UP
        </button>
      </form>

      <p className="mt-6 text-xl">
        Existing User?{" "}
        <u
          className="cursor-pointer text-[#444BD3]"
          onClick={() => {
            setForm("login");
          }}
        >
          Login
        </u>
      </p>
    </>
  );
}

export default SignupForm;
