// src/components/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", paddingTop: "100px" }}>
            <h1 style={{ fontSize: "48px", marginBottom: "40px" }}>SOCIAL</h1>
            <button
                onClick={() => navigate("/social")}
                style={{
                    fontSize: "20px",
                    padding: "12px 30px",
                    borderRadius: "8px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                SOCIAL
            </button>
        </div>
    );
}
