import { CityInfo } from "../types";

type Props = {
  list: CityInfo[];
  onClick: (city: CityInfo) => void;
  limitResults: number;
};

const SuggestionList = ({ list, onClick, limitResults }: Props): JSX.Element => {
  return (
    <div className={"absolute top-10 left-9 bg-white z-10 w-auto w-48"}>
      {renderAutoCompleteList()}
    </div>
  );

  function renderAutoCompleteList(): JSX.Element[] {
    return list.slice(0, Math.max(1, limitResults)).map((city) => (
      <button
        key={city.id}
        type={"button"}
        onClick={() => onClick(city)}
        className={"block p-1 border-b border-gray-400 text-dark text-left w-full hover:bg-sky-400"}
      >
        {city.name}, {city.country}
      </button>
    ));
  }
};

export default SuggestionList;
