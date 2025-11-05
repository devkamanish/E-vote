import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminPage() {
  const [votes, setVotes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/api/votes", { method: "GET" });
        setVotes(data.votes || []);
      } catch (e) {
        setError(e.message || "Failed to fetch votes");
      }
    })();
  }, []);

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-2xl font-semibold text-center text-blue-600 mb-6">
        Admin Dashboard
      </h3>

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      {votes.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Party</th>
                <th className="p-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((v, i) => (
                <tr
                  key={v._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{v.name || "-"}</td>
                  <td className="p-3">{v.email}</td>
                  <td className="p-3 font-medium text-blue-600">
                    {v.party}
                  </td>
                  <td className="p-3">
                    {new Date(v.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No votes yet.</p>
      )}
    </div>
  );
}


