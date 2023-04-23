import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const Navbar = () => {
  const { data: sessionData } = useSession();

  return (
    <nav className="bg-b navbar fixed top-0 z-50 border-b-[1px] border-base-300 bg-transparent bg-gradient-to-b from-[#ffffff09] to-[#a8a8a805] backdrop-blur-md ">
      <div className="flex-1">
        <a className="btn-ghost btn text-xl normal-case">WeeDoo</a>
      </div>

      {sessionData ? (
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className=" flex">
            <div
              className={` ${
                sessionData.user.image
                  ? " border-transparent bg-transparent outline-transparent hover:border-transparent hover:bg-transparent hover:outline-transparent"
                  : "bg-slate-500 text-3xl text-slate-50"
              }avatar btn rounded-full`}
            >
              {sessionData?.user.image ? (
                <Image
                  className="rounded-full border-[1px] border-[#00c8ff39] object-cover"
                  src={sessionData?.user.image}
                  alt="Image of user"
                  width={40}
                  height={40}
                />
              ) : (
                sessionData.user.name?.trim()[0]
              )}
            </div>
            <div className="btn-ghost btn -ml-4 flex flex-col items-start capitalize">
              <p>{sessionData ? sessionData?.user.name : "username"}</p>
              <span className="text-sm !capitalize text-slate-600 hover:text-slate-400 hover:underline">
                {sessionData && "View Account"}
              </span>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li
              className=" px-4 py-3 font-semibold text-white no-underline transition hover:bg-slate-800"
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
              {sessionData ? "Sign out" : "Sign in"}
            </li>
          </ul>
        </div>
      ) : (
        <button
          className="btn-outline btn-primary btn px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => void signIn()}
        >
          {"Sign in"}
        </button>
      )}
    </nav>
  );
};
