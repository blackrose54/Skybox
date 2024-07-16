import Footer from "@/components/Footer";
import {
  TypewriterEffect,
  TypewriterEffectSmooth,
} from "@/components/typewritter";
import Image from "next/image";
import Link from "next/link";

const words = [
  { text: "The" },
  { text: "easiest" },
  { text: "way" },
  { text: "to" },
  { text: "upload" },
  { text: "and" },
  { text: "share" },
  { text: "files" },
  { text: "with" },
  { text: "others" },
];

export default function Example() {
  return (
    <main className=" h-full flex flex-col justify-between">
    <div className="bg-white grow">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl space-y-8 ">
          <Image
            src="/logo.png"
            alt="logo"
            width={250}
            height={250}
            className="mx-auto rounded-full overflow-clip object-cover"
          />

          <div className="text-center space-y-8">
            <p className="mt-6 text-lg leading-8 text-gray-600 ">
              Make an account and start managing your files.
            </p>
            <TypewriterEffect
              words={words}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            />

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard/allfiles"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
      <Footer />
      </main>
  );
}
