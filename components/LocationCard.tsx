import image from "../public/rzeszow.webp";
import Image from "next/image";
import { blurData } from "../services/imageHelper";
import { convertAlpha2CodeToCountry } from "../services/countryUtils";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CityInfo } from "../types";
import { useState } from "react";
// import SearchBar from "./SearchBar";

type Props = {
  city?: CityInfo;
  selectCity?: any;
  deleteCity?: any;
  isSelected?: boolean;
  addCity?: (city: CityInfo) => void;
};

const LocationCard = ({
  city,
  selectCity,
  deleteCity,
  addCity,
  isSelected,
}: Props): JSX.Element => {
  // const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

  if (!city) {
    return (
      <div
        className={
          "flex flex-col gap-4 items-center justify-center h-[285px] w-[285px] border border-slate-500 rounded-md"
        }
      >
        <b>+</b>
      </div>
    );
  }

  return (
    <button
      onClick={() => selectCity(city)}
      className={`${
        isSelected && "-translate-y-5"
      } hover:scale-110 transition-all duration-300 ease-out bg-transparent relative`}
    >
      <div className={"min-h-[285px] w-[285px]"}>
        <div className={"relative overflow-hidden h-[285px] w-[285px]"}>
          <Image
            src={image}
            alt={"location.png"}
            className={`rounded-2xl`}
            layout={"fixed"}
            objectFit={`cover`}
            width={285}
            height={285}
            placeholder={"blur"}
            blurDataURL={blurData}
          />
          <AiOutlineCloseCircle
            size={20}
            fill={"white"}
            onClick={() => deleteCity(city)}
            className={"absolute top-4 right-4 z-20 hover:scale-105"}
          />
        </div>
        <p className={"text-center font-bold whitespace-nowrap overflow-hidden"}>{`${
          city.name
        }, ${convertAlpha2CodeToCountry(city.country)}`}</p>
      </div>
    </button>
  );
};

export default LocationCard;
