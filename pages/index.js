import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function IndexPage() {
  const [userId, setUserId] = useState(null);
  const [tokenVerified, setTokenVerified] = useState(false);
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

    // ✅ Check token status via backend
    fetch(`/api/check/${uid}`)
      .then(res => res.json())
      .then(data => {
        console.log("Token Check:", data); // Debug
        setTokenVerified(data.tokenVerified);
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

  if (loading) return <p>Checking token status...</p>;

  return (
    <div>
      <h1>Welcome to Cinema Talkiez</h1>
      <p><strong>User ID:</strong> {userId}</p>

      {tokenVerified ? (
        <button onClick={() => router.push("/index1")}>
          Visit HomePage
        </button>
      ) : (
        <div>
          <p>Token not verified. Please verify first.</p>
          <button onClick={() => router.push("/index.html")}>
            Go to Verify Page
          </button>
        </div>
      )}
    </div>
  );
}
