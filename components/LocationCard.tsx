import image from "../public/rzeszow.png"
import Image from "next/image"
import {blurData} from "../util/imageHelper"
import {convertAlpha2CodeToCountry} from "../util/countryUtils";
import {AiOutlineCloseCircle} from "react-icons/ai"
import {CityInfo} from "../types/weather";
import {useState} from "react";
import SearchBar from "./SearchBar";

type Props = {
  city?: CityInfo
  selectCity?: any
  deleteCity?: any
  isSelected?: boolean
  addCity?: (city:CityInfo) => void
}

const LocationCard = ({city, selectCity, deleteCity, addCity ,isSelected}: Props): JSX.Element => {
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false)

  if (!city) {
    return (
      <button onClick={() => setShowSearchBar(!showSearchBar)}
              className={"rounded-2xl border-2 border-gray-600 hover:text-sky-600 hover:border-sky-600"}>
        <div className={"flex flex-col gap-4 items-center justify-center z-40"}>
          {
            showSearchBar && <SearchBar  onSubmit={addCity} limit={3} />
            ||
              <>
                <b>+</b>
                <b>Add City</b>
              </>
          }
        </div>
      </button>
    );
  }

  return (
    <button onClick={() => selectCity(city)}
            className={`${isSelected && "-translate-y-5"} hover:scale-110 transition-all duration-300 ease-out bg-transparent relative`}>
      <div className={"h-full"}>
        <Image src={image} alt={"location.png"} className={`rounded-2xl`} layout={"responsive"}
               width={56} height={56} placeholder={"blur"} blurDataURL={blurData} />
        <AiOutlineCloseCircle size={20} fill={"white"} onClick={() => deleteCity(city)} className={"absolute top-4 right-4 z-20 hover:scale-105"} />
        <p className={"text-center font-bold whitespace-nowrap overflow-hidden"}>{`${city.name}, ${convertAlpha2CodeToCountry(city.country)}`}</p>
      </div>
    </button>
  );
}

export default LocationCard