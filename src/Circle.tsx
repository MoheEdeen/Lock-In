interface CircleProps {
  color: string;
  percentage: number;
  hour?: boolean;
}

export default function Circle({
  color,
  percentage,
  hour = false,
}: CircleProps) {
  return (
    <div className="flex max-w-[30%] sm:max-w-[25%] md:max-w-[20%] lg:max-w-[15%]">
      <svg viewBox="0 0 200 200" className="w-full h-auto">
        <g transform="rotate(-90 100 100)">
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1rem"
            strokeDasharray="439.8"
            strokeDashoffset="0"
            className="text-gray-100"
          ></circle>
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1rem"
            strokeDasharray="439.8"
            strokeDashoffset={440 - (440 * percentage) / (hour ? 24 : 60)}
            className={`${color} opacity-50 blur-md`}
          ></circle>
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1rem"
            strokeDasharray="439.8"
            strokeDashoffset={440 - (440 * percentage) / (hour ? 24 : 60)}
            className={`${color}`}
          ></circle>
        </g>
        <text
          className="text-[2rem] md:text-[1.5rem] font-bold"
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
        >
          {percentage.toString().padStart(2, "0")}
        </text>
      </svg>
    </div>
  );
}
