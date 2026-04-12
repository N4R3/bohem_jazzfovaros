import Image from "next/image";

const LOGO = "/images/bjf-logo.png";
const DUCK = "/images/bjf-duck.png";

interface Props {
  /** Show the rubber duck next to the logo. D3 omits it — duck lives in the Hero instead. */
  showDuck?: boolean;
}

export default function HeaderBrandMarks({ showDuck = true }: Props) {
  return (
    <span className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <Image
        src={LOGO}
        alt="Bohém Jazz Főváros Kecskemét"
        width={64}
        height={88}
        className="h-10 w-auto max-h-11 object-contain sm:h-11"
        priority
      />
      {showDuck && (
        <Image
          src={DUCK}
          alt=""
          width={40}
          height={40}
          className="h-9 w-9 object-contain sm:h-10 sm:w-10"
          priority
        />
      )}
    </span>
  );
}
