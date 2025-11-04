import React, { useState } from "react";
import { api } from "../api";

const PARTIES = ["BJP", "CONGRESS", "AAP", "OTHERS"];

export default function VoterPage({ user }) {
  const [msg, setMsg] = useState("");
  const [votedFor, setVotedFor] = useState(null);

  const castVote = async (party) => {
    try {
      await api("/api/votes", { method: "POST", body: { party } });
      setVotedFor(party);
      setMsg(`You voted for ${party}`);
    } catch (err) {
      setMsg(err?.message || "Error casting vote");
    }
  };

  if (!user)
    return <div className="text-center text-gray-600">Please login to vote.</div>;

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 text-center">
      <h3 className="text-2xl font-semibold text-blue-600 mb-4">
        Cast Your Vote
      </h3>
      <p className="mb-6 text-gray-700">
        Signed in as: <b>{user.name || user.email}</b>
      </p>

      {votedFor ? (
        <div className="text-green-600 font-medium">{msg}</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {PARTIES.map((p) => (
            <button
              key={p}
              onClick={() => castVote(p)}
              className="btn-secondary hover:scale-105 transition"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {msg && (
        <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-2 rounded">
          {msg}
        </div>
      )}
    </div>
  );
}
