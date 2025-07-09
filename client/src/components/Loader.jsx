import { FiLoader } from "react-icons/fi";

export default function Loader() {
  return (
    <div className="w-full flex items-center justify-center  bg-opacity-20 z-50">
      <FiLoader className="animate-spin text-[#addaea] text-5xl" />
    </div>
  );
}
