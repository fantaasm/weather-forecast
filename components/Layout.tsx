import {ReactNode} from "react";
import {NextSeo} from "next-seo";

type Props = {
  children: ReactNode
  title: string
  description: string
}

const Layout = ({children, title, description}: Props): JSX.Element => {
  return (
    <>
      <NextSeo title={title}
               description={description}
               openGraph={{title, description}} />
      {children}
    </>
  );
}

export default Layout