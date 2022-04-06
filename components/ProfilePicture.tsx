import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

type Props = {
  session?: Session | null;
};

const ProfilePicture = ({ session }: Props): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <button className={"relative"} onClick={() => setOpen(!open)}>
      <Image
        className={
          "rounded-2xl hover:scale-105 hover:rounded-none duration-300 ease-out transition-all"
        }
        src={session?.user?.image ?? "/weather-forecast/default-profile.webp"}
        alt={"pp"}
        height={64}
        width={64}
        layout={"fixed"}
        objectFit={"contain"}
      />
      {open && (
        <div className={"absolute"}>
          <button className={"p-4 bg-dark-el-1"} onClick={() => signOut()}>
            Sign Out
          </button>
        </div>
      )}
    </button>
  );
};

export default ProfilePicture;
