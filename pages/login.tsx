import {GetServerSidePropsContext} from "next";
import {getProviders, getSession, signIn} from "next-auth/react";
import {Provider} from "next-auth/providers";
import Layout from "../components/Layout";

type Props = {
  providers: Provider
}

const title = "Login - Open Weather"
const description = "Open weather login page"

const Login = ({providers}: Props): JSX.Element => {

  return (
    <Layout title={title}
            description={description}>
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <div className={"p-12 bg-dark-el-1 shadow-2xl flex flex-col gap-4 justify-center items-center rounded"}>
          <h1 className={"text-2xl"}>You have to log in to use Open Weather</h1>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-transparent rounded border rounded hover:bg-white group"
                      onClick={() => signIn(provider.id, {callbackUrl: "/"})}>
                <span className="w-48 h-48 rounded rotate-[-40deg] bg-[#1d9bf0] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0" />
                <span className="relative w-full text-left transition-colors duration-300 ease-in-out group-hover:text-white">
                Sign in with {provider.name}
              </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Login

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      providers,
    },
  };
}