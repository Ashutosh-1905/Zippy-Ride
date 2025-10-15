export default function Notification({ message, type = "info" }) {
  const colors = {
    info: "bg-blue-50 text-blue-800 border-blue-300",
    success: "bg-green-50 text-green-800 border-green-300",
    error: "bg-red-50 text-red-800 border-red-300",
  };
  return message ? (
    <div className={`border p-3 rounded mb-3 ${colors[type]}`}>{message}</div>
  ) : null;
}
