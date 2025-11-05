import React, { useState } from "react";
import { api } from "../api";

const PARTIES = [
  { name: "BJP", color: "bg-orange-500" },
  { name: "CONGRESS", color: "bg-blue-600" },
  { name: "AAP", color: "bg-sky-500" },
  { name: "OTHERS", color: "bg-gray-400" },
];

export default function VoterPage({ user }) {
  const [msg, setMsg] = useState("");
  const [votedFor, setVotedFor] = useState(null);
  const [loading, setLoading] = useState(false);
  
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
 <div className="relative z-10 flex flex-col justify-center items-center h-full">
          <h3 className="text-3xl font-bold text-blue-700 mb-3">
            🗳️ Cast Your Vote
          </h3>
          <p className="text-gray-700 mb-8">
            Signed in as:{" "}
            <b className="text-blue-600">{user.name || user.email}</b>
          </p>

          {!votedFor ? (
            <>
              <p className="text-gray-600 mb-6">
                Choose your preferred party and cast your vote securely.
              </p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
                {PARTIES.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => castVote(p.name)}
                    disabled={loading}
                    className={`relative group px-6 py-4 rounded-xl text-white font-semibold text-lg shadow-md transition-all transform hover:scale-105 ${p.color} hover:shadow-lg disabled:opacity-60`}
                  >
                    {p.name}
                    <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition"></span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="text-green-600 text-2xl font-semibold animate-bounce">
                🟢 {msg}
              </div>
              <button
                onClick={() => setVotedFor(null)}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Change Vote
              </button>
            </div>
          )}

          {loading && (
            <div className="mt-6 text-blue-600 animate-pulse font-medium">
              Casting your vote securely...
            </div>
          )}
        </div>

    </div>
  );
}
