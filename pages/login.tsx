import { GetServerSidePropsContext } from "next";
import { getCsrfToken, getProviders, getSession, signIn } from "next-auth/react";
import { Provider } from "next-auth/providers";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
  providers: Provider;
  csrfToken: string;
};

type ServerMessage = {
  message?: string;
  error?: string;
};

const title = "Login - Weather Forecast";
const description = "Weather Forecast login page";

const Login = ({ providers, csrfToken }: Props): JSX.Element => {
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null);
  const [login, setLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function submitRegisterForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
    const repeatPassword = event.currentTarget.password2.value;

    console.log("repeatedpassword", repeatPassword);
    // 1. Check if all fields are filled
    if (email.length === 0 || password.length === 0 || repeatPassword.length === 0) {
      setServerMessage({ error: "Please fill out all the fields" });
      setLoading(false);
      return;
    }

    // 2. Check if email is valid
    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      )
    ) {
      setServerMessage({ error: "Please enter a valid email address" });
      setLoading(false);
      return;
    }

    // 3. Check if password is valid (at least 8 characters, at least one number, at least one uppercase letter, at least one special character)
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      setServerMessage({
        error:
          "Please enter a valid password containing at least 8 characters, at least one number, at least one uppercase letter, at least one special character",
      });
      setLoading(false);
      return;
    }

    // 4. Check if passwords match
    if (password !== repeatPassword) {
      setServerMessage({ error: "Passwords dont match" });
      setLoading(false);
      return;
    }

    // 5. Send request to server
    const response = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        email,
        password,
        csrfToken,
      }),
    });

    const data = await response.json();
    setServerMessage(data);
    setLoading(false);

    // 6. Check if registration was successful
    if (response.ok) {
      setLogin(true);
    }
  }

  async function submitLoginForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    // 1. Check if all fields are filled
    if (email.length === 0 || password.length === 0) {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }
    console.log("Logging in");

    // 2. Send request to server
    const response = await fetch("api/auth/callback/credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        email,
        password,
        csrfToken,
      }),
    });

    setLoading(false);

    // 3. Check if login was successful
    if (response.ok) {
      router.push("/");
    }
  }

  function switchForm() {
    setLogin(!login);
  }

  console.log(serverMessage);

  return (
    <Layout title={title} description={description}>
      <main className={"text-white h-screen max-h-screen  flex sm:items-center"}>
        {login ? renderLoginForm() : renderRegisterForm()}
        <svg
          className={
            "absolute max-w-full max-h-full overflow-hidden bottom-0 opacity-40 -z-10 w-full"
          }
          preserveAspectRatio={"none"}
          id="visual"
          viewBox="0 0 960 420"
          width="960"
          height="540"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
        >
          <path
            d="M0 366L40 337.3C80 308.7 160 251.3 240 245.5C320 239.7 400 285.3 480 307.8C560 330.3 640 329.7 720 279.5C800 229.3 880 129.7 920 79.8L960 30L960 541L920 541C880 541 800 541 720 541C640 541 560 541 480 541C400 541 320 541 240 541C160 541 80 541 40 541L0 541Z"
            fill="#99779f"
          ></path>
          <path
            d="M0 247L40 263.7C80 280.3 160 313.7 240 323.7C320 333.7 400 320.3 480 316.7C560 313 640 319 720 309.2C800 299.3 880 273.7 920 260.8L960 248L960 541L920 541C880 541 800 541 720 541C640 541 560 541 480 541C400 541 320 541 240 541C160 541 80 541 40 541L0 541Z"
            fill="#9465a8"
          ></path>
          <path
            d="M0 311L40 339.8C80 368.7 160 426.3 240 430C320 433.7 400 383.3 480 381.2C560 379 640 425 720 415.8C800 406.7 880 342.3 920 310.2L960 278L960 541L920 541C880 541 800 541 720 541C640 541 560 541 480 541C400 541 320 541 240 541C160 541 80 541 40 541L0 541Z"
            fill="#8a53b4"
          ></path>
          <path
            d="M0 529L40 524.5C80 520 160 511 240 487.3C320 463.7 400 425.3 480 401.5C560 377.7 640 368.3 720 378.2C800 388 880 417 920 431.5L960 446L960 541L920 541C880 541 800 541 720 541C640 541 560 541 480 541C400 541 320 541 240 541C160 541 80 541 40 541L0 541Z"
            fill="#7643c2"
          ></path>
        </svg>

        <svg
          className={"absolute -z-20 opacity-40 max-w-full max-h-full w-screen h-screen"}
          id="visual"
          viewBox="0 0 960 540"
          width="960"
          height="540"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
        >
          <g fill="#297EA6">
            <path
              d="M0 -144.4L32.4 -44.6L137.3 -44.6L52.5 17L84.9 116.8L0 55.2L-84.9 116.8L-52.5 17L-137.3 -44.6L-32.4 -44.6Z"
              transform="translate(693 118)"
            ></path>
            <path
              d="M0 -72.7L16.3 -22.5L69.1 -22.5L26.4 8.6L42.7 58.8L0 27.8L-42.7 58.8L-26.4 8.6L-69.1 -22.5L-16.3 -22.5Z"
              transform="translate(77 328)"
            ></path>
          </g>
        </svg>
      </main>
    </Layout>
  );

  function renderLoginForm() {
    console.log(serverMessage);
    return (
      <div className={"container max-w-lg p-4 sm:p-8 mx-auto"}>
        <div className={"mb-6"}>
          <h1 className={"mb-2 text-3xl font-black"}>Login to Weather Forecast</h1>
          <h2>
            Not a member?{" "}
            <button className={"text-sky-400 cursor-pointer"} onClick={switchForm}>
              Sign up
            </button>
          </h2>
        </div>
        {serverMessage?.error && <p className={"text-red-400"}>{serverMessage.error}</p>}
        {serverMessage?.message && <p className={"text-sky-700"}>{serverMessage.message}</p>}
        <form method={"post"} title={"sign up form"} name={"Sign up"} onSubmit={submitLoginForm}>
          <div className={"flex flex-col gap-6 mt-6"}>
            <div>
              <label className={"text-slate-400"}>Email</label>
              <input
                name={"email"}
                disabled={loading}
                type="email"
                placeholder="Email"
                className={`mt-2 p-4 rounded-sm block w-full bg-[#1F2329] bg-opacity-75 border-2 border-[#2D3136] ${
                  loading ? "cursor-not-allowed opacity-80" : ""
                }`}
                required
              />
            </div>
            <div>
              <label className={"text-slate-400"}>Password</label>
              <input
                name={"password"}
                disabled={loading}
                type="password"
                placeholder="Password"
                className={`mt-2 p-4 rounded-md block w-full bg-[#1F2329] bg-opacity-75 border-2 border-[#2D3136] ${
                  loading ? "cursor-not-allowed opacity-80" : ""
                }`}
                required
              />
            </div>

            <button
              type="submit"
              name={"login button"}
              onClick={() => setLoading(true)}
              className={`mt-2 p-4 bg-sky-800 rounded-md font-black drop-shadow-3xl tracking-wider relative ${
                loading ? "cursor-not-allowed opacity-80" : ""
              }`}
            >
              <svg
                className={`${
                  loading ? "animate-spin h-6 w-6 absolute" : "hidden"
                } animate-spin h-6 w-6 inline left-24 sm:left-40 " viewBox="0 0 24 24`}
              >
                <path
                  fill="#580E95"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
                <circle
                  className="opacity-30"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
              <span>LOGIN</span>
            </button>
            {/* maybe honeypot */}
            <input type="hidden" name="csrfToken" />
            <p className={"text-center"}>or</p>
            {Object.values(providers)
              .filter((p) => p.name !== "Credentials")
              .map((provider) => (
                <div key={provider.name}>
                  {/*<button className="relative px-6 py-3 w-full overflow-hidden font-medium transition-all bg-transparent border rounded-md hover:bg-white group"*/}
                  <button
                    className="relative p-4 w-full border-2 border-[#2D3136] overflow-hidden font-medium transition-all bg-[#1F2329] bg-opacity-75 border rounded-md group hover:bg-white"
                    onClick={() => signIn(provider.id, { callbackUrl: "/weather-forecast" })}
                  >
                    <span className="w-[27rem] h-[24rem] rounded rotate-[-40deg] bg-[#1d9bf0] absolute bottom-0 left-0 -translate-x-full ease-out duration-300 transition-all translate-y-full mb-9 ml-9 group-hover:-ml-24 group-hover:mb-56 group-hover:translate-x-0" />
                    <span className="relative w-full text-left transition-colors duration-300 ease-in-out group-hover:text-white">
                      Sign in with {provider.name}
                    </span>
                  </button>
                </div>
              ))}
          </div>
        </form>
      </div>
    );
  }

  function renderRegisterForm() {
    console.log(serverMessage);
    return (
      <div className={"container max-w-lg p-4 sm:p-8 mx-auto"}>
        <div className={"mb-6"}>
          <h1 className={"mb-2 text-3xl font-black"}>Create an account</h1>
          <h2>
            Already a member?{" "}
            <button className={"text-sky-400 cursor-pointer"} onClick={switchForm}>
              Sign in
            </button>
          </h2>
        </div>
        {serverMessage?.error && <p className={"text-red-500"}>{serverMessage.error}</p>}
        {serverMessage?.message && <p className={"text-sky-700"}>{serverMessage.message}</p>}
        <form method={"post"} onSubmit={submitRegisterForm}>
          <div className={"flex flex-col gap-6 mt-6"}>
            <div>
              <label className={"text-slate-400"}>Email</label>
              <input
                name={"email"}
                type="email"
                placeholder="Email"
                disabled={loading}
                className={`mt-2 p-4 rounded-md block w-full bg-[#1F2329] bg-opacity-75 border-2 border-[#2D3136] ${
                  loading ? "opacity-80" : ""
                }`}
                required
              />
            </div>
            <div>
              <label className={"text-slate-400"}>Password</label>
              <input
                name={"password"}
                type="password"
                placeholder="Password"
                disabled={loading}
                className={`mt-2 p-4 rounded-md block w-full bg-[#1F2329] bg-opacity-75 border-2 border-[#2D3136] ${
                  loading ? "opacity-80" : ""
                }`}
                required
              />
            </div>

            <div>
              <label className={"text-slate-400"}>Repeat Password</label>
              <input
                name={"password2"}
                type="password"
                placeholder="Password"
                disabled={loading}
                className={`mt-2 p-4 rounded-md block w-full bg-[#1F2329] bg-opacity-75 border-2 border-[#2D3136] ${
                  loading ? "opacity-80" : ""
                }`}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 p-4 bg-sky-800 rounded-md font-black drop-shadow-3xl tracking-wider relative ${
                loading ? "cursor-not-allowed opacity-80" : ""
              }`}
            >
              <svg
                className={`${
                  loading ? "animate-spin h-6 w-6 absolute" : "hidden"
                } animate-spin h-6 w-6 inline left-24 sm:left-36 " viewBox="0 0 24 24`}
              >
                <path
                  fill="#580E95"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
                <circle
                  className="opacity-30"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
              <span>REGISTER</span>
            </button>
            {/* maybe honeypot */}
            <input type="hidden" name="csrfToken" />
          </div>
        </form>
      </div>
    );
  }
};

export default Login;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfTokenPromise = getCsrfToken(context);
  const providersPromise = getProviders();
  const userSessionPromise = getSession(context);

  const [csrfToken, providers, userSession] = await Promise.all([
    csrfTokenPromise,
    providersPromise,
    userSessionPromise,
  ]);

  if (userSession) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      providers,
      csrfToken,
    },
  };
}
