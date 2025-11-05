import React, { useState } from "react";
import { api } from "../api";

// Party data with logos
const PARTIES = [
  {
    name: "BJP",
    color: "bg-orange-500",
    logo: "https://upload.wikimedia.org/wikipedia/en/8/88/Bharatiya_Janata_Party_logo.svg",
  },
  {
    name: "CONGRESS",
    color: "bg-blue-600",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Indian_National_Congress_hand_logo.png",
  },
  {
    name: "AAP",
    color: "bg-sky-500",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Aam_Aadmi_Party_logo_%28English%29.png",
  },
  {
    name: "OTHERS",
    color: "bg-gray-400",
    logo: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
  },
];

export default function VoterPage({ user }) {
  const [msg, setMsg] = useState("");
  const [votedFor, setVotedFor] = useState(null);

  const castVote = async (party) => {
    try {
      await api("/api/votes", { method: "POST", body: { party } });
      setVotedFor(party);
      setMsg(`✅ You voted for ${party}`);
    } catch (err) {
      setMsg(err?.message || "⚠️ Error casting vote");
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center text-gray-600 text-lg bg-white shadow-md p-8 rounded-2xl">
          Please <span className="text-blue-600 font-semibold">login</span> to vote.
        </div>
      </div>
    );

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-2xl text-center border border-blue-100 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 via-transparent to-purple-300/30 blur-3xl"></div>

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
              <p className="text-gray-600 mb-6 text-lg">
                Choose your preferred party and cast your vote securely:
              </p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
                {PARTIES.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => castVote(p.name)}
                    className={`relative group flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-semibold text-lg shadow-md transition-all transform hover:scale-105 ${p.color} hover:shadow-lg hover:shadow-blue-200`}
                  >
                    <img
                      src={p.logo}
                      alt={`${p.name} logo`}
                      className="w-10 h-10 object-contain bg-white rounded-full p-1"
                    />
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

          {msg && !votedFor && (
            <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-2 rounded">
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
