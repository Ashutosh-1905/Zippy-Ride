export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex justify-center items-center py-8 text-gray-600 animate-pulse">
      {text}
    </div>
  );
}
