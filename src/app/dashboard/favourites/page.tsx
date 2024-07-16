import { FC, ReactElement } from "react";
import Filebrowser from "../_components/filebrowser";

interface pageProps {}

const Page: FC<pageProps> = ({}): ReactElement => {
  return <Filebrowser favourites />;
};

export default Page;
