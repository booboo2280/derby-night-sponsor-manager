import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-xl mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Derby Night Tools</h1>

      <p className="text-lg mb-10 text-slate-600">
        Choose a section below to begin.
      </p>

      <div className="flex flex-col gap-6">
        <Link
          to="/sponsors"
          className="bg-blue-600 text-white py-4 rounded-lg shadow hover:bg-blue-700"
        >
          Sponsorship Manager
        </Link>

        <Link
          to="/decorations"
          className="bg-green-600 text-white py-4 rounded-lg shadow hover:bg-green-700"
        >
          Decorations
        </Link>
      </div>
    </div>
  );
}
