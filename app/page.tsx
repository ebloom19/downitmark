import Image from "next/image";
import Link from "next/link";
import { FileUploader } from "./components/FileUploader";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <FileUploader />
    </main>
  );
}
