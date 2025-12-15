"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { userSchema, userType } from "../schemas/user.schema";

type BackendError = {
  field: string;
  message: string;
};

export default function RegisterPage() {
  const [backendErrors, setBackendErrors] = useState<string[]>([]);
  const [users, setUsers] = useState<userType[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<userType>({
    resolver: zodResolver(userSchema),
  });


  useEffect(() => {
    const loadUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users);
    };

    loadUsers();
  }, []);

  const onSubmit = async (data: userType) => {
    setBackendErrors([]);

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      setBackendErrors(
        result.errors.map((e: BackendError) => e.message)
      );
    } else {
      reset();

     
      const refreshed = await fetch("/api/users");
      const refreshedData = await refreshed.json();
      setUsers(refreshedData.users);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-md mx-auto bg-slate-100 p-6 rounded shadow">
        <h2 className="text-2xl text-teal-600 font-semibold mb-4 text-center">
          Register User
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register("name")} placeholder="Enter Name" className="outline-none border border-slate-200 w-full py-2 px-2 rounded-md shadow-2xs" autoComplete="off"/>
          <p className="text-sm text-teal-600">{errors.name?.message}</p>

          <input {...register("email")} placeholder="Enter Email" className="outline-none border border-slate-200 w-full py-2 px-2 rounded-md shadow-2xs" autoComplete="off" />
          <p className="text-sm text-teal-600">{errors.email?.message}</p>

          <input
            type="Enter password"
            {...register("password")}
            placeholder="Enter Password"
           className="outline-none border border-slate-200 w-full py-2 px-2 rounded-md shadow-2xs" autoComplete="off"
          />
          <p className="text-sm text-teal-600">{errors.password?.message}</p>

          <input
            type="number"
            {...register("age", { valueAsNumber: true })}
            placeholder="Enter Age"
          className="outline-none border border-slate-200 w-full py-2 px-2 rounded-md shadow-2xs" autoComplete="off"
          />
          <p className="text-sm text-teal-600">{errors.age?.message}</p>

          <button className="w-full cursor-pointer bg-teal-600 text-white py-2 rounded">
            Register
          </button>
        </form>

        {/* Backend Errors */}
        {backendErrors.length > 0 && (
          <div className="mt-4">
            {backendErrors.map((err, i) => (
              <p key={i} className="error">
                {err}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* User List */}
      <div className="max-w-3xl mx-auto mt-8 bg-slate-50 p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">
          Registered Users
        </h3>

        {users.length === 0 ? (
          <p>No users registered yet.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-teal-600">Name</th>
                <th className="border p-2 text-teal-600">Email</th>
                <th className="border p-2 text-teal-600">Age</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i}>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
