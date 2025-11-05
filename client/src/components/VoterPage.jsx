import React, { useState } from "react";
import { api } from "../api";

const PARTIES = [
  {
    name: "BJP",
    color: "bg-orange-500",
    logo: "https://upload.wikimedia.org/wikipedia/hi/e/ec/Bharatiya_Janata_Party_logo.svg.png",
  },
  {
    name: "CONGRESS",
    color: "bg-blue-600",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/63/Indian_National_Congress_hand_logo.png",
  },
  {
    name: "AAP",
    color: "bg-sky-500",
    logo: "https://i.ndtvimg.com/i/2015-04/aap-logo-650_650x400_41428497829.jpg",
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
      setMsg(`You voted for ${party}`);
    } catch (err) {
      setMsg(err?.message || "Error casting vote");
    }
  };

  if (!user)
    return <div className="text-center text-gray-600">Please login to vote.</div>;

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 via-transparent to-purple-300/30 blur-3xl"></div>

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
      )}

      {msg && (
        <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-2 rounded">
          {msg}
        </div>
      )}
    </div>
  );
}
