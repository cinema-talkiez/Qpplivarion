import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function IndexPage() {
  const [userId, setUserId] = useState(null);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const MAX_AGE = 10 * 60 * 1000; // 10 minutes
    let uid = localStorage.getItem("userId");
    let createdAt = localStorage.getItem("createdAt");

    if (uid && createdAt && Date.now() - parseInt(createdAt) > MAX_AGE) {
      localStorage.clear();
      uid = null;
    }

    if (!uid) {
      uid = generateUUID();
      localStorage.setItem("userId", uid);
      localStorage.setItem("createdAt", Date.now().toString());
    }

    setUserId(uid);

    // Check token status via backend
    fetch(`/api/check/${uid}`)
      .then(res => res.json())
      .then(data => {
        console.log("Token Check:", data); // Debug
        setTokenVerified(data.tokenVerified);
        // Check validToken from localStorage without expiration
        const storedValidToken = localStorage.getItem("validToken") === "true";
        setValidToken(storedValidToken);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  const generateUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  if (loading) return <p className="loading-text">Checking token status...</p>;

  return (
    <div className="glassmorphism-page">
      <div className="container">
        <h1>Welcome to Cinema Talkiez</h1>
        <p><strong>User ID:</strong> {userId}</p>

        {tokenVerified && validToken ? (
          <button onClick={() => router.push("/index1")} className="visitButton">
            Visit HomePage
          </button>
        ) : tokenVerified ? (
          <div>
            <p>Token verified, but additional verification required.</p>
            <button onClick={() => router.push("/verification-success")} className="verifyButton">
              Check
            </button>
          </div>
        ) : (
          <div>
            <p>Token not verified. Please verify first.</p>
            <button onClick={() => router.push("/index.html")} className="verifyButton">
              Go to Verify Page
            </button>
          </div>
        )}

        <style jsx>{`
          .glassmorphism-page {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }

          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            max-width: 600px;
            margin: 20px;
          }

          h1 {
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 20px;
          }

          p {
            font-size: 1.2rem;
            color: #555;
            margin-bottom: 20px;
          }

          .loading-text {
            font-size: 18px;
            color: #333;
          }

          button {
            padding: 12px 24px;
            font-size: 18px;
            border: none;
            cursor: pointer;
            border-radius: 8px;
            transition: 0.3s;
            margin: 10px;
            width: 200px;
          }

          .verifyButton {
            background-color: #ff5722;
            color: white;
          }

          .verifyButton:hover {
            background-color: #e64a19;
          }

          .visitButton {
            background-color: #4caf50;
            color: white;
          }

          .visitButton:hover {
            background-color: #388e3c;
          }
        `}</style>
      </div>
    </div>
  );
}
