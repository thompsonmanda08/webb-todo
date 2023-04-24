import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

import { Navbar } from "~/components/Navbar";
import TodoList from "~/components/TodoList";

const Home: NextPage = (props) => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>WEBB-TODO</title>
        <meta
          name="description"
          content="WEBB-TODO, ultimate productivity tool to track all your tasks."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="min-h-screen place-items-center gap-10 bg-gradient-to-b from-[#020005] to-[#15162c] p-10 md:grid md:grid-cols-5">
        {sessionData ? (
          <>
            <div className="mt-12 flex flex-col gap-10 md:col-span-3">
              <TodoList />
            </div>
            <div className="mt-12 flex flex-col gap-10 md:col-span-2">
              <Image
                className="rounded-2xl"
                src={"/todo.gif"}
                alt=""
                width={600}
                height={600}
              />
            </div>
          </>
        ) : (
          <div className="col-span-5 flex w-full flex-col items-center justify-center gap-12 rounded-3xl bg-white px-8 py-20 md:flex-row  md:py-14">
            <div className="">
              <h1 className="text-[2rem] font-extrabold text-slate-900 md:text-[3rem]">
                Something different
                <br />{" "}
                <span className="bg-gradient-to-br from-[#6203d5] to-[#01abfa]  bg-clip-text text-[1.75rem] text-transparent md:text-[3rem]">
                  A Dark Mode TodoApp
                </span>
              </h1>
              <p className="my-4 max-w-xl text-lg font-medium leading-8 text-slate-900">
                Get things done in style with our Dark Mode Todo Web App {"–"}{" "}
                the ultimate productivity tool. Sign In to get started. <br />{" "}
                <small className="text-sm italic text-red-800">
                  Warning: The current version of Webb-Todo is only available in
                  dark mode 🖤👌😊.
                </small>
              </p>

              <br />
              <button
                className="btn-primary btn rounded-lg px-10 py-3 font-semibold text-black no-underline transition"
                onClick={
                  sessionData ? () => void signOut() : () => void signIn()
                }
              >
                {"Get Started"}
              </button>
            </div>
            <div className="">
              <Image
                className="rounded-2xl"
                src={"/todo.gif"}
                alt=""
                width={500}
                height={500}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
