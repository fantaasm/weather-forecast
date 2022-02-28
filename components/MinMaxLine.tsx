type Props = {
  min: number
  max: number
}

const MinMaxLine = ({min, max}: Props): JSX.Element => {
  return (
    <div className="w-full grid grid-cols-2 grid-rows-1 bg-gray-300 bg-opacity-80">
      <svg height="5" width={Math.abs(min * 3)} className={"justify-self-end"}>
        <line x1="0" y1="0" x2="80" y2="0" style={{stroke: "rgb(0,0,255)", strokeWidth: 8}} />
      </svg>
      <svg height="5" width={Math.abs(max * 3)}>
        <line x1="0" y1="0" x2="80" y2="0" style={{stroke: "rgb(255,0,0)", strokeWidth: 8}} />
      </svg>
    </div>
  );
}

export default MinMaxLine